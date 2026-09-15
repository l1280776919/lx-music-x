use crate::{core::Core, library::Song, online};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{
    collections::HashMap,
    path::PathBuf,
    sync::{
        mpsc::{self, Sender},
        Arc, Mutex,
    },
};
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadTask {
    pub id: String,
    pub song_id: String,
    pub name: String,
    pub singer: String,
    pub album: String,
    pub status: String, // "pending", "downloading", "completed", "error", "skipped"
    pub progress: f32,
    pub error: Option<String>,
    pub file_path: Option<String>,
}

#[derive(Clone)]
pub struct DownloadManager {
    tasks: Arc<Mutex<HashMap<String, DownloadTask>>>,
    queue_tx: Sender<Song>,
}

impl DownloadManager {
    pub fn new(app: AppHandle, core: Core) -> Self {
        let tasks = Arc::new(Mutex::new(HashMap::<String, DownloadTask>::new()));
        let (queue_tx, queue_rx) = mpsc::channel::<Song>();

        let tasks_clone = tasks.clone();
        let app_clone = app.clone();

        std::thread::spawn(move || {
            while let Ok(song) = queue_rx.recv() {
                let _song_id = song.id.clone();
                let task_key = format!("{}_{}", song.source, song.id);

                // Update status to downloading
                {
                    if let Ok(mut map) = tasks_clone.lock() {
                        if let Some(task) = map.get_mut(&task_key) {
                            task.status = "downloading".into();
                            task.progress = 0.1;
                        }
                    }
                }
                emit_task_update(&app_clone, &tasks_clone, &task_key);

                let result = download_and_import_song(&app_clone, &core, song.clone(), &tasks_clone, &task_key);

                {
                    if let Ok(mut map) = tasks_clone.lock() {
                        if let Some(task) = map.get_mut(&task_key) {
                            match result {
                                Ok(file_path) => {
                                    task.status = "completed".into();
                                    task.progress = 1.0;
                                    task.file_path = Some(file_path);
                                    task.error = None;
                                }
                                Err(err) => {
                                    task.status = "error".into();
                                    task.error = Some(err);
                                }
                            }
                        }
                    }
                }
                emit_task_update(&app_clone, &tasks_clone, &task_key);
            }
        });

        Self { tasks, queue_tx }
    }

    pub fn add_tasks(&self, app: &AppHandle, songs: Vec<Song>) -> Vec<DownloadTask> {
        let mut added = Vec::new();
        let mut map = match self.tasks.lock() {
            Ok(m) => m,
            Err(e) => e.into_inner(),
        };

        for song in songs {
            let task_key = format!("{}_{}", song.source, song.id);
            if let Some(existing) = map.get(&task_key) {
                if existing.status == "downloading" || existing.status == "pending" {
                    continue;
                }
            }

            let task = DownloadTask {
                id: task_key.clone(),
                song_id: song.id.clone(),
                name: song.name.clone(),
                singer: song.singer.clone(),
                album: song.album.clone(),
                status: "pending".into(),
                progress: 0.0,
                error: None,
                file_path: None,
            };

            map.insert(task_key.clone(), task.clone());
            let _ = self.queue_tx.send(song);
            added.push(task);
        }

        let _ = app.emit("download-tasks-updated", map.values().cloned().collect::<Vec<_>>());
        added
    }

    pub fn get_tasks(&self) -> Vec<DownloadTask> {
        let map = match self.tasks.lock() {
            Ok(m) => m,
            Err(e) => e.into_inner(),
        };
        map.values().cloned().collect()
    }
}

fn emit_task_update(app: &AppHandle, tasks: &Arc<Mutex<HashMap<String, DownloadTask>>>, key: &str) {
    if let Ok(map) = tasks.lock() {
        if let Some(task) = map.get(key) {
            let _ = app.emit("download-task-progress", task.clone());
        }
        let _ = app.emit("download-tasks-updated", map.values().cloned().collect::<Vec<_>>());
    }
}

