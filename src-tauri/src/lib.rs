use std::path::PathBuf;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ImportedSong {
    pub id: String,
    pub list_id: String,
    pub name: String,
    pub singer: String,
    pub source: String,
    pub interval: String,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ImportedPlaylist {
    pub id: String,
    pub name: String,
    pub songs: Vec<ImportedSong>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct ImportResult {
    pub found: bool,
    pub db_path: String,
    pub playlists: Vec<ImportedPlaylist>,
    pub total_songs: usize,
    pub user_api_count: usize,
}

#[tauri::command]
fn scan_and_import_legacy_data() -> Result<ImportResult, String> {
    let mut db_path = PathBuf::new();

    #[cfg(target_os = "windows")]
    {
        if let Ok(appdata) = std::env::var("APPDATA") {
            db_path = PathBuf::from(appdata)
                .join("lx-music-desktop")
                .join("LxDatas")
                .join("lx.data.db");
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(home) = std::env::var("HOME") {
            db_path = PathBuf::from(home)
                .join(".config")
                .join("lx-music-desktop")
                .join("LxDatas")
                .join("lx.data.db");
        }
    }

    if !db_path.exists() {
        return Ok(ImportResult {
            found: false,
            db_path: db_path.to_string_lossy().to_string(),
            playlists: vec![],
            total_songs: 0,
            user_api_count: 0,
        });
    }

    let conn = rusqlite::Connection::open(&db_path).map_err(|e| e.to_string())?;

    // 查询所有自定义歌单
    let mut stmt = conn
        .prepare("SELECT id, name FROM my_list ORDER BY position ASC")
        .map_err(|e| e.to_string())?;

    let list_rows = stmt
        .query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        })
        .map_err(|e| e.to_string())?;

    let mut playlists = Vec::new();
    let mut total_songs = 0;

    for item in list_rows {
        if let Ok((list_id, list_name)) = item {
            let mut song_stmt = conn
                .prepare("SELECT id, listId, name, singer, source, interval FROM my_list_music_info WHERE listId = ?1")
                .map_err(|e| e.to_string())?;

            let song_rows = song_stmt
                .query_map([&list_id], |row| {
                    Ok(ImportedSong {
                        id: row.get(0)?,
                        list_id: row.get(1)?,
                        name: row.get(2)?,
                        singer: row.get(3)?,
                        source: row.get(4)?,
                        interval: row.get::<_, Option<String>>(5)?.unwrap_or_default(),
                    })
                })
                .map_err(|e| e.to_string())?;

            let mut songs = Vec::new();
            for s in song_rows {
                if let Ok(song) = s {
                    total_songs += 1;
                    songs.push(song);
                }
            }

            playlists.push(ImportedPlaylist {
                id: list_id,
                name: list_name,
                songs,
            });
        }
    }

    // 检查是否有 user_api.json
    let user_api_path = db_path.parent().unwrap().join("user_api.json");
    let mut user_api_count = 0;
    if user_api_path.exists() {
        if let Ok(content) = std::fs::read_to_string(&user_api_path) {
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
                if let Some(arr) = val.get("userApiList").and_then(|v| v.as_array()) {
                    user_api_count = arr.len();
                }
            }
        }
    }

    Ok(ImportResult {
        found: true,
        db_path: db_path.to_string_lossy().to_string(),
        playlists,
        total_songs,
        user_api_count,
    })
}

#[tauri::command]
fn toggle_desktop_lyric(app: AppHandle, visible: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("lyric") {
        if visible {
            window.show().map_err(|e| e.to_string())?;
        } else {
            window.hide().map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[tauri::command]
fn set_lyric_ignore_mouse(app: AppHandle, ignore: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("lyric") {
        window.set_ignore_cursor_events(ignore).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "app_name": "LX Music X",
        "version": "0.1.0",
        "tauri_version": "2.x",
        "arch": std::env::consts::ARCH,
        "os": std::env::consts::OS,
    })
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct LocalTrack {
    pub id: String,
    pub name: String,
    pub singer: String,
    pub album: String,
    pub path: String,
    pub ext: String,
    pub size: u64,
}

#[tauri::command]
fn scan_local_directory(dir_path: String) -> Result<Vec<LocalTrack>, String> {
    let path = std::path::Path::new(&dir_path);
    if !path.exists() || !path.is_dir() {
        return Err("所选目录不存在或不可读取".into());
    }

    let audio_exts = ["mp3", "flac", "wav", "m4a", "ogg", "aac", "opus", "wma"];
    let mut tracks = Vec::new();

    for entry in walkdir::WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_type().is_file() {
            let p = entry.path();
            if let Some(ext) = p.extension().and_then(|s| s.to_str()) {
                let ext_lower = ext.to_lowercase();
                if audio_exts.contains(&ext_lower.as_str()) {
                    let file_name = p.file_stem().and_then(|s| s.to_str()).unwrap_or("未知曲目").to_string();
                    let metadata = entry.metadata().ok();
                    let size = metadata.map(|m| m.len()).unwrap_or(0);

                    let (singer, name) = if file_name.contains(" - ") {
                        let parts: Vec<&str> = file_name.splitn(2, " - ").collect();
                        (parts[0].trim().to_string(), parts[1].trim().to_string())
                    } else {
                        ("本地音乐".to_string(), file_name.clone())
                    };

                    tracks.push(LocalTrack {
                        id: format!("local_{}", p.to_string_lossy()),
                        name,
                        singer,
                        album: "本地目录".to_string(),
                        path: p.to_string_lossy().to_string(),
                        ext: ext_lower,
                        size,
                    });
                }
            }
        }
    }

    Ok(tracks)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // 构建系统托盘菜单
            let toggle_play = MenuItem::with_id(app, "toggle_play", "播放 / 暂停", true, None::<&str>)?;
            let prev_track = MenuItem::with_id(app, "prev_track", "上一首", true, None::<&str>)?;
            let next_track = MenuItem::with_id(app, "next_track", "下一首", true, None::<&str>)?;
            let toggle_lyric = MenuItem::with_id(app, "toggle_lyric", "桌面悬浮歌词 开/关", true, None::<&str>)?;
            let show_app = MenuItem::with_id(app, "show_app", "显示主界面", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出 LX Music X", true, None::<&str>)?;

            let tray_menu = Menu::with_items(
                app,
                &[
                    &toggle_play,
                    &prev_track,
                    &next_track,
                    &toggle_lyric,
                    &show_app,
                    &quit,
                ],
            )?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "toggle_play" => {
                            let _ = app.emit("tray-toggle-play", ());
                        }
                        "prev_track" => {
                            let _ = app.emit("tray-prev-track", ());
                        }
                        "next_track" => {
                            let _ = app.emit("tray-next-track", ());
                        }
                        "toggle_lyric" => {
                            if let Some(window) = app.get_webview_window("lyric") {
                                if window.is_visible().unwrap_or(false) {
                                    let _ = window.hide();
                                } else {
                                    let _ = window.show();
                                }
                            }
                        }
                        "show_app" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_desktop_lyric,
            set_lyric_ignore_mouse,
            get_system_info,
            scan_and_import_legacy_data,
            scan_local_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
