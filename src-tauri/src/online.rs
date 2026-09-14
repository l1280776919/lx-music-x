use rquickjs::{Context, Function, Runtime};
use serde_json::{json, Value};
use std::{
    io::Read,
    time::{Duration, Instant},
};

pub fn client() -> Result<reqwest::blocking::Client, String> {
    reqwest::blocking::Client::builder().timeout(Duration::from_secs(12))
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36")
        .build().map_err(|e| e.to_string())
}

pub fn request(url: &str, options: Value) -> Result<Value, String> {
    let url = reqwest::Url::parse(url).map_err(|e| e.to_string())?;
    if !["https", "http"].contains(&url.scheme()) {
        return Err("只允许 HTTP/HTTPS 音源请求".into());
    }
    let client = client()?;
    let method = options["method"]
        .as_str()
        .unwrap_or("GET")
        .to_uppercase()
        .parse::<reqwest::Method>()
        .map_err(|e| e.to_string())?;
    let mut req = client.request(method, url);
    if let Some(headers) = options["headers"].as_object() {
        for (k, v) in headers {
            if let Some(v) = v.as_str() {
                req = req.header(k, v);
            }
        }
    }
    if let Some(form) = options.get("form") {
        req = req.form(form);
    } else if let Some(body) = options.get("json") {
        req = req.json(body);
    } else if let Some(body) = options.get("body") {
        req = if let Some(text) = body.as_str() {
            req.body(text.to_owned())
        } else {
            req.json(body)
        };
    }
    let resp = req.send().map_err(|e| e.to_string())?;
    let status = resp.status();
    let headers: serde_json::Map<String, Value> = resp
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), json!(v.to_str().unwrap_or(""))))
        .collect();
    let mut bytes = Vec::new();
    resp.take(8 * 1024 * 1024 + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() > 8 * 1024 * 1024 {
        return Err("音源响应超过 8 MiB 限制".into());
    }
    if !status.is_success() {
        return Err(format!("音源服务器返回 HTTP {status}"));
    }
    let raw = String::from_utf8_lossy(&bytes).to_string();
    let body = serde_json::from_str::<Value>(&raw).unwrap_or(json!(raw));
    Ok(json!({ "statusCode": status.as_u16(), "body": body, "raw": raw, "headers": headers }))
}

