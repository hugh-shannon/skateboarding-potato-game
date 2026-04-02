class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.musicPlaying = false;
        this.musicNodes = [];
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.25;
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.5;
            this.sfxGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {}
    }

    ensureInit() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSFX(name) {
        this.ensureInit();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;

        switch (name) {
            case 'jump': this.sfxJump(t); break;
            case 'land': this.sfxLand(t); break;
            case 'trick': this.sfxTrick(t); break;
            case 'coin': this.sfxCoin(t); break;
            case 'grind': this.sfxGrind(t); break;
            case 'hit': this.sfxHit(t); break;
            case 'gameover': this.sfxGameOver(t); break;
            case 'select': this.sfxSelect(t); break;
            case 'purchase': this.sfxPurchase(t); break;
        }
    }

    // Boing sound
    sfxJump(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.2);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.25);
    }

    // Soft thud + xylophone ping
    sfxLand(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.1);

        const ping = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        ping.type = 'sine';
        ping.frequency.value = 500;
        pingGain.gain.setValueAtTime(0.08, t);
        pingGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        ping.connect(pingGain);
        pingGain.connect(this.sfxGain);
        ping.start(t);
        ping.stop(t + 0.12);
    }

    // Xylophone arpeggio
    sfxTrick(t) {
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, t + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.15, t + i * 0.08 + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.15);
        });
    }

    // Music box chime
    sfxCoin(t) {
        const notes = [1047, 1319];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, t + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.04 + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.04);
            osc.stop(t + i * 0.04 + 0.25);
        });
    }

    // Soft rattle
    sfxGrind(t) {
        const noise = this.createNoise(0.12);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 4;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.12);
    }

    // Cartoon bonk
    sfxHit(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    // Sad descending melody (wah wah wah wahhh)
    sfxGameOver(t) {
        const notes = [330, 294, 262, 247];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.18, t + i * 0.25);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.25 + 0.3);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.25);
            osc.stop(t + i * 0.25 + (i === 3 ? 0.6 : 0.3));
        });
    }

    // Soft click
    sfxSelect(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
    }

    // Happy ascending jingle
    sfxPurchase(t) {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const dur = i === 3 ? 0.25 : 0.12;
            gain.gain.setValueAtTime(0, t + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.15, t + i * 0.08 + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + dur);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + dur);
        });
    }

    createNoise(duration) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        return source;
    }

    startMusic() {
        this.ensureInit();
        if (!this.ctx || this.musicPlaying) return;
        this.musicPlaying = true;
        this.scheduleMusic();
    }

    stopMusic() {
        this.musicPlaying = false;
        for (const node of this.musicNodes) {
            try { node.stop(); } catch (e) {}
        }
        this.musicNodes = [];
    }

    scheduleMusic() {
        if (!this.musicPlaying || !this.ctx) return;

        const bpm = 100;
        const beatDur = 60 / bpm;
        const barDur = beatDur * 4;
        const t = this.ctx.currentTime + 0.05;

        // Pentatonic melody: C D E G A pattern - music box style
        const melodyNotes = [
            523, 587, 659, 784,
            880, 784, 659, 587,
            523, 659, 784, 880,
            784, 659, 587, 523
        ];

        // Simple bass (root notes, sine)
        const bassNotes = [262, 262, 220, 220, 330, 330, 294, 294];

        for (let bar = 0; bar < 4; bar++) {
            const barStart = t + bar * barDur;

            // Bass
            for (let beat = 0; beat < 2; beat++) {
                const noteTime = barStart + beat * beatDur * 2;
                this.playBass(bassNotes[bar * 2 + beat], noteTime, beatDur * 2);
            }

            // Melody
            for (let beat = 0; beat < 4; beat++) {
                const noteTime = barStart + beat * beatDur;
                this.playMelody(melodyNotes[bar * 4 + beat], noteTime, beatDur * 0.7);
            }

            // Gentle percussion
            for (let beat = 0; beat < 4; beat++) {
                const beatTime = barStart + beat * beatDur;
                this.playKick(beatTime);

                if (beat === 1 || beat === 3) {
                    this.playTap(beatTime);
                }

                for (let sub = 0; sub < 2; sub++) {
                    this.playTick(beatTime + sub * beatDur * 0.5);
                }
            }
        }

        const totalDur = barDur * 4;
        setTimeout(() => {
            if (this.musicPlaying) {
                this.scheduleMusic();
            }
        }, (totalDur - 0.2) * 1000);
    }

    // Soft sine bass
    playBass(freq, time, dur) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq * 0.5;
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.setValueAtTime(0.1, time + dur * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + dur);
        this.musicNodes.push(osc);
    }

    // Music box melody - sharp attack sine
    playMelody(freq, time, dur) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + dur);
        this.musicNodes.push(osc);

        // Bell overtone
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 3;
        gain2.gain.setValueAtTime(0, time);
        gain2.gain.linearRampToValueAtTime(0.015, time + 0.005);
        gain2.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.5);
        osc2.connect(gain2);
        gain2.connect(this.musicGain);
        osc2.start(time);
        osc2.stop(time + dur * 0.5);
        this.musicNodes.push(osc2);
    }

    // Gentle kick - soft dum
    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + 0.1);
        this.musicNodes.push(osc);
    }

    // Pencil tap (replaces snare)
    playTap(time) {
        const noise = this.createNoise(0.04);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 3;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        noise.start(time);
        noise.stop(time + 0.04);
        this.musicNodes.push(noise);
    }

    // Tiny tick (replaces hihat)
    playTick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 8000;
        gain.gain.setValueAtTime(0.02, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + 0.02);
        this.musicNodes.push(osc);
    }
}
