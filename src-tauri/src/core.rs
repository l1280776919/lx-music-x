use crate::{
    audio::Equalizer,
    library::{Database, Library, Song},
    lyrics::Lyrics,
    online,
};
use rodio::{Decoder, OutputStream, Sink, Source};
use serde_json::{json, Value};
use std::{
    fs::File,
    io::{BufReader, Cursor, Read},
    path::PathBuf,
    sync::{mpsc, Arc, Mutex},
    time::Duration,
};
use tauri::{AppHandle, Emitter, Manager};

type Reply = mpsc::Sender<Result<Value, String>>;
enum Message {
    Command(String, Value, Reply),
    Loaded(u64, Box<Result<(Song, Vec<u8>), String>>),
}
#[derive(Clone)]
pub struct Core {
    tx: mpsc::Sender<Message>,
}

impl Core {
    pub fn start(app: AppHandle, path: PathBuf) -> Result<Self, String> {
        let db = Database::open(&path)?;
        let library = db.load()?;
        let (tx, rx) = mpsc::channel();
        let core = Self { tx: tx.clone() };
        std::thread::spawn(move || {
            let (resolve_tx, resolve_rx) = mpsc::channel::<(u64, Song, String)>();
            std::thread::spawn(move || {
                while let Ok(mut job) = resolve_rx.recv() {
                    // Discard queued, obsolete selections before doing network work.
                    for latest in resolve_rx.try_iter() {
                        job = latest;
                    }
                    let (generation, song, script) = job;
                    let result = resolve(song, &script);
                    if tx
                        .send(Message::Loaded(generation, Box::new(result)))
                        .is_err()
                    {
                        break;
                    }
                }
            });
            // The OS stream lives on this thread for its entire lifetime.
            let mut output = OutputStream::try_default().ok();
            let eq = Arc::new(Mutex::new(library.eq));
            let mut engine = Engine {
                emit_event: Box::new(move |event, payload| {
                    let _ = app.emit(event, payload);
                }),
                db,
                library,
                sink: None,
                eq,
                lyrics: Lyrics::default(),
                generation: 0,
                loading: false,
                error: None,
                duration: 0.,
                resolve_tx,
                revision: 0,
            };
            loop {
                match rx.recv_timeout(Duration::from_millis(200)) {
                    Ok(Message::Command(action, data, reply)) => {
                        let result = engine.command(&action, data);
                        if let Err(e) = &result {
                            engine.error = Some(e.clone());
                        }
                        engine.emit();
                        let _ = reply.send(result);
                    }
                    Ok(Message::Loaded(generation, result)) if generation == engine.generation => {
                        engine.loading = false;
                        if output.is_none() {
                            output = OutputStream::try_default().ok();
                        }
                        let result = (*result).and_then(|(song, bytes)| {
                            let handle = &output.as_ref().ok_or("未找到可用音频输出设备")?.1;
                            let sink = Sink::try_new(handle).map_err(|e| e.to_string())?;
                            let source: Box<dyn Source<Item = f32> + Send> =
                                if !song.path.is_empty() {
                                    let decoder = Decoder::new(BufReader::new(
                                        File::open(&song.path).map_err(|e| e.to_string())?,
                                    ))
                                    .map_err(|e| e.to_string())?;
                                    Box::new(decoder.convert_samples())
                                } else {
                                    Box::new(
                                        Decoder::new(Cursor::new(bytes))
                                            .map_err(|e| e.to_string())?
                                            .convert_samples(),
                                    )
                                };
                            engine.duration = source
                                .total_duration()
                                .map(|d| d.as_secs_f64())
                                .unwrap_or(0.);
                            sink.append(Equalizer::new(source, engine.eq.clone()));
                            sink.set_volume(if engine.library.muted {
                                0.
                            } else {
                                engine.library.volume
                            });
                            engine.lyrics = Lyrics::parse(&song.lrc);
                            if let Some(current) =
                                engine.library.queue.get_mut(engine.library.current_index)
                            {
                                *current = song;
                            }
                            engine.sink = Some(sink);
                            Ok(())
                        });
                        if let Err(error) = result {
                            engine.error = Some(error);
                        }
                        engine.emit();
                    }
                    Ok(_) => {}
                    Err(mpsc::RecvTimeoutError::Disconnected) => break,
                    Err(mpsc::RecvTimeoutError::Timeout) => {}
                }
                if engine.sink.as_ref().is_some_and(|s| s.empty()) && !engine.loading {
                    let before = engine.library.clone();
                    engine.library.advance(false, true);
                    if let Err(e) = engine
                        .db
                        .save(&engine.library)
                        .and_then(|_| engine.start_track())
                    {
                        engine.library = before;
                        engine.stop();
                        engine.error = Some(e);
                    }
                    engine.emit();
                }
                engine.tick();
            }
        });
        Ok(core)
    }
    pub fn command(&self, action: String, data: Value) -> Result<Value, String> {
        let (tx, rx) = mpsc::channel();
        self.tx
            .send(Message::Command(action, data, tx))
            .map_err(|e| e.to_string())?;
        rx.recv_timeout(Duration::from_secs(10))
            .map_err(|e| e.to_string())?
    }
}

