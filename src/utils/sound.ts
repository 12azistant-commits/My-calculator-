/**
 * Web Audio API synthesizer for clean key press audio feedback
 */

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick(type: 'number' | 'operator' | 'clear' | 'equals' | 'error' | 'toggle' = 'number') {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      switch (type) {
        case 'number':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;

        case 'operator':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'clear':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'equals':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
          break;

        case 'error':
          osc.type = 'square';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.setValueAtTime(140, now + 0.06);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;

        case 'toggle':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
      }
    } catch {
      // Ignore web audio restrictions if user hasn't interacted
    }

    // Trigger haptic if supported
    if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  }
}

export const sound = new SoundEngine();