// Platform adapters and user-supplied JS execute only here. No DOM, Tauri IPC,
// filesystem, process or module loader is exposed to the isolated runtime.
pub fn call(action: &str, data: Value, script: &str) -> Result<Value, String> {
    let runtime = Runtime::new().map_err(|e| e.to_string())?;
    runtime.set_memory_limit(64 * 1024 * 1024);
    runtime.set_max_stack_size(1024 * 1024);
    let deadline = Instant::now() + Duration::from_secs(30);
    runtime.set_interrupt_handler(Some(Box::new(move || Instant::now() > deadline)));
    let context = Context::full(&runtime).map_err(|e| e.to_string())?;
    context.with(|ctx| -> Result<(), String> {
        ctx.globals().set("__http", Function::new(ctx.clone(), |url: String, opts: String| -> String {
            match serde_json::from_str(&opts).map_err(|e| e.to_string()).and_then(|o| request(&url, o)) {
                Ok(v) => v.to_string(), Err(e) => json!({"error": e}).to_string(),
            }
        }).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        ctx.globals().set("__inflate", Function::new(ctx.clone(), |data: String| -> String {
            let result = (|| -> Result<Vec<u8>,String> {
                let input: Vec<u8> = serde_json::from_str(&data).map_err(|e|e.to_string())?;
                let mut out = Vec::new();
                flate2::read::ZlibDecoder::new(input.as_slice()).take(8*1024*1024+1).read_to_end(&mut out).map_err(|e|e.to_string())?;
                if out.len()>8*1024*1024 {return Err("解压数据过大".into())} Ok(out)
            })();
            match result {Ok(bytes)=>json!({"bytes":bytes}).to_string(),Err(e)=>json!({"error":e}).to_string()}
        }).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        ctx.globals().set("__rsa", Function::new(ctx.clone(), |data:String,key:String| -> String {
            let result=(|| -> Result<Vec<u8>,String> {
                use rsa::{pkcs8::DecodePublicKey, pkcs1::DecodeRsaPublicKey, traits::PublicKeyParts};
                let bytes:Vec<u8>=serde_json::from_str(&data).map_err(|e|e.to_string())?;
                let key=rsa::RsaPublicKey::from_public_key_pem(&key).or_else(|_|rsa::RsaPublicKey::from_pkcs1_pem(&key)).map_err(|e|e.to_string())?;
                if key.size()>1024 || bytes.len()>key.size() {return Err("RSA 输入长度不支持".into())}
                let value=rsa::BigUint::from_bytes_be(&bytes);
                if &value>=key.n() {return Err("RSA 输入超出模数".into())}
                let out=value.modpow(key.e(),key.n()).to_bytes_be();
                let mut padded=vec![0;key.size()-out.len()];padded.extend(out);Ok(padded)
            })();
            match result {Ok(bytes)=>json!({"bytes":bytes}).to_string(),Err(e)=>json!({"error":e}).to_string()}
        }).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        ctx.globals().set("__random", Function::new(ctx.clone(), |size: usize| -> String {
            use rand::RngCore;
            let mut bytes = vec![0_u8; size.min(65536)]; rand::thread_rng().fill_bytes(&mut bytes); json!(bytes).to_string()
        }).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        ctx.eval::<(), _>(r#"
            globalThis.window = globalThis; globalThis.global = globalThis; globalThis.self = globalThis;
            globalThis.navigator = {userAgent: 'LX Music X Native'};
            globalThis.console = {log(){}, warn(){}, error(){}, info(){}, debug(){}};
            globalThis.crypto = {getRandomValues(a) { a.set(JSON.parse(__random(a.length))); return a; }};
            let timers = new Map(), timerId = 0;
            globalThis.setTimeout = (f, ms = 0, ...a) => { const id = ++timerId; timers.set(id, [Date.now()+ms, () => f(...a)]); return id; };
            globalThis.clearTimeout = id => timers.delete(id);
            globalThis.__tick = () => { for (const [id, [due, f]] of timers) if (due <= Date.now()) { timers.delete(id); f(); } };
        "#).map_err(|e| format!("运行时初始化失败: {e}"))?;
        ctx.eval::<(), _>(include_str!("../generated/music.js")).map_err(|e| format!("平台适配器加载失败: {e}; {:?}", ctx.catch()))?;
        let invocation = format!("globalThis.__result = null; backendCall({}, {}, {}).then(value => globalThis.__result = JSON.stringify({{value}}), error => globalThis.__result = JSON.stringify({{error: String(error)}}));", json!(action), data, json!(script));
        ctx.eval::<(), _>(invocation).map_err(|e| format!("音源调用失败: {e}"))?;
        Ok(())
    })?;
    loop {
        if Instant::now() > deadline {
            return Err("音源执行超时".into());
        }
        if runtime.is_job_pending() {
            runtime
                .execute_pending_job()
                .map_err(|_| "音源异步任务执行失败".to_string())?;
        }
        let output = context.with(|ctx| -> Result<Option<String>, String> {
            ctx.eval::<(), _>("__tick()").map_err(|e| e.to_string())?;
            ctx.globals().get("__result").map_err(|e| e.to_string())
        })?;
        if let Some(output) = output {
            let result: Value = serde_json::from_str(&output).map_err(|e| e.to_string())?;
            if let Some(error) = result["error"].as_str() {
                return Err(error.into());
            }
            return Ok(result["value"].clone());
        }
        if !runtime.is_job_pending() {
            std::thread::sleep(Duration::from_millis(2));
        }
    }
}

pub fn script_meta(code: &str, url: Option<&str>) -> Value {
    let field = |name: &str, default: &str| -> String {
        let key = format!("@{name} ");
        code.lines()
            .find_map(|line| {
                line.split_once(&key)
                    .map(|(_, s)| s.trim().trim_end_matches("*/").trim().to_owned())
            })
            .unwrap_or(default.into())
    };
    json!({"id": format!("user-api-{:016x}", rand::random::<u64>()), "name": field("name", "自定义音源"), "author": field("author", "未知"), "version": field("version", "1.0.0"), "description": field("description", ""), "homepage": field("homepage", ""), "rawCode": code, "sourceUrl": url, "enabled": true})
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn adapters_load_without_webview() {
        let boards = call("boards", json!({"source":"wy"}), "").unwrap();
        assert!(boards.as_array().unwrap().len() > 5);
    }
    #[test]
    fn custom_search_preserves_list() {
        let script = "lx.on(lx.EVENT_NAMES.request, () => ({list:[{id:'1',name:'test'}],total:1})); lx.send(lx.EVENT_NAMES.inited,{status:true});";
        let res = call(
            "search",
            json!({"source":"custom","keyword":"test","page":1,"limit":30}),
            script,
        )
        .unwrap();
        assert_eq!(res["list"][0]["name"], "test");
    }
    #[test]
    fn failed_script_does_not_validate() {
        assert!(call("validate", json!({}), "throw new Error('broken')").is_err());
    }
    #[test]
    fn script_has_no_host_privileges() {
        assert!(call("validate", json!({}), "if(typeof __TAURI_INTERNALS__ !== 'undefined' || typeof document !== 'undefined' || typeof require !== 'undefined') throw new Error('host exposed'); lx.on('request',()=>null);").is_ok());
    }
    #[test]
    fn user_api_http_callback_runs_in_rust() {
        use std::io::Write;
        let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
        let address = listener.local_addr().unwrap();
        let server = std::thread::spawn(move || {
            let (mut socket, _) = listener.accept().unwrap();
            socket
                .set_read_timeout(Some(Duration::from_secs(5)))
                .unwrap();
            let mut input = [0; 4096];
            let n = socket.read(&mut input).unwrap();
            assert!(String::from_utf8_lossy(&input[..n]).starts_with("GET /test "));
            let body = r#"{"list":[{"id":"fixture","name":"Native HTTP"}],"total":1}"#;
            write!(
                socket,
                "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                body.len(),
                body
            )
            .unwrap();
        });
        let script=format!("lx.on('request',()=>new Promise((resolve,reject)=>lx.request('http://{address}/test',{{method:'get'}},(err,resp,body)=>err?reject(err):resolve(body))));");
        let result = call(
            "search",
            json!({"source":"custom","keyword":"fixture"}),
            &script,
        )
        .unwrap();
        server.join().unwrap();
        assert_eq!(result["list"][0]["id"], "fixture");
    }
    #[test]
    #[ignore = "requires public music provider network access"]
    fn live_search_smoke() {
        let mut failures = vec![];
        for source in ["wy", "kg", "tx", "kw", "mg"] {
            let result = call(
                "search",
                json!({"source":source,"keyword":"晴天","page":1,"limit":3}),
                "",
            );
            match result {
                Ok(data) if data["list"].as_array().is_some_and(|v| !v.is_empty()) => println!(
                    "{source}: {} songs",
                    data["list"].as_array().map(Vec::len).unwrap_or(0)
                ),
                Ok(_) => failures.push(format!("{source}: empty results")),
                Err(e) => failures.push(format!("{source}: {e}")),
            }
        }
        assert!(failures.is_empty(), "{}", failures.join("; "));
    }

    #[test]
    fn signed_json_keeps_javascript_key_order() {
        use std::io::Write;
        let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
        let address = listener.local_addr().unwrap();
        let server = std::thread::spawn(move || {
            let (mut socket, _) = listener.accept().unwrap();
            socket
                .set_read_timeout(Some(Duration::from_secs(5)))
                .unwrap();
            let mut bytes = vec![];
            loop {
                let mut buf = [0; 1024];
                let n = socket.read(&mut buf).unwrap();
                if n == 0 {
                    break;
                }
                bytes.extend_from_slice(&buf[..n]);
                if bytes.windows(4).any(|b| b == b"\r\n\r\n")
                    && bytes.ends_with(br#"{"z":1,"a":2}"#)
                {
                    break;
                }
            }
            assert!(bytes.ends_with(br#"{"z":1,"a":2}"#));
            let body = r#"{"list":[{"id":"ok","name":"ordered"}],"total":1}"#;
            write!(
                socket,
                "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                body.len(),
                body
            )
            .unwrap();
        });
        let script=format!("lx.on('request',()=>new Promise((resolve,reject)=>lx.request('http://{address}/test',{{method:'post',body:{{z:1,a:2}}}},(err,resp,body)=>err?reject(err):resolve(body))));");
        let result = call(
            "search",
            json!({"source":"custom","keyword":"ordered"}),
            &script,
        )
        .unwrap();
        server.join().unwrap();
        assert_eq!(result["list"][0]["name"], "ordered");
    }
}
