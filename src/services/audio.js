// ============================================================
// MediConnect Japan - Web Audio Synthesis & Speech Engine
// ============================================================

class SoundService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  getAudioContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playReminderChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gentle dual bell harmonic (G4 -> C5)
      const freqs = [392.0, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.3);
      });
    } catch (e) {
      console.warn("Audio chime failed:", e);
    }
  }

  playSuccessChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major arpeggio
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch (e) {
      console.warn("Audio success failed:", e);
    }
  }

  playEmergencyAlarm() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Urgent siren pulse
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        const startTime = now + i * 0.35;
        osc.frequency.setValueAtTime(880, startTime);
        osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.25);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.32);
      }
    } catch (e) {
      console.warn("Audio alarm failed:", e);
    }
  }

  playHeartbeat() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.14].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(idx === 0 ? 80 : 65, now + delay);
        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      });
    } catch (e) {
      console.warn("Audio heartbeat failed:", e);
    }
  }

  speak(text, lang = "en-US") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      this.lastSpokenText = text;
      this.lastSpokenLang = lang;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92; // deliberate, gentle tempo for elderly clarity
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  repeatLastSpoken() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, this.lastSpokenLang || "en-US");
    } else {
      this.speak("There is nothing to repeat right now.", "en-US");
    }
  }

  // --- Voice Input / Speech Recognition Engine ---
  startSpeechRecognition(onResult, onStatusChange) {
    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      console.warn("Speech recognition not natively supported in this browser environment.");
      if (onStatusChange) onStatusChange("unsupported");
      return null;
    }

    try {
      if (this.activeRecognition) {
        this.activeRecognition.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isRecognizing = true;
        if (onStatusChange) onStatusChange("listening");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (onStatusChange) onStatusChange("error", event.error);
      };

      recognition.onend = () => {
        this.isRecognizing = false;
        if (onStatusChange) onStatusChange("idle");
      };

      recognition.start();
      this.activeRecognition = recognition;
      return recognition;
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      if (onStatusChange) onStatusChange("error", err);
      return null;
    }
  }

  stopSpeechRecognition() {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch (e) {
        // ignore
      }
      this.activeRecognition = null;
    }
    this.isRecognizing = false;
  }
}

export const soundService = new SoundService();
