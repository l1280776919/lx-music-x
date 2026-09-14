use regex::Regex;

#[derive(Clone, Debug, Default)]
pub struct Lyrics(pub Vec<(f64, String)>);
impl Lyrics {
    pub fn parse(text: &str) -> Self {
        let tag = Regex::new(r"\[(\d+):(\d{1,2})(?:[.:](\d{1,3}))?\]").unwrap();
        let offset_re = Regex::new(r"(?i)\[offset:([+-]?\d+)\]").unwrap();
        let offset = offset_re
            .captures(text)
            .and_then(|c| c[1].parse::<f64>().ok())
            .unwrap_or(0.)
            / 1000.;
        let mut lines = vec![];
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
                lines.push((time.max(0.), content.clone()));
            }
        }
        lines.sort_by(|a, b| a.0.total_cmp(&b.0));
        Self(lines)
    }
    pub fn index(&self, time: f64) -> i64 {
        self.0.partition_point(|(t, _)| *t <= time) as i64 - 1
    }
    pub fn line(&self, index: i64) -> String {
        if index < 0 {
            return String::new();
        }
        self.0
            .get(index as usize)
            .map(|(_, s)| s.clone())
            .unwrap_or_default()
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn offsets_multiple_tags_and_last_line() {
        let l = Lyrics::parse("[offset:500]\n[00:02.00][00:04.000]hello\n[00:06.5]bye");
        assert_eq!(l.index(1.), -1);
        assert_eq!(l.index(3.5), 1);
        assert_eq!(l.line(l.index(7.) + 1), "");
    }
    #[test]
    fn resetting_empty_lyrics_clears_lines() {
        assert!(Lyrics::parse("[ar:artist]").0.is_empty());
    }
}
