use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::path::Path;

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Song {
    #[serde(deserialize_with = "string_or_default")]
    pub id: String,
    #[serde(deserialize_with = "string_or_default")]
    pub name: String,
    #[serde(deserialize_with = "string_or_default")]
    pub singer: String,
    #[serde(deserialize_with = "string_or_default")]
    pub source: String,
    #[serde(deserialize_with = "string_or_default")]
    pub album: String,
    #[serde(deserialize_with = "string_or_default")]
    pub interval: String,
    #[serde(deserialize_with = "string_or_default")]
    pub pic: String,
    #[serde(deserialize_with = "string_or_default")]
    pub url: String,
    #[serde(deserialize_with = "string_or_default")]
    pub path: String,
    #[serde(deserialize_with = "string_or_default")]
    pub lrc: String,
    #[serde(deserialize_with = "string_or_default")]
    pub tlrc: String,
    pub raw: Value,
}

fn string_or_default<'de, D: serde::Deserializer<'de>>(d: D) -> Result<String, D::Error> {
    let value = Value::deserialize(d)?;
    match value {
        Value::Null => Ok(String::new()),
        Value::String(s) => Ok(s),
        Value::Number(n) => Ok(n.to_string()),
        _ => Err(serde::de::Error::custom("expected string, number or null")),
    }
}
impl Song {
    pub fn same(&self, other: &Self) -> bool {
        self.id == other.id && self.source == other.source
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Playlist {
    pub id: String,
    pub name: String,
    pub songs: Vec<Song>,
    #[serde(default)]
    pub is_custom: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Library {
    pub playlists: Vec<Playlist>,
    pub queue: Vec<Song>,
    pub current_index: usize,
    pub volume: f32,
    pub muted: bool,
    pub mode: String,
    pub eq: [f32; 10],
    pub script: Value,
    pub migrated: bool,
}

impl Default for Library {
    fn default() -> Self {
        Self {
            playlists: [
                ("fav", "我喜欢的音乐"),
                ("history", "最近播放"),
                ("local", "本地音乐"),
                ("default", "默认试听列表"),
            ]
            .into_iter()
            .map(|(id, name)| Playlist {
                id: id.into(),
                name: name.into(),
                songs: vec![],
                is_custom: id == "default",
            })
            .collect(),
            queue: vec![],
            current_index: 0,
            volume: 0.8,
            muted: false,
            mode: "list".into(),
            eq: [0.; 10],
            script: Value::Null,
            migrated: false,
        }
    }
}

impl Library {
    pub fn current(&self) -> Option<&Song> {
        self.queue.get(self.current_index)
    }

    pub fn record_history(&mut self, song: Song) {
        if let Some(list) = self.playlists.iter_mut().find(|p| p.id == "history") {
            list.songs.retain(|s| !s.same(&song));
            list.songs.insert(0, song);
            if list.songs.len() > 150 {
                list.songs.truncate(150);
            }
        }
    }

    pub fn normalize(&mut self) {
        self.current_index = self.current_index.min(self.queue.len().saturating_sub(1));
        self.volume = if self.volume.is_finite() {
            self.volume.clamp(0., 1.)
        } else {
            0.8
        };
        if !["list", "single", "random"].contains(&self.mode.as_str()) {
            self.mode = "list".into();
        }
        for value in &mut self.eq {
            *value = if value.is_finite() {
                value.clamp(-12., 12.)
            } else {
                0.
            };
        }
        for builtin in Library::default().playlists {
            if !self.playlists.iter().any(|p| p.id == builtin.id) {
                self.playlists.push(builtin);
            }
        }
    }

    pub fn advance(&mut self, previous: bool, ended: bool) {
        let len = self.queue.len();
        if len == 0 {
            return;
        }
        if ended && self.mode == "single" {
            return;
        }
        self.current_index = if self.mode == "random" && len > 1 {
            use rand::Rng;
            (self.current_index + rand::thread_rng().gen_range(1..len)) % len
        } else if previous {
            (self.current_index + len - 1) % len
        } else {
            (self.current_index + 1) % len
        };
    }

    pub fn remove_queue(&mut self, index: usize) -> Result<bool, String> {
        if index >= self.queue.len() {
            return Err("队列索引无效".into());
        }
        let changed = index == self.current_index;
        self.queue.remove(index);
        if index < self.current_index {
            self.current_index -= 1;
        }
        self.normalize();
        Ok(changed)
    }

    pub fn edit(&mut self, action: &str, data: Value) -> Result<Value, String> {
        let list_id = data["listId"].as_str().unwrap_or("");
        match action {
            "create" => {
                let name = data["name"].as_str().unwrap_or("").trim();
                if name.is_empty() {
                    return Err("歌单名称不能为空".into());
                }
                let p = Playlist {
                    id: format!("list_{:032x}", rand::random::<u128>()),
                    name: name.into(),
                    songs: vec![],
                    is_custom: true,
                };
                let result = json!(p);
                self.playlists.push(p);
                Ok(result)
            }
            "create_with_songs" => {
                let name = data["name"].as_str().unwrap_or("").trim();
                if name.is_empty() {
                    return Err("歌单名称不能为空".into());
                }
                let songs: Vec<Song> = serde_json::from_value(data["songs"].clone())
                    .map_err(|e| e.to_string())?;
                let p = Playlist {
                    id: format!("list_{:032x}", rand::random::<u128>()),
                    name: name.into(),
                    songs,
                    is_custom: true,
                };
                let result = json!(p);
                self.playlists.push(p);
                Ok(result)
            }
            "batch_favorite" => {
                let songs: Vec<Song> = serde_json::from_value(data["songs"].clone())
                    .map_err(|e| e.to_string())?;
                let fav = self
                    .playlists
                    .iter_mut()
                    .find(|p| p.id == "fav")
                    .ok_or("收藏歌单不存在")?;
                for song in songs {
                    if !song.id.is_empty() && !fav.songs.iter().any(|s| s.same(&song)) {
                        fav.songs.insert(0, song);
                    }
                }
                Ok(json!(true))
            }
            "delete" => {
                if ["fav", "local", "history"].contains(&list_id) {
                    return Err("不能删除内置歌单".into());
                }
                self.playlists.retain(|p| p.id != list_id);
                Ok(json!(true))
            }
            "import" => {
                let lists: Vec<Playlist> =
                    serde_json::from_value(data["playlists"].clone()).map_err(|e| e.to_string())?;
                for mut incoming in lists {
                    // IDs, rather than names, make repeated imports idempotent.
                    incoming.id = format!("legacy_{}", incoming.id.trim_start_matches("legacy_"));
                    incoming.is_custom = true;
                    if let Some(existing) = self.playlists.iter_mut().find(|p| p.id == incoming.id)
                    {
                        for song in incoming.songs {
                            if !existing.songs.iter().any(|s| s.same(&song)) {
                                existing.songs.push(song);
                            }
                        }
                    } else {
                        self.playlists.push(incoming);
                    }
                }
                Ok(json!(true))
            }
            "migrate" => {
                if self.migrated {
                    return Ok(json!(false));
                }
                if let Some(lists) = data.get("playlists").filter(|v| !v.is_null()) {
                    self.playlists = serde_json::from_value(lists.clone())
                        .map_err(|e| format!("旧歌单数据无效: {e}"))?;
                }
                if let Some(queue) = data.get("queue").filter(|v| !v.is_null()) {
                    self.queue = serde_json::from_value(queue.clone())
                        .map_err(|e| format!("旧队列数据无效: {e}"))?;
                }
                self.normalize();
                if let Some(songs) = data.get("localSongs").filter(|v| !v.is_null()) {
                    self.playlists
                        .iter_mut()
                        .find(|p| p.id == "local")
                        .unwrap()
                        .songs =
                        serde_json::from_value(songs.clone()).map_err(|e| e.to_string())?;
                }
                self.migrated = true;
                Ok(json!(true))
            }
            _ => {
                let target = if action == "favorite" { "fav" } else { list_id };
                let list = self
                    .playlists
                    .iter_mut()
                    .find(|p| p.id == target)
                    .ok_or("歌单不存在")?;
                match action {
                    "rename" => {
                        let name = data["name"].as_str().unwrap_or("").trim();
                        if name.is_empty() {
                            return Err("歌单名称不能为空".into());
                        }
                        list.name = name.into();
                    }
                    "favorite" | "add" => {
                        let song: Song = serde_json::from_value(data["song"].clone())
                            .map_err(|e| e.to_string())?;
                        if song.id.is_empty() {
                            return Err("歌曲标识不能为空".into());
                        }
                        if let Some(index) = list.songs.iter().position(|s| s.same(&song)) {
                            if action == "favorite" {
                                list.songs.remove(index);
                            }
                        } else {
                            list.songs.insert(0, song);
                        }
                    }
                    "remove" => {
                        list.songs
                            .retain(|s| s.id != data["songId"].as_str().unwrap_or(""));
                    }
                    "batch_add" => {
                        let songs: Vec<Song> = serde_json::from_value(data["songs"].clone())
                            .map_err(|e| e.to_string())?;
                        for song in songs {
                            if !song.id.is_empty() && !list.songs.iter().any(|s| s.same(&song)) {
                                list.songs.push(song);
                            }
                        }
                    }
                    "batch_remove" => {
                        let ids: std::collections::HashSet<String> =
                            serde_json::from_value(data["songIds"].clone())
                                .map_err(|e| e.to_string())?;
                        list.songs.retain(|s| !ids.contains(&s.id));
                    }
                    "reorder" => {
                        let from = data["from"].as_u64().ok_or("无效的起始索引")? as usize;
                        let to = data["to"].as_u64().ok_or("无效的目标索引")? as usize;
                        if from < list.songs.len() && to < list.songs.len() && from != to {
                            let song = list.songs.remove(from);
                            list.songs.insert(to, song);
                        }
                    }
                    "replace_songs" => {
                        list.songs = serde_json::from_value(data["songs"].clone())
                            .map_err(|e| e.to_string())?;
                    }
                    "local" => {
                        list.songs = serde_json::from_value(data["songs"].clone())
                            .map_err(|e| e.to_string())?;
                    }
                    "clear" => {
                        list.songs.clear();
                    }
                    _ => return Err(format!("未知歌单操作: {action}")),
                }
                Ok(json!(true))
            }
        }
    }
}

pub struct Database(Connection);
impl Database {
    pub fn open(path: &Path) -> Result<Self, String> {
        let conn = Connection::open(path).map_err(|e| e.to_string())?;
        conn.execute_batch(
            "PRAGMA journal_mode=WAL;
             CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
             CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);"
        ).map_err(|e| e.to_string())?;
        Ok(Self(conn))
    }
    pub fn load(&self) -> Result<Library, String> {
        use rusqlite::OptionalExtension;
        let text: Option<String> = self
            .0
            .query_row("SELECT data FROM app_state WHERE id=1", [], |r| r.get(0))
            .optional()
            .map_err(|e| e.to_string())?;
        let mut library: Library = match text {
            Some(s) => serde_json::from_str(&s)
                .map_err(|e| format!("数据库内容损坏（未覆盖原数据）: {e}"))?,
            None => Library::default(),
        };
        library.normalize();
        Ok(library)
    }
    pub fn save(&self, library: &Library) -> Result<(), String> {
        let data = serde_json::to_string(library).map_err(|e| e.to_string())?;
        self.0.execute("INSERT INTO app_state(id,data) VALUES(1,?1) ON CONFLICT(id) DO UPDATE SET data=excluded.data", [data]).map_err(|e| e.to_string())?;
        Ok(())
    }
    pub fn get_all_settings(&self) -> Result<serde_json::Map<String, Value>, String> {
        let mut stmt = self.0.prepare("SELECT key, value FROM settings").map_err(|e| e.to_string())?;
        let rows = stmt.query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        }).map_err(|e| e.to_string())?;
        let mut map = serde_json::Map::new();
        for r in rows {
            if let Ok((k, v_str)) = r {
                let val: Value = serde_json::from_str(&v_str).unwrap_or(Value::String(v_str));
                map.insert(k, val);
            }
        }
        Ok(map)
    }
    pub fn set_setting(&self, key: &str, value: &Value) -> Result<(), String> {
        let val_str = serde_json::to_string(value).map_err(|e| e.to_string())?;
        self.0.execute(
            "INSERT INTO settings(key, value) VALUES(?1, ?2) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            rusqlite::params![key, val_str],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn queued() -> Library {
        Library {
            queue: (0..3)
                .map(|i| Song {
                    id: i.to_string(),
                    ..Song::default()
                })
                .collect(),
            current_index: 1,
            ..Library::default()
        }
    }
    #[test]
    fn remove_before_current_preserves_song() {
        let mut l = queued();
        assert!(!l.remove_queue(0).unwrap());
        assert_eq!(l.current().unwrap().id, "1");
    }
    #[test]
    fn single_mode_only_repeats_on_end() {
        let mut l = queued();
        l.mode = "single".into();
        l.advance(false, true);
        assert_eq!(l.current_index, 1);
        l.advance(false, false);
        assert_eq!(l.current_index, 2);
    }
    #[test]
    fn random_does_not_repeat() {
        let mut l = queued();
        l.mode = "random".into();
        for _ in 0..100 {
            let old = l.current_index;
            l.advance(false, false);
            assert_ne!(old, l.current_index);
        }
    }
    #[test]
    fn database_roundtrip() {
        let db = Database::open(Path::new(":memory:")).unwrap();
        let l = queued();
        db.save(&l).unwrap();
        assert_eq!(db.load().unwrap().current_index, 1);
    }
    #[test]
    fn migrations_are_idempotent() {
        let mut l = Library::default();
        l.edit("migrate", json!({"queue": queued().queue})).unwrap();
        l.edit("migrate", json!({"queue": []})).unwrap();
        assert_eq!(l.queue.len(), 3);
    }
    #[test]
    fn same_name_imports_are_not_lost() {
        let mut l = Library::default();
        let lists = json!({"playlists": [{"id":"1","name":"test","songs":[]},{"id":"2","name":"test","songs":[]}]});
        l.edit("import", lists.clone()).unwrap();
        l.edit("import", lists).unwrap();
        assert_eq!(l.playlists.len(), 6);
    }
    #[test]
    fn history_recording_deduplicates_and_limits() {
        let mut l = Library::default();
        let song1 = Song {
            id: "s1".into(),
            source: "wy".into(),
            name: "Song 1".into(),
            singer: "Singer 1".into(),
            album: String::new(),
            interval: String::new(),
            path: String::new(),
            url: String::new(),
            pic: String::new(),
            lrc: String::new(),
            tlrc: String::new(),
            raw: json!(null),
        };
        let song2 = Song {
            id: "s2".into(),
            source: "wy".into(),
            name: "Song 2".into(),
            singer: "Singer 2".into(),
            album: String::new(),
            interval: String::new(),
            path: String::new(),
            url: String::new(),
            pic: String::new(),
            lrc: String::new(),
            tlrc: String::new(),
            raw: json!(null),
        };
        l.record_history(song1.clone());
        l.record_history(song2.clone());
        l.record_history(song1.clone());
        let hist = l.playlists.iter().find(|p| p.id == "history").unwrap();
        assert_eq!(hist.songs.len(), 2);
        assert_eq!(hist.songs[0].id, "s1");
        assert_eq!(hist.songs[1].id, "s2");
    }
    #[test]
    fn batch_favorite_and_create_with_songs() {
        let mut l = Library::default();
        let song = Song {
            id: "s1".into(),
            source: "tx".into(),
            name: "Song 1".into(),
            ..Song::default()
        };
        l.edit("batch_favorite", json!({ "songs": [song.clone(), song.clone()] })).unwrap();
        let fav = l.playlists.iter().find(|p| p.id == "fav").unwrap();
        assert_eq!(fav.songs.len(), 1);
        assert_eq!(fav.songs[0].id, "s1");

        let p_res = l.edit("create_with_songs", json!({ "name": "My List", "songs": [song] })).unwrap();
        assert_eq!(p_res["name"], "My List");
        assert_eq!(p_res["songs"].as_array().unwrap().len(), 1);
    }
    #[test]
    fn database_settings_crud() {
        let db = Database::open(Path::new(":memory:")).unwrap();
        db.set_setting("theme", &json!({"selectedPresetId": "cyberpunk"})).unwrap();
        let all = db.get_all_settings().unwrap();
        assert_eq!(all["theme"]["selectedPresetId"], "cyberpunk");
    }
}
