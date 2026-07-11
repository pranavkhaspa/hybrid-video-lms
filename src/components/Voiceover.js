class VoiceoverManager {
  constructor() {
    this.utterance = null;
    this.voiceoverEnabled = true;
    this.playbackRate = 1.0;
  }

  setParams(enabled, rate) {
    this.voiceoverEnabled = enabled;
    this.playbackRate = rate;
  }

  speak(text) {
    if (!this.voiceoverEnabled) return;
    
    // Stop any active speech
    window.speechSynthesis.cancel();
    
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Fetch voices
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural premium english voices if loaded
    const selectedVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Natural")) ||
                          voices.find(v => v.lang.includes("en-US")) ||
                          voices.find(v => v.lang.startsWith("en"));
    
    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
    }
    
    // Set speech variables
    this.utterance.rate = this.playbackRate * 0.92; // slightly slower for cinematic pacing
    this.utterance.pitch = 0.95; // warm, deep sound
    
    window.speechSynthesis.speak(this.utterance);
  }

  stop() {
    window.speechSynthesis.cancel();
  }
}

export const voiceoverInstance = new VoiceoverManager();
