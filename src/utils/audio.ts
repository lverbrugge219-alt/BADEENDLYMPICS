/**
 * Web Audio API synthesized sound generator for Badeendlympics.
 * No external audio files needed; generates high-quality quack & whistle tones in-browser.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;
let cheerAudio: HTMLAudioElement | null = null;

if (typeof window !== 'undefined') {
  try {
    cheerAudio = new Audio('/kwak-cheer.mp3');
    cheerAudio.preload = 'auto';
  } catch {
    // ignore
  }
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

/**
 * Plays the Kwak Cheer! sound using the uploaded audio / MP3 or rich synthesized duck quack
 */
export function playDuckQuack(pitch = 1.0) {
  if (isMuted) return;

  // Try playing MP3 audio file first
  if (cheerAudio) {
    try {
      cheerAudio.currentTime = 0;
      const playPromise = cheerAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay policy or file missing, fallback to Web Audio
          synthesizeDuckQuack(pitch);
        });
        return;
      }
    } catch {
      // Fallback
    }
  }

  synthesizeDuckQuack(pitch);
}

/**
 * Synthesizes a humorous rubber duck "quack" with squeak formant
 */
export function synthesizeDuckQuack(pitch = 1.0) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Initial Squeak (high pitch rubber duck squeak)
    const squeakOsc = ctx.createOscillator();
    const squeakGain = ctx.createGain();
    squeakOsc.type = 'sine';
    squeakOsc.frequency.setValueAtTime(1400 * pitch, now);
    squeakOsc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.08);
    squeakGain.gain.setValueAtTime(0.001, now);
    squeakGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    squeakOsc.connect(squeakGain);
    squeakGain.connect(ctx.destination);
    squeakOsc.start(now);
    squeakOsc.stop(now + 0.1);

    // 2. Main Quack body (resonant duck formant)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360 * pitch, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(180 * pitch, now + 0.26);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950 * pitch, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(420 * pitch, now + 0.26);
    filter.Q.setValueAtTime(5.0, now + 0.05);

    gain.gain.setValueAtTime(0.001, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + 0.05);
    osc.stop(now + 0.29);
  } catch {
    // Graceful fallback
  }
}

/**
 * Synthesizes a referee whistle for race starts
 */
export function playWhistle() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(2600, now);
    osc2.frequency.setValueAtTime(2850, now);

    // Trill modulation
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    mod.frequency.setValueAtTime(30, now);
    modGain.gain.setValueAtTime(100, now);
    mod.connect(osc1.frequency);
    mod.connect(osc2.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    mod.start(now);
    osc1.start(now);
    osc2.start(now);

    mod.stop(now + 0.36);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  } catch {
    // Graceful fallback
  }
}

/**
 * Synthesizes a triumph chime for podium / sign up
 */
export function playVictoryChime() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + index * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.52);
    });
  } catch {
    // Graceful fallback
  }
}
