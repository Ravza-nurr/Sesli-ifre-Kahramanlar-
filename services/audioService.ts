export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;

  // Cancel any currently playing speech to avoid queue buildup
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher/friendlier

  // Try to find a Turkish voice
  const voices = window.speechSynthesis.getVoices();
  const trVoice = voices.find(v => v.lang.includes('tr'));
  if (trVoice) {
    utterance.voice = trVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'win' | 'flip' | 'pop' | 'levelUp') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'correct') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start();
    osc.stop(now + 0.4);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start();
    osc.stop(now + 0.3);
  } else if (type === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start();
    osc.stop(now + 0.1);
  } else if (type === 'flip') {
    // Softer, higher pitched "whoosh" or "blip"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start();
    osc.stop(now + 0.1);
  } else if (type === 'pop') {
    // A quick cork pop sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start();
    osc.stop(now + 0.1);
  } else if (type === 'levelUp') {
    // Ascending magical chimes
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const oscN = ctx.createOscillator();
        const gainN = ctx.createGain();
        oscN.connect(gainN);
        gainN.connect(ctx.destination);
        oscN.type = 'triangle';
        oscN.frequency.value = freq;
        gainN.gain.setValueAtTime(0.1, now + i * 0.1);
        gainN.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        oscN.start(now + i * 0.1);
        oscN.stop(now + i * 0.1 + 0.4);
    });
  } else if (type === 'win') {
    // A longer arpeggio
    [440, 554, 659, 880, 1108, 1318].forEach((freq, i) => {
        const oscN = ctx.createOscillator();
        const gainN = ctx.createGain();
        oscN.connect(gainN);
        gainN.connect(ctx.destination);
        oscN.type = 'sine';
        oscN.frequency.value = freq;
        gainN.gain.setValueAtTime(0.2, now + i * 0.1);
        gainN.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
        oscN.start(now + i * 0.1);
        oscN.stop(now + i * 0.1 + 0.6);
    });
  }
};