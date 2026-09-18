/**
 * Web Audio API synthesizer for Kitchen Display System (KDS) & Order Alerts.
 * Generates pleasant, attention-grabbing restaurant bell chimes without relying on external MP3s.
 */
class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.activeInterval) {
      this.stopContinuousAlert();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Single order chime (e.g. for user adding to cart or order confirmed)
   */
  public playChime(type: 'success' | 'alert' | 'pop' = 'success') {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'success') {
        // High harmonic double bell
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        // Warning / Urgent kitchen bell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context might be blocked prior to user interaction
    }
  }

  /**
   * Kitchen Display Continuous Alert for NEW incoming orders until accepted
   */
  public startContinuousAlert() {
    if (this.isMuted || this.activeInterval) return;
    this.playChime('alert');
    this.activeInterval = window.setInterval(() => {
      this.playChime('alert');
    }, 3500);
  }

  public stopContinuousAlert() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }
}

export const soundService = new SoundService();
