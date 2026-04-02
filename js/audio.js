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
            this.musicGain.gain.value = 0.3;
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.6;
            this.sfxGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            // Web Audio not supported
        }
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

    sfxJump(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    sfxLand(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.1);

        const noise = this.createNoise(0.05);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.1, t);
        nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        noise.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.05);
    }

    sfxTrick(t) {
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, t + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.1);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.06);
            osc.stop(t + i * 0.06 + 0.1);
        });
    }

    sfxCoin(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.setValueAtTime(1600, t + 0.05);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    sfxGrind(t) {
        const noise = this.createNoise(0.15);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 2;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.15);
    }

    sfxHit(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.25);

        const noise = this.createNoise(0.1);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.2, t);
        nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        noise.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.1);
    }

    sfxGameOver(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 1);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 1.2);
    }

    sfxSelect(t) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.06);
    }

    sfxPurchase(t) {
        const noise = this.createNoise(0.08);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.15, t);
        nGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        noise.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.08);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1400;
        gain.gain.setValueAtTime(0.2, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t + 0.05);
        osc.stop(t + 0.2);
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

        const bpm = 120;
        const beatDur = 60 / bpm;
        const barDur = beatDur * 4;
        const t = this.ctx.currentTime + 0.05;

        const bassNotes = [220, 220, 174.61, 174.61, 261.63, 261.63, 196, 196];
        const melodyNotes = [
            440, 523, 659, 523,
            349, 440, 523, 440,
            523, 659, 784, 659,
            392, 523, 659, 523
        ];

        for (let bar = 0; bar < 4; bar++) {
            const barStart = t + bar * barDur;

            for (let beat = 0; beat < 2; beat++) {
                const noteTime = barStart + beat * beatDur * 2;
                const noteIdx = bar * 2 + beat;
                this.playBass(bassNotes[noteIdx], noteTime, beatDur * 2);
            }

            for (let beat = 0; beat < 4; beat++) {
                const noteTime = barStart + beat * beatDur;
                this.playMelody(melodyNotes[bar * 4 + beat], noteTime, beatDur * 0.8);
            }

            for (let beat = 0; beat < 4; beat++) {
                const beatTime = barStart + beat * beatDur;
                this.playKick(beatTime);

                if (beat === 1 || beat === 3) {
                    this.playSnare(beatTime);
                }

                for (let sub = 0; sub < 2; sub++) {
                    this.playHihat(beatTime + sub * beatDur * 0.5);
                }
            }

            this.playPad(bassNotes[bar * 2], barStart, barDur);
        }

        const totalDur = barDur * 4;
        setTimeout(() => {
            if (this.musicPlaying) {
                this.scheduleMusic();
            }
        }, (totalDur - 0.2) * 1000);
    }

    playBass(freq, time, dur) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq / 2;
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.setValueAtTime(0.15, time + dur * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + dur);
        this.musicNodes.push(osc);
    }

    playMelody(freq, time, dur) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
        gain.gain.setValueAtTime(0.08, time + dur * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + dur);
        this.musicNodes.push(osc);
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(time);
        osc.stop(time + 0.15);
        this.musicNodes.push(osc);
    }

    playSnare(time) {
        const noise = this.createNoise(0.1);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        noise.start(time);
        noise.stop(time + 0.1);
        this.musicNodes.push(noise);
    }

    playHihat(time) {
        const noise = this.createNoise(0.04);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6000;
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

    playPad(freq, time, dur) {
        for (let detune of [-10, 0, 10]) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            osc.detune.value = detune;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.03, time + dur * 0.3);
            gain.gain.setValueAtTime(0.03, time + dur * 0.7);
            gain.gain.linearRampToValueAtTime(0, time + dur);
            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.start(time);
            osc.stop(time + dur);
            this.musicNodes.push(osc);
        }
    }
}