fn get_download_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .download_dir()
        .or_else(|_| app.path().audio_dir())
        .map_err(|e| e.to_string())?
        .join("LX-Music");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn download_and_import_song(
    app: &AppHandle,
    core: &Core,
    mut song: Song,
    tasks: &Arc<Mutex<HashMap<String, DownloadTask>>>,
    task_key: &str,
) -> Result<String, String> {
    let download_dir = get_download_dir(app)?;

    let clean_singer = song
        .singer
        .replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_");
    let clean_name = song
        .name
        .replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_");
    let file_stem = if clean_singer.is_empty() {
        clean_name
    } else {
        format!("{clean_singer} - {clean_name}")
    };

    // Check if matching audio file already exists
    let audio_exts = ["mp3", "flac", "wav", "m4a", "ogg"];
    for ext in audio_exts {
        let existing = download_dir.join(format!("{file_stem}.{ext}"));
        if existing.is_file() {
            let file_path_str = existing.to_string_lossy().to_string();
            // Ensure it is in the local playlist
            let local_item = Song {
                id: format!("local_{}", file_path_str),
                name: song.name.clone(),
                singer: song.singer.clone(),
                album: if song.album.is_empty() { "本地下载".into() } else { song.album.clone() },
                path: file_path_str.clone(),
                url: String::new(),
                source: "local".into(),
                pic: song.pic.clone(),
                lrc: song.lrc.clone(),
                tlrc: song.tlrc.clone(),
                interval: song.interval.clone(),
                raw: song.raw.clone(),
            };
            let _ = core.command("library".into(), json!({
                "action": "add",
                "data": {
                    "listId": "local",
                    "song": local_item
                }
            }));
            return Ok(file_path_str);
        }
    }

    let snapshot = core.command("snapshot".into(), serde_json::Value::Null)?;
    let script = snapshot["library"]["script"]["rawCode"]
        .as_str()
        .unwrap_or("")
        .to_string();

    let url = if !song.url.is_empty() {
        song.url.clone()
    } else {
        online::call("url", json!(song), &script)?
            .as_str()
            .filter(|s| !s.is_empty())
            .ok_or("该歌曲没有可下载的音频播放地址")?
            .to_string()
    };

    {
        if let Ok(mut map) = tasks.lock() {
            if let Some(task) = map.get_mut(task_key) {
                task.progress = 0.3;
            }
        }
    }
    emit_task_update(app, tasks, task_key);

    let client = online::client()?;
    let mut resp = client.get(&url).send().map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("下载失败，服务器返回 HTTP {}", resp.status()));
    }

    let total_size = resp.content_length().unwrap_or(0);
    let mut bytes = Vec::new();
    if total_size > 0 {
        let mut buffer = [0u8; 16384];
        use std::io::Read;
        let mut downloaded = 0usize;
        loop {
            let n = resp.read(&mut buffer).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            bytes.extend_from_slice(&buffer[..n]);
            downloaded += n;
            let p = 0.3 + 0.6 * (downloaded as f32 / total_size as f32);
            if let Ok(mut map) = tasks.lock() {
                if let Some(task) = map.get_mut(task_key) {
                    task.progress = p.clamp(0.3, 0.9);
                }
            }
        }
    } else {
        use std::io::Read;
        resp.read_to_end(&mut bytes).map_err(|e| e.to_string())?;
    }

    let lower_url = url.to_lowercase();
    let ext = if lower_url.contains(".flac") {
        "flac"
    } else if lower_url.contains(".m4a") {
        "m4a"
    } else if lower_url.contains(".ogg") {
        "ogg"
    } else if lower_url.contains(".wav") {
        "wav"
    } else {
        "mp3"
    };

    let file_path = download_dir.join(format!("{file_stem}.{ext}"));
    std::fs::write(&file_path, bytes).map_err(|e| e.to_string())?;

    // Lyric download
    let (lrc, tlrc) = if !song.lrc.is_empty() || !song.tlrc.is_empty() {
        (song.lrc.clone(), song.tlrc.clone())
    } else {
        online::call("lyric", json!(song), &script)
            .ok()
            .map(|v| {
                if let Some(s) = v.as_str() {
                    (s.to_string(), String::new())
                } else {
                    let l = v.get("lyric").and_then(|l| l.as_str()).unwrap_or("").to_string();
                    let t = v.get("tlyric").or_else(|| v.get("tlrc")).and_then(|t| t.as_str()).unwrap_or("").to_string();
                    (l, t)
                }
            })
            .unwrap_or_default()
    };

    if !lrc.is_empty() {
        let lrc_path = download_dir.join(format!("{file_stem}.lrc"));
        let _ = std::fs::write(lrc_path, &lrc);
        song.lrc = lrc;
    }
    if !tlrc.is_empty() {
        let tlrc_path = download_dir.join(format!("{file_stem}.tlrc"));
        let _ = std::fs::write(tlrc_path, &tlrc);
        song.tlrc = tlrc;
    }

    let file_path_str = file_path.to_string_lossy().to_string();

    // Auto-import to local playlist
    let local_item = Song {
        id: format!("local_{}", file_path_str),
        name: song.name,
        singer: song.singer,
        album: if song.album.is_empty() { "本地下载".into() } else { song.album },
        path: file_path_str.clone(),
        url: String::new(),
        source: "local".into(),
        pic: song.pic,
        lrc: song.lrc,
        tlrc: song.tlrc,
        interval: song.interval,
        raw: song.raw,
    };

    core.command("library".into(), json!({
        "action": "add",
        "data": {
            "listId": "local",
            "song": local_item
        }
    }))?;

    Ok(file_path_str)
}
