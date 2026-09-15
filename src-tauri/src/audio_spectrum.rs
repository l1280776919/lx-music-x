use rodio::Source;
use std::{
    f32::consts::PI,
    sync::{Arc, Mutex},
    time::Duration,
};

pub const FFT_SIZE: usize = 1024;
pub const NUM_BANDS: usize = 36;

/// FFT & Spectrum Analyzer state shared between audio playback tap and tick engine
pub struct SpectrumState {
    pub ring_buffer: Vec<f32>,
    pub write_pos: usize,
    pub channels: usize,
    pub sample_rate: u32,
    pub prev_bands: [f32; NUM_BANDS],
}

impl SpectrumState {
    pub fn new() -> Self {
        Self {
            ring_buffer: vec![0.0; FFT_SIZE],
            write_pos: 0,
            channels: 2,
            sample_rate: 44100,
            prev_bands: [0.0; NUM_BANDS],
        }
    }

    /// Read latest FFT_SIZE samples, apply Hann window, compute FFT, and map into NUM_BANDS
    pub fn compute_bands(&mut self) -> [f32; NUM_BANDS] {
        let mut re = [0.0f32; FFT_SIZE];
        let mut im = [0.0f32; FFT_SIZE];

        // Read window from ring buffer
        let start = self.write_pos;
        for i in 0..FFT_SIZE {
            let idx = (start + i) % FFT_SIZE;
            let sample = self.ring_buffer[idx];
            // Hann window
            let hann = 0.5 * (1.0 - (2.0 * PI * i as f32 / (FFT_SIZE as f32 - 1.0)).cos());
            re[i] = sample * hann;
        }

        // In-place Radix-2 FFT
        fft_1024(&mut re, &mut im);

        // Magnitudes of first FFT_SIZE / 2 bins
        let num_bins = FFT_SIZE / 2;
        let mut magnitudes = [0.0f32; FFT_SIZE / 2];
        for i in 0..num_bins {
            let mag = (re[i] * re[i] + im[i] * im[i]).sqrt() / (FFT_SIZE as f32 * 0.25);
            magnitudes[i] = mag;
        }

        let mut current_bands = [0.0f32; NUM_BANDS];
        let nyquist = (self.sample_rate as f32) / 2.0;
        let min_freq = 30.0f32;
        let max_freq = 16000.0f32.min(nyquist);

        for i in 0..NUM_BANDS {
            let t0 = i as f32 / NUM_BANDS as f32;
            let t1 = (i + 1) as f32 / NUM_BANDS as f32;
            // Logarithmic frequency distribution
            let f0 = min_freq * (max_freq / min_freq).powf(t0);
            let f1 = min_freq * (max_freq / min_freq).powf(t1);

            let bin0 = ((f0 / nyquist) * num_bins as f32).floor() as usize;
            let bin1 = (((f1 / nyquist) * num_bins as f32).ceil() as usize).max(bin0 + 1).min(num_bins);

            let mut sum = 0.0f32;
            let mut count = 0;
            for b in bin0..bin1 {
                sum += magnitudes[b];
                count += 1;
            }
            let avg = if count > 0 { sum / count as f32 } else { 0.0 };

            // Mild treble boost to balance human perception (pink noise tilt)
            let treble_tilt = 1.0 + (i as f32 / NUM_BANDS as f32) * 2.0;
            let raw_val = (avg * treble_tilt * 1.6).clamp(0.0, 1.0);

            // Falloff smoothing (quick attack, smooth decay)
            let smoothed = if raw_val >= self.prev_bands[i] {
                raw_val
            } else {
                self.prev_bands[i] * 0.82
            };

            current_bands[i] = if smoothed < 0.01 { 0.0 } else { smoothed };
            self.prev_bands[i] = current_bands[i];
        }

        current_bands
    }

    pub fn decay_bands(&mut self) -> [f32; NUM_BANDS] {
        let mut all_zero = true;
        for i in 0..NUM_BANDS {
            self.prev_bands[i] = (self.prev_bands[i] * 0.75).max(0.0);
            if self.prev_bands[i] < 0.01 {
                self.prev_bands[i] = 0.0;
            } else {
                all_zero = false;
            }
        }
        if all_zero {
            self.prev_bands = [0.0; NUM_BANDS];
        }
        self.prev_bands
    }
}

/// In-place radix-2 Decimation-In-Time FFT for N=1024
fn fft_1024(re: &mut [f32; FFT_SIZE], im: &mut [f32; FFT_SIZE]) {
    // Bit-reversal permutation
    let mut j = 0usize;
    for i in 0..FFT_SIZE {
        if j > i {
            re.swap(i, j);
            im.swap(i, j);
        }
        let mut m = FFT_SIZE >> 1;
        while m >= 1 && j >= m {
            j -= m;
            m >>= 1;
        }
        j += m;
    }

    // Cooley-Tukey butterflies
    let mut len = 2;
    while len <= FFT_SIZE {
        let half_len = len / 2;
        let angle = -2.0 * PI / (len as f32);
        let w_step_re = angle.cos();
        let w_step_im = angle.sin();

        let mut i = 0;
        while i < FFT_SIZE {
            let mut w_re = 1.0f32;
            let mut w_im = 0.0f32;
            for k in 0..half_len {
                let u_re = re[i + k];
                let u_im = im[i + k];

                let v_re = re[i + k + half_len] * w_re - im[i + k + half_len] * w_im;
                let v_im = re[i + k + half_len] * w_im + im[i + k + half_len] * w_re;

                re[i + k] = u_re + v_re;
                im[i + k] = u_im + v_im;
                re[i + k + half_len] = u_re - v_re;
                im[i + k + half_len] = u_im - v_im;

                let next_w_re = w_re * w_step_re - w_im * w_step_im;
                let next_w_im = w_re * w_step_im + w_im * w_step_re;
                w_re = next_w_re;
                w_im = next_w_im;
            }
            i += len;
        }
        len <<= 1;
    }
}

/// Rodio Source wrapper that taps samples into SpectrumState
pub struct SpectrumTap<S> {
    source: S,
    state: Arc<Mutex<SpectrumState>>,
    channel_index: usize,
    accum_sample: f32,
}

impl<S: Source<Item = f32>> SpectrumTap<S> {
    pub fn new(source: S, state: Arc<Mutex<SpectrumState>>) -> Self {
        let channels = source.channels() as usize;
        let sample_rate = source.sample_rate();
        if let Ok(mut s) = state.lock() {
            s.channels = channels;
            s.sample_rate = sample_rate;
        }
        Self {
            source,
            state,
            channel_index: 0,
            accum_sample: 0.0,
        }
    }
}

impl<S: Source<Item = f32>> Iterator for SpectrumTap<S> {
    type Item = f32;

    fn next(&mut self) -> Option<f32> {
        let sample = self.source.next()?;
        self.accum_sample += sample;
        self.channel_index += 1;

        let channels = self.source.channels() as usize;
        if self.channel_index >= channels {
            let mono_sample = self.accum_sample / (channels as f32);
            self.channel_index = 0;
            self.accum_sample = 0.0;

            if let Ok(mut state) = self.state.try_lock() {
                let pos = state.write_pos;
                state.ring_buffer[pos] = mono_sample;
                state.write_pos = (pos + 1) % FFT_SIZE;
            }
        }

        Some(sample)
    }
}

impl<S: Source<Item = f32>> Source for SpectrumTap<S> {
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
        self.source.try_seek(pos)
    }
}