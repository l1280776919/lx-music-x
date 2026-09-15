use regex::Regex;

#[derive(Clone, Debug, Default)]
pub struct Lyrics(pub Vec<(f64, String, String)>);

impl Lyrics {
    pub fn parse(text: &str, trans_text: &str) -> Self {
        let tag = Regex::new(r"\[(\d+):(\d{1,2})(?:[.:](\d{1,3}))?\]").unwrap();
        let offset_re = Regex::new(r"(?i)\[offset:([+-]?\d+)\]").unwrap();
        let offset = offset_re
            .captures(text)
            .and_then(|c| c[1].parse::<f64>().ok())
            .unwrap_or(0.)
            / 1000.;
        let mut raw_lines = vec![];
        for line in text.lines() {
            let content = tag.replace_all(line, "").trim().to_owned();
            for c in tag.captures_iter(line) {
                let seconds = c[2].parse::<f64>().unwrap_or(0.);
                if seconds >= 60. {
                    continue;
                }
                let fraction = c
                    .get(3)
                    .map(|v| {
                        v.as_str().parse::<f64>().unwrap_or(0.)
                            / 10_f64.powi(v.as_str().len() as i32)
                    })
                    .unwrap_or(0.);
                let time = c[1].parse::<f64>().unwrap_or(0.) * 60. + seconds + fraction - offset;
                raw_lines.push((time.max(0.), content.clone()));
            }
        }
        raw_lines.sort_by(|a, b| a.0.total_cmp(&b.0));

        // Parse translation lines if available
        let mut trans_lines = vec![];
        if !trans_text.is_empty() {
            let trans_offset = offset_re
                .captures(trans_text)
                .and_then(|c| c[1].parse::<f64>().ok())
                .unwrap_or(0.)
                / 1000.;
            for line in trans_text.lines() {
                let content = tag.replace_all(line, "").trim().to_owned();
                for c in tag.captures_iter(line) {
                    let seconds = c[2].parse::<f64>().unwrap_or(0.);
                    if seconds >= 60. {
                        continue;
                    }
                    let fraction = c
                        .get(3)
                        .map(|v| {
                            v.as_str().parse::<f64>().unwrap_or(0.)
                                / 10_f64.powi(v.as_str().len() as i32)
                        })
                        .unwrap_or(0.);
                    let time = c[1].parse::<f64>().unwrap_or(0.) * 60. + seconds + fraction - trans_offset;
                    trans_lines.push((time.max(0.), content.clone()));
                }
            }
            trans_lines.sort_by(|a, b| a.0.total_cmp(&b.0));
        }

        // Align translation to main lyric line
        let mut entries = Vec::with_capacity(raw_lines.len());
        for (time, content) in raw_lines {
            let mut matched_trans = String::new();
            if !trans_lines.is_empty() {
                let mut best_diff = 0.35;
                let mut best_idx = None;
                for (i, (t_tr, _)) in trans_lines.iter().enumerate() {
                    let diff = (t_tr - time).abs();
                    if diff < best_diff {
                        best_diff = diff;
                        best_idx = Some(i);
                    }
                }
                if let Some(i) = best_idx {
                    matched_trans = trans_lines[i].1.clone();
                }
            }
            entries.push((time, content, matched_trans));
        }

        Self(entries)
    }

    pub fn index(&self, time: f64) -> i64 {
        self.0.partition_point(|(t, _, _)| *t <= time) as i64 - 1
    }

    pub fn line(&self, index: i64) -> String {
        if index < 0 {
            return String::new();
        }
        self.0
            .get(index as usize)
            .map(|(_, s, _)| s.clone())
            .unwrap_or_default()
    }

    pub fn trans(&self, index: i64) -> String {
        if index < 0 {
            return String::new();
        }
        self.0
            .get(index as usize)
            .map(|(_, _, tr)| tr.clone())
            .unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn offsets_multiple_tags_and_last_line() {
        let l = Lyrics::parse("[offset:500]\n[00:02.00][00:04.000]hello\n[00:06.5]bye", "");
        assert_eq!(l.index(1.), -1);
        assert_eq!(l.index(3.5), 1);
        assert_eq!(l.line(l.index(7.) + 1), "");
    }
    #[test]
    fn parses_translations_and_matches() {
        let lrc = "[00:02.00]Hello world\n[00:05.00]Goodbye world";
        let tlrc = "[00:02.05]你好世界\n[00:05.00]再见世界";
        let parsed = Lyrics::parse(lrc, tlrc);
        assert_eq!(parsed.0.len(), 2);
        assert_eq!(parsed.line(0), "Hello world");
        assert_eq!(parsed.trans(0), "你好世界");
        assert_eq!(parsed.line(1), "Goodbye world");
        assert_eq!(parsed.trans(1), "再见世界");
    }
    #[test]
    fn resetting_empty_lyrics_clears_lines() {
        assert!(Lyrics::parse("[ar:artist]", "").0.is_empty());
    }
}
