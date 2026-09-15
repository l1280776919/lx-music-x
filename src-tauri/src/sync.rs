use crate::library::{Library, Playlist};
use flate2::read::GzDecoder;
use flate2::write::GzEncoder;
use flate2::Compression;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::io::{Read, Write};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct WebdavConfig {
    pub endpoint: String,
    pub username: String,
    pub password: String,
    #[serde(default = "default_remote_path")]
    pub remote_path: String,
}

fn default_remote_path() -> String {
    "/lx-music/lx_sync_data.json.gz".into()
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SyncHeader {
    pub version: String,
    pub client: String,
    pub timestamp: u64,
    pub checksum: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SyncPayload {
    pub playlists: Vec<Playlist>,
    pub settings: serde_json::Map<String, Value>,
    pub script: Value,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SyncPackage {
    pub header: SyncHeader,
    pub payload: SyncPayload,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SyncResult {
    pub success: bool,
    pub strategy: String,
    pub timestamp: u64,
    pub playlist_count: usize,
    pub song_count: usize,
    pub message: String,
}

pub fn compress_gzip(data: &[u8]) -> Result<Vec<u8>, String> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(data).map_err(|e| e.to_string())?;
    encoder.finish().map_err(|e| e.to_string())
}

pub fn decompress_gzip_or_raw(data: &[u8]) -> Result<Vec<u8>, String> {
    if data.len() >= 2 && data[0] == 0x1f && data[1] == 0x8b {
        let mut decoder = GzDecoder::new(data);
        let mut out = Vec::new();
        decoder
            .read_to_end(&mut out)
            .map_err(|e| format!("Gzip解压失败: {e}"))?;
        Ok(out)
    } else {
        Ok(data.to_vec())
    }
}

pub fn compute_crc32(data: &[u8]) -> String {
    let mut crc = flate2::Crc::new();
    crc.update(data);
    format!("crc32:{:08x}", crc.sum())
}

pub fn current_timestamp_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

pub struct WebdavClient {
    client: reqwest::blocking::Client,
    config: WebdavConfig,
}

impl WebdavClient {
    pub fn new(config: WebdavConfig) -> Result<Self, String> {
        let client = reqwest::blocking::Client::builder()
            .timeout(Duration::from_secs(20))
            .user_agent("LX-Music-X/0.1.11 (WebDAV Sync)")
            .build()
            .map_err(|e| format!("初始化 WebDAV 客户端失败: {e}"))?;
        Ok(Self { client, config })
    }

    fn full_url(&self) -> Result<String, String> {
        let mut base = self.config.endpoint.trim().trim_end_matches('/').to_string();
        if !base.starts_with("http://") && !base.starts_with("https://") {
            base = format!("https://{base}");
        }
        let rel = self.config.remote_path.trim().trim_start_matches('/');
        Ok(format!("{base}/{rel}"))
    }

    pub fn test_connection(&self) -> Result<(), String> {
        let mut base = self.config.endpoint.trim().trim_end_matches('/').to_string();
        if !base.starts_with("http://") && !base.starts_with("https://") {
            base = format!("https://{base}");
        }

        let method = reqwest::Method::from_bytes(b"PROPFIND").unwrap();
        let res = self
            .client
            .request(method, &base)
            .header("Depth", "0")
            .basic_auth(&self.config.username, Some(&self.config.password))
            .send();

        match res {
            Ok(resp) => {
                let status = resp.status().as_u16();
                if (200..=299).contains(&status) || status == 207 {
                    Ok(())
                } else if status == 401 || status == 403 {
                    Err(format!("WebDAV 认证失败，请检查用户名或应用密码 (HTTP {status})"))
                } else {
                    // Fallback to GET on base url
                    let get_res = self
                        .client
                        .get(&base)
                        .basic_auth(&self.config.username, Some(&self.config.password))
                        .send();
                    match get_res {
                        Ok(r) if r.status().is_success() || r.status().as_u16() == 404 => Ok(()),
                        Ok(r) if r.status().as_u16() == 401 || r.status().as_u16() == 403 => {
                            Err(format!("WebDAV 认证失败 (HTTP {})", r.status()))
                        }
                        _ => Err(format!("WebDAV 探测响应异常 (HTTP {status})")),
                    }
                }
            }
            Err(e) => Err(format!("连接 WebDAV 服务器失败: {e}")),
        }
    }

    fn ensure_parent_directory(&self) -> Result<(), String> {
        let target_url = self.full_url()?;
        let parsed = reqwest::Url::parse(&target_url).map_err(|e| e.to_string())?;
        let path_segments: Vec<&str> = parsed
            .path_segments()
            .map(|c| c.collect())
            .unwrap_or_default();

        if path_segments.len() <= 1 {
            return Ok(());
        }

        // Parent segments
        let mut current_path = String::new();
        let origin = format!(
            "{}://{}",
            parsed.scheme(),
            parsed.host_str().unwrap_or_default()
        );
        let port_suffix = parsed.port().map(|p| format!(":{p}")).unwrap_or_default();
        let base_origin = format!("{origin}{port_suffix}");

        let mkcol_method = reqwest::Method::from_bytes(b"MKCOL").unwrap();

        for seg in &path_segments[..path_segments.len() - 1] {
            if seg.is_empty() {
                continue;
            }
            current_path.push('/');
            current_path.push_str(seg);

            let folder_url = format!("{base_origin}{current_path}/");
            let _ = self
                .client
                .request(mkcol_method.clone(), &folder_url)
                .basic_auth(&self.config.username, Some(&self.config.password))
                .send();
        }
        Ok(())
    }

    pub fn upload(&self, data: &[u8]) -> Result<(), String> {
        self.ensure_parent_directory()?;
        let target_url = self.full_url()?;

        let resp = self
            .client
            .put(&target_url)
            .header("Content-Type", "application/octet-stream")
            .basic_auth(&self.config.username, Some(&self.config.password))
            .body(data.to_vec())
            .send()
            .map_err(|e| format!("上传至 WebDAV 失败: {e}"))?;

        let status = resp.status().as_u16();
        if (200..=299).contains(&status) {
            Ok(())
        } else if status == 401 || status == 403 {
            Err(format!("WebDAV 上传未授权，请检查凭据 (HTTP {status})"))
        } else {
            Err(format!("WebDAV 上传返回错误 (HTTP {status})"))
        }
    }

    pub fn download(&self) -> Result<Vec<u8>, String> {
        let target_url = self.full_url()?;
        let resp = self
            .client
            .get(&target_url)
            .basic_auth(&self.config.username, Some(&self.config.password))
            .send()
            .map_err(|e| format!("请求 WebDAV 数据失败: {e}"))?;

        let status = resp.status().as_u16();
        if status == 404 {
            return Err("云盘中未找到同步文件，请先执行“上传并覆盖云端”建立初始备份。".into());
        }
        if status == 401 || status == 403 {
            return Err(format!("WebDAV 下载未授权，请检查凭据 (HTTP {status})"));
        }
        if !resp.status().is_success() {
            return Err(format!("WebDAV 下载返回错误 (HTTP {status})"));
        }

        resp.bytes()
            .map(|b| b.to_vec())
            .map_err(|e| format!("读取云盘数据失败: {e}"))
    }
}

pub fn create_sync_package(
    library: &Library,
    settings: serde_json::Map<String, Value>,
) -> Result<(SyncPackage, Vec<u8>), String> {
    let mut sync_settings = serde_json::Map::new();
    let syncable_prefixes = ["theme_", "desktop_lyric_", "play_", "audio_"];
    for (k, v) in settings {
        if syncable_prefixes.iter().any(|prefix| k.starts_with(prefix)) || k == "volume" {
            sync_settings.insert(k, v);
        }
    }

    let payload = SyncPayload {
        playlists: library.playlists.clone(),
        settings: sync_settings,
        script: library.script.clone(),
    };

    let payload_bytes = serde_json::to_vec(&payload).map_err(|e| e.to_string())?;
    let checksum = compute_crc32(&payload_bytes);

    let package = SyncPackage {
        header: SyncHeader {
            version: "1.0.0".into(),
            client: "LX Music X Desktop".into(),
            timestamp: current_timestamp_ms(),
            checksum,
        },
        payload,
    };

    let package_json = serde_json::to_vec(&package).map_err(|e| e.to_string())?;
    let compressed = compress_gzip(&package_json)?;
    Ok((package, compressed))
}

pub fn unpack_sync_package(compressed_or_raw: &[u8]) -> Result<SyncPackage, String> {
    let raw = decompress_gzip_or_raw(compressed_or_raw)?;
    let package: SyncPackage =
        serde_json::from_slice(&raw).map_err(|e| format!("解析云盘同步数据包失败: {e}"))?;
    Ok(package)
}

pub fn merge_playlists(local: &mut Vec<Playlist>, remote: Vec<Playlist>) -> (usize, usize) {
    let mut added_playlists = 0;
    let mut added_songs = 0;

    for r_pl in remote {
        if let Some(l_pl) = local.iter_mut().find(|p| p.id == r_pl.id || (!p.is_custom && p.name == r_pl.name)) {
            for song in r_pl.songs {
                if !l_pl.songs.iter().any(|s| s.same(&song)) {
                    l_pl.songs.push(song);
                    added_songs += 1;
                }
            }
        } else {
            added_playlists += 1;
            added_songs += r_pl.songs.len();
            local.push(r_pl);
        }
    }
    (added_playlists, added_songs)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::library::Song;

    #[test]
    fn test_gzip_compression_roundtrip() {
        let text = b"{\"hello\": \"world\", \"lx\": [1,2,3]}";
        let compressed = compress_gzip(text).unwrap();
        assert_ne!(compressed, text);
        let decompressed = decompress_gzip_or_raw(&compressed).unwrap();
        assert_eq!(decompressed, text);
    }

    #[test]
    fn test_decompress_plain_json_fallback() {
        let text = b"{\"hello\": \"plain\"}";
        let decompressed = decompress_gzip_or_raw(text).unwrap();
        assert_eq!(decompressed, text);
    }

    #[test]
    fn test_merge_playlists() {
        let mut local = vec![
            Playlist {
                id: "default".into(),
                name: "试听列表".into(),
                songs: vec![Song {
                    id: "1".into(),
                    name: "Song A".into(),
                    source: "kw".into(),
                    ..Song::default()
                }],
                is_custom: false,
            },
        ];

        let remote = vec![
            Playlist {
                id: "default".into(),
                name: "试听列表".into(),
                songs: vec![
                    Song {
                        id: "1".into(),
                        name: "Song A".into(),
                        source: "kw".into(),
                        ..Song::default()
                    },
                    Song {
                        id: "2".into(),
                        name: "Song B".into(),
                        source: "tx".into(),
                        ..Song::default()
                    },
                ],
                is_custom: false,
            },
            Playlist {
                id: "custom_1".into(),
                name: "我的精选".into(),
                songs: vec![Song {
                    id: "3".into(),
                    name: "Song C".into(),
                    source: "kg".into(),
                    ..Song::default()
                }],
                is_custom: true,
            },
        ];

        let (added_pl, added_songs) = merge_playlists(&mut local, remote);
        assert_eq!(added_pl, 1);
        assert_eq!(added_songs, 2); // 1 in default, 1 in custom_1
        assert_eq!(local.len(), 2);
        assert_eq!(local[0].songs.len(), 2);
        assert_eq!(local[1].songs.len(), 1);
    }
}
