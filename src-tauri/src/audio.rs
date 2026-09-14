use rodio::Source;
use std::{
    sync::{Arc, Mutex},
    time::Duration,
};
pub const FREQUENCIES: [f32; 10] = [
    31., 62., 125., 250., 500., 1000., 2000., 4000., 8000., 16000.,
];

// RBJ peaking biquads, with independent delay lines for each channel.
pub struct Equalizer<S> {
    source: S,
    gains: Arc<Mutex<[f32; 10]>>,
    previous: [f32; 10],
    coefficients: [[f32; 5]; 10],
    history: Vec<[[f32; 2]; 10]>,
    channel: usize,
    count: usize,
}
impl<S: Source<Item = f32>> Equalizer<S> {
    pub fn new(source: S, gains: Arc<Mutex<[f32; 10]>>) -> Self {
        let channels = source.channels() as usize;
        Self {
            source,
            gains,
            previous: [f32::NAN; 10],
            coefficients: [[0.; 5]; 10],
            history: vec![[[0.; 2]; 10]; channels],
            channel: 0,
            count: 0,
        }
    }
    fn update(&mut self) {
        let gains = *self.gains.lock().unwrap_or_else(|e| e.into_inner());
        if gains == self.previous {
            return;
        }
        self.previous = gains;
        for i in 0..10 {
            let a = 10_f32.powf(gains[i] / 40.);
            let w = 2.
                * std::f32::consts::PI
                * FREQUENCIES[i].min(self.source.sample_rate() as f32 * 0.45)
                / self.source.sample_rate() as f32;
            let alpha = w.sin() / (2. * 1.4);
            let a0 = 1. + alpha / a;
            self.coefficients[i] = [
                (1. + alpha * a) / a0,
                -2. * w.cos() / a0,
                (1. - alpha * a) / a0,
                -2. * w.cos() / a0,
                (1. - alpha / a) / a0,
            ];
        }
    }
}
impl<S: Source<Item = f32>> Iterator for Equalizer<S> {
    type Item = f32;
    fn next(&mut self) -> Option<f32> {
        let mut x = self.source.next()?;
        if self.count == 0 {
            self.update();
        }
        self.count = (self.count + 1) % 1024;
        for i in 0..10 {
            let [b0, b1, b2, a1, a2] = self.coefficients[i];
            let h = &mut self.history[self.channel][i];
            let y = b0 * x + h[0];
            h[0] = b1 * x - a1 * y + h[1];
            h[1] = b2 * x - a2 * y;
            x = y;
        }
        self.channel = (self.channel + 1) % self.history.len();
        Some(x.clamp(-1., 1.))
    }
}
impl<S: Source<Item = f32>> Source for Equalizer<S> {
    fn current_frame_len(&self) -> Option<usize> {
        self.source.current_frame_len()
    }
    fn channels(&self) -> u16 {
        self.source.channels()
    }
    fn sample_rate(&self) -> u32 {
        self.source.sample_rate()
    }
    fn total_duration(&self) -> Option<Duration> {
        self.source.total_duration()
    }
    fn try_seek(&mut self, pos: Duration) -> Result<(), rodio::source::SeekError> {
        self.source.try_seek(pos)?;
        self.history.fill([[0.; 2]; 10]);
        self.channel = 0;
        Ok(())
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn flat_eq_preserves_samples() {
        let samples = vec![0.25, -0.25, 0.5, -0.5];
        let source = rodio::buffer::SamplesBuffer::new(2, 44100, samples.clone());
        let out: Vec<f32> = Equalizer::new(source, Arc::new(Mutex::new([0.; 10]))).collect();
        for (a, b) in out.iter().zip(samples) {
            assert!((a - b).abs() < 0.00001);
        }
    }
    #[test]
    #[ignore = "requires a native audio output device; renders silence"]
    fn native_pause_resume_seek() {
        let (_stream, handle) = rodio::OutputStream::try_default().unwrap();
        let sink = rodio::Sink::try_new(&handle).unwrap();
        let source = rodio::buffer::SamplesBuffer::new(2, 44100, vec![0_f32; 44100 * 2 * 3]);
        sink.append(Equalizer::new(source, Arc::new(Mutex::new([0.; 10]))));
        std::thread::sleep(Duration::from_millis(160));
        sink.pause();
        std::thread::sleep(Duration::from_millis(50));
        let paused = sink.get_pos();
        std::thread::sleep(Duration::from_millis(100));
        assert_eq!(paused, sink.get_pos());
        assert!(paused > Duration::ZERO);
        sink.try_seek(Duration::from_secs(1)).unwrap();
        sink.play();
        std::thread::sleep(Duration::from_millis(160));
        assert!(sink.get_pos() > Duration::from_secs(1));
        sink.stop();
    }
}
