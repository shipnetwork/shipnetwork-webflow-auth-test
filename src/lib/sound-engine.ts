// Sound Engine for Globe Visualization
// Plays subtle audio cues when orders ship

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = true; // Start muted by default
  private lastPlayTime: number = 0;
  private minInterval: number = 100; // Minimum ms between sounds to avoid overlapping

  constructor() {
    // AudioContext is created lazily on first user interaction
  }

  private initAudioContext() {
    if (typeof window !== "undefined" && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported");
      }
    }
  }

  /**
   * Play a category-specific sound when an order ships
   * Different categories have different pitch/timbre
   */
  playOrderShipSound(category?: string) {
    if (this.isMuted) return;

    // Throttle sounds to avoid overlapping
    const now = Date.now();
    if (now - this.lastPlayTime < this.minInterval) return;
    this.lastPlayTime = now;

    this.initAudioContext();
    if (!this.audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      // Category-specific frequencies and types
      const categoryConfig: Record<string, { freq: number; type: OscillatorType }> = {
        Electronics: { freq: 1200, type: "sine" }, // High-tech beep
        Apparel: { freq: 700, type: "sine" }, // Fabric swoosh
        "Home & Garden": { freq: 600, type: "triangle" }, // Natural tone
        "Health & Beauty": { freq: 900, type: "sine" }, // Clean tone
        "Sports & Outdoors": { freq: 800, type: "square" }, // Energetic
        "Toys & Games": { freq: 1000, type: "sine" }, // Playful chime
        "Food & Beverage": { freq: 850, type: "sine" }, // Cash register ding
        "Office Supplies": { freq: 750, type: "sine" }, // Professional
        "Pet Supplies": { freq: 950, type: "sine" }, // Friendly
        Automotive: { freq: 650, type: "sawtooth" }, // Mechanical
      };

      const config = category && categoryConfig[category] || { freq: 880, type: "sine" as OscillatorType };

      // Create oscillator for the beep
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure oscillator
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.freq, this.audioContext.currentTime);

      // Quick fade envelope for a soft "ping"
      const currentTime = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, currentTime + 0.01); // Soft attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15); // Quick decay

      // Play the sound
      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.15);
    } catch (e) {
      // Silently fail if audio fails
    }
  }

  /**
   * Play a slightly different sound for high-value orders
   */
  playHighValueOrderSound() {
    if (this.isMuted) return;

    const now = Date.now();
    if (now - this.lastPlayTime < this.minInterval) return;
    this.lastPlayTime = now;

    this.initAudioContext();
    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      // Create two oscillators for a richer sound
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Harmonious frequencies
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
      osc2.frequency.setValueAtTime(1320, this.audioContext.currentTime); // E6 (perfect fifth)

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.2);
      osc2.stop(now + 0.2);
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Set muted state
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
    
    // If unmuting, init audio context (requires user interaction)
    if (!muted) {
      this.initAudioContext();
    }
  }

  /**
   * Get current muted state
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Toggle muted state
   */
  toggleMuted(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Play delivery arrival sound (sparkle effect)
   */
  playDeliverySound(destination?: string) {
    if (this.isMuted) return;

    const now = Date.now();
    if (now - this.lastPlayTime < this.minInterval) return;
    this.lastPlayTime = now;

    this.initAudioContext();
    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Sparkle sound - higher pitch, quick decay
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1400, this.audioContext.currentTime);

      const currentTime = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.1);
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Play warehouse pulse sound (ambient)
   */
  playWarehousePulse(intensity: number) {
    if (this.isMuted) return;

    this.initAudioContext();
    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Low ambient pulse
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);

      const currentTime = this.audioContext.currentTime;
      const volume = 0.02 * Math.min(intensity / 100, 1); // Scale with intensity
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.5);
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Play a triumphant sound for milestone celebrations
   */
  playMilestoneSound(milestone?: number) {
    if (this.isMuted) return;

    this.initAudioContext();
    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      // Create a triumphant chord progression
      const now = this.audioContext.currentTime;
      const notes = [
        { freq: 523.25, delay: 0 },     // C5
        { freq: 659.25, delay: 0.1 },   // E5
        { freq: 783.99, delay: 0.2 },   // G5
        { freq: 1046.50, delay: 0.3 },  // C6
      ];

      notes.forEach(({ freq, delay }) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext!.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.5);
      });
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Play a soft delivery completion sound
   */
  playDeliverySound() {
    if (this.isMuted) return;

    const now = Date.now();
    if (now - this.lastPlayTime < 50) return; // Shorter throttle for delivery
    this.lastPlayTime = now;

    this.initAudioContext();
    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
      
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Silently fail
    }
  }
}

// Singleton instance
export const soundEngine = new SoundEngine();

