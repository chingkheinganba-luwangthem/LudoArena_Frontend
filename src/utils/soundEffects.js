/**
 * Web Audio API utility for LudoArena sounds.
 * Premium, satisfying sound effects using Web Audio synthesis.
 */

let audioContext = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};

const resumeAudio = async () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    return ctx;
};

/**
 * Play a satisfying, musical dice roll sound — cascading marimba-like tones
 */
export const playDiceSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        
        // Musical cascading tones (pentatonic scale) for a satisfying roll feel
        const notes = [587.33, 659.25, 783.99, 880.00, 987.77, 1046.50];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq + (Math.random() * 30 - 15), now + i * 0.04);
            
            gain.gain.setValueAtTime(0, now + i * 0.04);
            gain.gain.linearRampToValueAtTime(0.12, now + i * 0.04 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.12);
        });

        // Soft shaker overlay
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.03 * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a smooth, pleasant "pop" move sound
 */
export const playMoveSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.08);
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a sharp, metallic kill sound
 */
export const playKillSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(300, now);
        osc1.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain1.gain.setValueAtTime(0.1, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(100, now + 0.05);
        gain2.gain.setValueAtTime(0.15, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        
        osc1.start(now); osc1.stop(now + 0.15);
        osc2.start(now + 0.05); osc2.stop(now + 0.3);
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a grand, epic game start fanfare — layered crescendo
 */
export const playStartSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        
        // Triumphant ascending arpeggio with sustain
        const notes = [
            { freq: 523.25, time: 0, dur: 0.6 },     // C5
            { freq: 659.25, time: 0.08, dur: 0.55 },  // E5
            { freq: 783.99, time: 0.16, dur: 0.5 },   // G5
            { freq: 1046.50, time: 0.28, dur: 0.6 },  // C6
            { freq: 1318.51, time: 0.36, dur: 0.7 },  // E6
        ];

        notes.forEach(({ freq, time, dur }) => {
            // Main tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + time);
            gain.gain.setValueAtTime(0, now + time);
            gain.gain.linearRampToValueAtTime(0.12, now + time + 0.02);
            gain.gain.setValueAtTime(0.12, now + time + dur * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + time); osc.stop(now + time + dur);

            // Subtle octave harmonic
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(freq * 2, now + time);
            gain2.gain.setValueAtTime(0, now + time);
            gain2.gain.linearRampToValueAtTime(0.04, now + time + 0.02);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + time + dur * 0.6);
            osc2.connect(gain2); gain2.connect(ctx.destination);
            osc2.start(now + time); osc2.stop(now + time + dur);
        });

        // Low rumble for epic feel
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(130.81, now);
        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        bassOsc.connect(bassGain); bassGain.connect(ctx.destination);
        bassOsc.start(now); bassOsc.stop(now + 1.2);
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a rewarding chime when a token enters home
 */
export const playFinishSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        const notes = [880.00, 1318.51];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);
            gain.gain.setValueAtTime(0.15, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.4);
        });
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a grand victory fanfare
 */
export const playWinSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0.12, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.6);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.6);
        });
    } catch (e) { console.warn("Audio error:", e); }
};

/**
 * Play a gentle, satisfying "ding" when landing on a star ⭐
 */
export const playStarSound = async () => {
    try {
        const ctx = await resumeAudio();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.50, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.4);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2093.00, now);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.05, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc2.start(now); osc2.stop(now + 0.2);
    } catch (e) { console.warn("Audio error:", e); }
};