fn resolve(mut song: Song, script: &str) -> Result<(Song, Vec<u8>), String> {
    if !song.path.is_empty() {
        if !std::path::Path::new(&song.path).is_file() {
            return Err("本地音频文件不存在".into());
        }
        if song.lrc.is_empty() {
            song.lrc =
                std::fs::read_to_string(std::path::Path::new(&song.path).with_extension("lrc"))
                    .unwrap_or_default();
        }
        return Ok((song, vec![]));
    }
    let url = online::call("url", json!(song), script)?
        .as_str()
        .filter(|s| !s.is_empty())
        .ok_or("此歌曲没有可播放地址，请配置支持该平台的音源")?
        .to_owned();
    let parsed = reqwest::Url::parse(&url).map_err(|e| e.to_string())?;
    if !["http", "https"].contains(&parsed.scheme()) {
        return Err("无效播放地址".into());
    }
    let response = online::client()?
        .get(parsed)
        .send()
        .and_then(|r| r.error_for_status())
        .map_err(|e| e.to_string())?;
    // A bounded buffer makes native decoding/seek deterministic and avoids retaining
    // signed playback URLs across sessions. Streaming can replace this transport.
    let mut bytes = Vec::new();
    response
        .take(128 * 1024 * 1024 + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() > 128 * 1024 * 1024 {
        return Err("音频超过 128 MiB 缓冲上限".into());
    }
    if song.lrc.is_empty() {
        song.lrc = online::call("lyric", json!(song), script)
            .ok()
            .and_then(|v| v.as_str().map(str::to_owned))
            .unwrap_or_default();
    }
    Ok((song, bytes))
}

type EventSink = Box<dyn Fn(&str, Value)>;
struct Engine {
    emit_event: EventSink,
    db: Database,
    library: Library,
    sink: Option<Sink>,
    eq: Arc<Mutex<[f32; 10]>>,
    lyrics: Lyrics,
    generation: u64,
    loading: bool,
    error: Option<String>,
    duration: f64,
    resolve_tx: mpsc::Sender<(u64, Song, String)>,
    revision: u64,
}
impl Engine {
    fn playing(&self) -> bool {
        self.sink
            .as_ref()
            .is_some_and(|s| !s.is_paused() && !s.empty())
    }
    fn time(&self) -> f64 {
        self.sink
            .as_ref()
            .map(|s| s.get_pos().as_secs_f64())
            .unwrap_or(0.)
    }
    fn playback(&self) -> Value {
        let time = self.time();
        let index = self.lyrics.index(time);
        json!({"isPlaying":self.playing(),"currentTime":time,"duration":self.duration,"loading":self.loading,"error":self.error,
            "currentLineIndex":index,"currentLineText":self.lyrics.line(index),"nextLineText":self.lyrics.line(index+1)})
    }
    fn snapshot(&self) -> Value {
        json!({"revision":self.revision,"library":self.library,"playback":self.playback(),"lyricLines":self.lyrics.0.iter().map(|(_,s)|s).collect::<Vec<_>>(),"lyricEntries":self.lyrics.0.iter().map(|(t,s)|json!({"time":t,"text":s})).collect::<Vec<_>>()})
    }
    fn emit(&mut self) {
        self.revision += 1;
        (self.emit_event)("core-state", self.snapshot());
    }
    fn tick(&self) {
        (self.emit_event)("core-playback", self.playback());
        let index = self.lyrics.index(self.time());
        let song = self.library.current();
        (self.emit_event)(
            "lyric-sync",
            json!({"currentLine":self.lyrics.line(index),"nextLine":self.lyrics.line(index+1),"isPlaying":self.playing(),"songName":song.map(|s|s.name.as_str()).unwrap_or(""),"singer":song.map(|s|s.singer.as_str()).unwrap_or("")}),
        );
    }
    fn stop(&mut self) {
        self.generation += 1;
        self.loading = false;
        if let Some(s) = self.sink.take() {
            s.stop();
        }
        self.duration = 0.;
        self.lyrics = Lyrics::default();
    }
    fn start_track(&mut self) -> Result<(), String> {
        self.stop();
        self.error = None;
        if let Some(song) = self.library.current().cloned() {
            self.loading = true;
            self.resolve_tx
                .send((
                    self.generation,
                    song,
                    self.library.script["rawCode"].as_str().unwrap_or("").into(),
                ))
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    }
    fn command(&mut self, action: &str, data: Value) -> Result<Value, String> {
        if action == "snapshot" {
            return Ok(self.snapshot());
        }
        let before = self.library.clone();
        let mut result = json!(true);
        let mut start = false;
        let mut stop = false;
        match action {
            "toggle" => {
                if self.loading {
                    self.stop();
                } else if let Some(s) = &self.sink {
                    if s.is_paused() {
                        s.play()
                    } else {
                        s.pause()
                    }
                } else {
                    start = true;
                }
            }
            "play" | "add" => {
                let song: Song =
                    serde_json::from_value(data["song"].clone()).map_err(|e| e.to_string())?;
                if song.id.is_empty() {
                    return Err("歌曲标识不能为空".into());
                }
                let index = if let Some(i) = self.library.queue.iter().position(|s| s.same(&song)) {
                    i
                } else {
                    self.library.queue.push(song);
                    self.library.queue.len() - 1
                };
                if action == "play" || data["playNow"] == true {
                    self.library.current_index = index;
                    start = true;
                }
            }
            "replace" => {
                self.library.queue =
                    serde_json::from_value(data["songs"].clone()).map_err(|e| e.to_string())?;
                self.library.current_index = data["index"].as_u64().unwrap_or(0) as usize;
                self.library.normalize();
                start = true;
            }
            "next" | "prev" => {
                self.library.advance(action == "prev", false);
                start = true;
            }
            "remove" => {
                let changed = self
                    .library
                    .remove_queue(data["index"].as_u64().ok_or("队列索引无效")? as usize)?;
                if changed {
                    start = self.playing() || self.loading;
                    stop = !start;
                }
            }
            "clear" => {
                self.library.queue.clear();
                self.library.current_index = 0;
                stop = true;
            }
            "volume" => {
                self.library.volume =
                    data["value"].as_f64().ok_or("音量无效")?.clamp(0., 1.) as f32;
            }
            "mute" => {
                self.library.muted = !self.library.muted;
            }
            "mode" => {
                self.library.mode = match self.library.mode.as_str() {
                    "list" => "single",
                    "single" => "random",
                    _ => "list",
                }
                .into();
            }
            "seek" => {
                let time = data["time"]
                    .as_f64()
                    .filter(|v| v.is_finite())
                    .ok_or("进度无效")?;
                if let Some(s) = &self.sink {
                    s.try_seek(Duration::from_secs_f64(time.max(0.).min(
                        if self.duration > 0. {
                            self.duration
                        } else {
                            time.max(0.)
                        },
                    )))
                    .map_err(|e| e.to_string())?;
                }
            }
            "eq" => {
                if let Some(values) = data.get("values") {
                    self.library.eq =
                        serde_json::from_value(values.clone()).map_err(|e| e.to_string())?;
                } else {
                    let index = data["index"].as_u64().ok_or("频段无效")? as usize;
                    if index >= 10 {
                        return Err("频段无效".into());
                    }
                    self.library.eq[index] = data["gain"].as_f64().ok_or("增益无效")? as f32;
                }
                self.library.normalize();
            }
            "library" => {
                let mut candidate = self.library.clone();
                result =
                    candidate.edit(data["action"].as_str().unwrap_or(""), data["data"].clone())?;
                self.library = candidate;
            }
            "script" => {
                self.library.script = data;
            }
            _ => return Err(format!("未知播放操作: {action}")),
        }
        if let Err(e) = self.db.save(&self.library) {
            self.library = before;
            return Err(e);
        }
        *self.eq.lock().map_err(|e| e.to_string())? = self.library.eq;
        if stop {
            self.stop();
        }
        if let Some(s) = &self.sink {
            s.set_volume(if self.library.muted {
                0.
            } else {
                self.library.volume
            });
        }
        if start {
            self.start_track()?;
        }
        Ok(result)
    }
}

#[tauri::command]
pub async fn core_command(
    core: tauri::State<'_, Core>,
    action: String,
    data: Option<Value>,
) -> Result<Value, String> {
    let core = core.inner().clone();
    tauri::async_runtime::spawn_blocking(move || core.command(action, data.unwrap_or(Value::Null)))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn online_command(
    core: tauri::State<'_, Core>,
    action: String,
    data: Value,
) -> Result<Value, String> {
    let core = core.inner().clone();
    tauri::async_runtime::spawn_blocking(move || {
        let snapshot = core.command("snapshot".into(), Value::Null)?;
        let script = snapshot["library"]["script"]["rawCode"]
            .as_str()
            .unwrap_or("");
        online::call(&action, data, script)
    })
    .await
    .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn user_api_command(
    core: tauri::State<'_, Core>,
    action: String,
    data: Value,
) -> Result<Value, String> {
    let core = core.inner().clone();
    tauri::async_runtime::spawn_blocking(move || {
        if action == "get" {
            return Ok(core.command("snapshot".into(), Value::Null)?["library"]["script"].clone());
        }
        if action == "reset" {
            core.command("script".into(), Value::Null)?;
            return Ok(Value::Null);
        }
        let url = data["url"].as_str();
        let code = if action == "url" {
            online::request(url.ok_or("缺少音源地址")?, json!({}))?["raw"]
                .as_str()
                .ok_or("音源内容无效")?
                .to_owned()
        } else {
            data["code"].as_str().ok_or("缺少音源代码")?.to_owned()
        };
        if code.len() > 2 * 1024 * 1024 {
            return Err("音源脚本超过 2 MiB 限制".into());
        }
        online::call("validate", json!({}), &code)?;
        let meta = online::script_meta(&code, url);
        core.command("script".into(), meta.clone())?;
        Ok(meta)
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn remote(app: &AppHandle, action: &str) {
    let core = app.state::<Core>().inner().clone();
    let action = action.to_owned();
    std::thread::spawn(move || {
        let _ = core.command(action, Value::Null);
    });
}

#[cfg(test)]
mod tests {
    use super::*;
    fn engine() -> (Engine, mpsc::Receiver<(u64, Song, String)>) {
        let (tx, rx) = mpsc::channel();
        (
            Engine {
                emit_event: Box::new(|_, _| {}),
                db: Database::open(std::path::Path::new(":memory:")).unwrap(),
                library: Library::default(),
                sink: None,
                eq: Arc::new(Mutex::new([0.; 10])),
                lyrics: Lyrics::default(),
                generation: 0,
                loading: false,
                error: None,
                duration: 0.,
                resolve_tx: tx,
                revision: 0,
            },
            rx,
        )
    }
    #[test]
    fn quick_selection_invalidates_previous_load() {
        let (mut e, rx) = engine();
        e.command("play", json!({"song":{"id":"a","name":"a"}}))
            .unwrap();
        let first = rx.recv().unwrap();
        e.command("play", json!({"song":{"id":"b","name":"b"}}))
            .unwrap();
        let second = rx.recv().unwrap();
        assert!(second.0 > first.0);
        assert_eq!(second.0, e.generation);
        e.command("clear", Value::Null).unwrap();
        assert!(e.generation > second.0);
        assert!(!e.loading);
        assert!(e.library.current().is_none());
    }
    #[test]
    fn invalid_migration_is_atomic() {
        let (mut e, _rx) = engine();
        let old = json!(e.library);
        assert!(e
            .command(
                "library",
                json!({"action":"migrate","data":{"playlists":[],"queue":"invalid"}})
            )
            .is_err());
        assert_eq!(json!(e.library), old);
    }
    #[test]
    fn deleting_paused_selection_does_not_autoplay() {
        let (mut e, rx) = engine();
        e.command("add", json!({"song":{"id":"a"}})).unwrap();
        e.command("add", json!({"song":{"id":"b"}})).unwrap();
        e.command("remove", json!({"index":0})).unwrap();
        assert!(!e.loading);
        assert_eq!(e.library.current().unwrap().id, "b");
        assert!(rx.try_recv().is_err());
    }
    #[test]
    fn nullable_legacy_song_fields_are_accepted() {
        let s: Song = serde_json::from_value(json!({"id":123,"pic":null,"lrc":null})).unwrap();
        assert_eq!(s.id, "123");
        assert!(s.lrc.is_empty());
    }
}
