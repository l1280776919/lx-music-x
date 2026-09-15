use crate::library::{Playlist, Song};
use rusqlite::{Connection, OpenFlags};
use serde::Serialize;
use serde_json::{json, Value};
use std::path::PathBuf;

#[derive(Serialize)]
pub struct ImportResult {
    found: bool,
    db_path: String,
    playlists: Vec<Playlist>,
    total_songs: usize,
    user_api_count: usize,
}

fn read(conn: &Connection) -> Result<Vec<Playlist>, String> {
    let has_order:bool=conn.query_row("SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='my_list_music_info_order')",[],|r|r.get(0)).map_err(|e|e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id,name FROM my_list ORDER BY position ASC")
        .map_err(|e| e.to_string())?;
    let lists = stmt
        .query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))
        .map_err(|e| e.to_string())?;
    let mut out = vec![];
    for list in lists {
        let (id, name) = list.map_err(|e| e.to_string())?;
        let sql = if has_order {
            r#"SELECT m.id,m.name,m.singer,m.source,m.interval,m.meta FROM my_list_music_info m LEFT JOIN my_list_music_info_order o ON m.id=o.musicInfoId AND m.listId=o.listId WHERE m.listId=?1 ORDER BY o."order",m.rowid"#
        } else {
            "SELECT id,name,singer,source,interval,meta FROM my_list_music_info WHERE listId=?1 ORDER BY rowid"
        };
        let mut songs_stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let rows = songs_stmt
            .query_map([&id], |r| {
                Ok((
                    r.get::<_, String>(0)?,
                    r.get::<_, String>(1)?,
                    r.get::<_, String>(2)?,
                    r.get::<_, String>(3)?,
                    r.get::<_, Option<String>>(4)?,
                    r.get::<_, String>(5)?,
                ))
            })
            .map_err(|e| e.to_string())?;
        let mut songs = vec![];
        for row in rows {
            let (id, name, singer, source, interval, meta) = row.map_err(|e| e.to_string())?;
            let meta: Value =
                serde_json::from_str(&meta).map_err(|e| format!("歌曲 {id} 元数据损坏: {e}"))?;
            let raw = json!({"id":id,"songmid":meta["songId"],"hash":meta["hash"],"strMediaMid":meta["strMediaMid"],"albumId":meta["albumId"],"albumName":meta["albumName"],"name":name,"singer":singer,"source":source,"interval":interval,"types":meta["qualitys"],"_types":meta["_qualitys"],"meta":meta});
            songs.push(Song {
                id,
                name,
                singer,
                source,
                interval: interval.unwrap_or_default(),
                album: meta["albumName"].as_str().unwrap_or("").into(),
                pic: meta["picUrl"].as_str().unwrap_or("").into(),
                path: meta["filePath"].as_str().unwrap_or("").into(),
                raw,
                ..Song::default()
            });
        }
        out.push(Playlist {
            id,
            name,
            songs,
            is_custom: true,
        });
    }
    Ok(out)
}

fn detect() -> Result<ImportResult, String> {
    #[cfg(target_os = "windows")]
    let root = std::env::var_os("APPDATA").map(PathBuf::from);
    #[cfg(target_os = "macos")]
    let root =
        std::env::var_os("HOME").map(|p| PathBuf::from(p).join("Library/Application Support"));
    #[cfg(all(not(target_os = "windows"), not(target_os = "macos")))]
    let root = std::env::var_os("XDG_CONFIG_HOME")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("HOME").map(|p| PathBuf::from(p).join(".config")));
    let path = root
        .ok_or("无法确定旧版数据目录")?
        .join("lx-music-desktop/LxDatas/lx.data.db");
    if !path.is_file() {
        return Ok(ImportResult {
            found: false,
            db_path: path.to_string_lossy().into(),
            playlists: vec![],
            total_songs: 0,
            user_api_count: 0,
        });
    }
    let conn = Connection::open_with_flags(&path, OpenFlags::SQLITE_OPEN_READ_ONLY)
        .map_err(|e| e.to_string())?;
    let playlists = read(&conn)?;
    let total_songs = playlists.iter().map(|p| p.songs.len()).sum();
    let user_api_count = path
        .parent()
        .and_then(|p| std::fs::read_to_string(p.join("user_api.json")).ok())
        .and_then(|s| serde_json::from_str::<Value>(&s).ok())
        .and_then(|v| v["userApiList"].as_array().map(Vec::len))
        .unwrap_or(0);
    Ok(ImportResult {
        found: true,
        db_path: path.to_string_lossy().into(),
        playlists,
        total_songs,
        user_api_count,
    })
}
#[tauri::command]
pub async fn scan_and_import_legacy_data(
    core: tauri::State<'_, crate::core::Core>,
) -> Result<ImportResult, String> {
    let res = tauri::async_runtime::spawn_blocking(detect)
        .await
        .map_err(|e| e.to_string())??;

    if res.found && !res.playlists.is_empty() {
        let lists_val = serde_json::to_value(&res.playlists).map_err(|e| e.to_string())?;
        core.command(
            "library".into(),
            json!({
                "action": "import",
                "data": {
                    "playlists": lists_val
                }
            }),
        )?;
    }

    Ok(res)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn keeps_metadata_and_order() {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(r#"CREATE TABLE my_list(id TEXT,name TEXT,position INTEGER); CREATE TABLE my_list_music_info(id TEXT,listId TEXT,name TEXT,singer TEXT,source TEXT,interval TEXT,meta TEXT); CREATE TABLE my_list_music_info_order(listId TEXT,musicInfoId TEXT,"order" INTEGER); INSERT INTO my_list VALUES('a','list',0); INSERT INTO my_list_music_info VALUES('tx_1','a','one','singer','tx',NULL,'{"songId":"abc","strMediaMid":"xyz","picUrl":"cover"}'),('wy_2','a','two','singer','wy','03:00','{"songId":2}'); INSERT INTO my_list_music_info_order VALUES('a','wy_2',0),('a','tx_1',1);"#).unwrap();
        let lists = read(&conn).unwrap();
        assert_eq!(lists[0].songs[0].id, "wy_2");
        assert_eq!(lists[0].songs[1].raw["strMediaMid"], "xyz");
        assert_eq!(lists[0].songs[1].pic, "cover");
    }
}
