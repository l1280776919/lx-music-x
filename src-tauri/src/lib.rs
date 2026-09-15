mod audio;
mod core;
mod legacy;
mod library;
mod lyrics;
mod online;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

#[tauri::command]
fn toggle_desktop_lyric(app: AppHandle, visible: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("lyric") {
        if visible {
            window.show().map_err(|e| e.to_string())?;
        } else {
            window.hide().map_err(|e| e.to_string())?;
        }
        let _ = app.emit("desktop-lyric-visibility-change", visible);
    }
    Ok(())
}

#[tauri::command]
fn set_lyric_ignore_mouse(app: AppHandle, ignore: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("lyric") {
        window
            .set_ignore_cursor_events(ignore)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "app_name": "LX Music X",
        "version": env!("CARGO_PKG_VERSION"),
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
    pub source: String,
    pub interval: String,
}

fn scan_local_files(dir_path: String) -> Result<Vec<LocalTrack>, String> {
    let path = std::path::Path::new(&dir_path);
    if !path.exists() || !path.is_dir() {
        return Err("所选目录不存在或不可读取".into());
    }

    let audio_exts = ["mp3", "flac", "wav", "m4a", "ogg", "aac", "opus", "wma"];
    let mut tracks = Vec::new();

    for entry in walkdir::WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            let p = entry.path();
            if let Some(ext) = p.extension().and_then(|s| s.to_str()) {
                let ext_lower = ext.to_lowercase();
                if audio_exts.contains(&ext_lower.as_str()) {
                    let file_name = p
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("未知曲目")
                        .to_string();
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
                        source: "local".into(),
                        interval: String::new(),
                    });
                }
            }
        }
    }

    tracks.sort_by(|a, b| a.path.cmp(&b.path));
    Ok(tracks)
}

#[tauri::command]
async fn scan_local_directory(dir_path: String) -> Result<Vec<LocalTrack>, String> {
    tauri::async_runtime::spawn_blocking(move || scan_local_files(dir_path))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn download_online_song(
    app: AppHandle,
    core: tauri::State<'_, core::Core>,
    song: library::Song,
) -> Result<String, String> {
    let snapshot = core.command("snapshot".into(), serde_json::Value::Null)?;
    let script = snapshot["library"]["script"]["rawCode"]
        .as_str()
        .unwrap_or("")
        .to_string();

    tauri::async_runtime::spawn_blocking(move || {
        let url = if !song.url.is_empty() {
            song.url.clone()
        } else {
            online::call("url", serde_json::json!(song), &script)?
                .as_str()
                .filter(|s| !s.is_empty())
                .ok_or("该歌曲没有可下载的音频播放地址")?
                .to_string()
        };

        let client = online::client()?;
        let mut resp = client.get(&url).send().map_err(|e| e.to_string())?;
        if !resp.status().is_success() {
            return Err(format!("下载失败，服务器返回 HTTP {}", resp.status()));
        }
        let mut bytes = Vec::new();
        std::io::Read::read_to_end(&mut resp, &mut bytes).map_err(|e| e.to_string())?;

        let download_dir = app
            .path()
            .download_dir()
            .or_else(|_| app.path().audio_dir())
            .map_err(|e| e.to_string())?
            .join("LX-Music");
        std::fs::create_dir_all(&download_dir).map_err(|e| e.to_string())?;

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

        let (lrc, tlrc) = if !song.lrc.is_empty() || !song.tlrc.is_empty() {
            (song.lrc.clone(), song.tlrc.clone())
        } else {
            online::call("lyric", serde_json::json!(song), &script)
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
            let _ = std::fs::write(lrc_path, lrc);
        }
        if !tlrc.is_empty() {
            let tlrc_path = download_dir.join(format!("{file_stem}.tlrc"));
            let _ = std::fs::write(tlrc_path, tlrc);
        }

        Ok(file_path.to_string_lossy().to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let text = shortcut.to_string();
                        if text.contains("MediaPlayPause") || text.contains("Play") {
                            core::remote(app, "toggle");
                        } else if text.contains("MediaTrackNext") || text.contains("TrackNext") {
                            core::remote(app, "next");
                        } else if text.contains("MediaTrackPrevious") || text.contains("TrackPrevious") {
                            core::remote(app, "prev");
                        } else if text.contains("MediaStop") {
                            core::remote(app, "stop");
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            let data_dir = app.path().app_data_dir()?.join("lx-music-x");
            std::fs::create_dir_all(&data_dir)?;
            app.manage(
                core::Core::start(app.handle().clone(), data_dir.join("library.sqlite3"))
                    .map_err(std::io::Error::other)?,
            );

            // 注册全局多媒体快捷按键（键盘播放/暂停、上一曲、下一曲）
            for key in ["MediaPlayPause", "MediaTrackNext", "MediaTrackPrevious", "MediaStop"] {
                let _ = app.global_shortcut().register(key);
            }
            // 构建系统托盘菜单
            let toggle_play =
                MenuItem::with_id(app, "toggle_play", "播放 / 暂停", true, None::<&str>)?;
            let prev_track = MenuItem::with_id(app, "prev_track", "上一首", true, None::<&str>)?;
            let next_track = MenuItem::with_id(app, "next_track", "下一首", true, None::<&str>)?;
            let toggle_lyric = MenuItem::with_id(
                app,
                "toggle_lyric",
                "桌面悬浮歌词 开/关",
                true,
                None::<&str>,
            )?;
            let toggle_lyric_ignore = MenuItem::with_id(
                app,
                "toggle_lyric_ignore",
                "锁定 / 解锁歌词鼠标穿透",
                true,
                None::<&str>,
            )?;
            let show_app = MenuItem::with_id(app, "show_app", "显示主界面", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出 LX Music X", true, None::<&str>)?;

            let tray_menu = Menu::with_items(
                app,
                &[
                    &toggle_play,
                    &prev_track,
                    &next_track,
                    &toggle_lyric,
                    &toggle_lyric_ignore,
                    &show_app,
                    &quit,
                ],
            )?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "toggle_play" => {
                        core::remote(app, "toggle");
                    }
                    "prev_track" => {
                        core::remote(app, "prev");
                    }
                    "next_track" => {
                        core::remote(app, "next");
                    }
                    "toggle_lyric" => {
                        if let Some(window) = app.get_webview_window("lyric") {
                            let is_vis = window.is_visible().unwrap_or(false);
                            if is_vis {
                                let _ = window.hide();
                                let _ = app.emit("desktop-lyric-visibility-change", false);
                            } else {
                                let _ = window.show();
                                let _ = app.emit("desktop-lyric-visibility-change", true);
                            }
                        }
                    }
                    "toggle_lyric_ignore" => {
                        let _ = app.emit("tray-toggle-lyric-ignore", ());
                    }
                    "show_app" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
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
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            toggle_desktop_lyric,
            set_lyric_ignore_mouse,
            get_system_info,
            legacy::scan_and_import_legacy_data,
            scan_local_directory,
            download_online_song,
            core::core_command,
            core::online_command,
            core::user_api_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
