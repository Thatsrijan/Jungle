export default class SoundManager {
    constructor() {
        this.sounds = {};
        this.currentBGM = null;
        this.muted = false;
    }

    load(key, src) {
        const audio = new Audio(src);
        this.sounds[key] = audio;
    }

    playSFX(key) {
        if (this.muted || !this.sounds[key]) return;
        // Clone node allows overlapping sounds (fast tapping)
        const sfx = this.sounds[key].cloneNode();
        sfx.volume = 0.5;
        sfx.play().catch(e => console.log("Audio waiting for interaction"));
    }

    playBGM(key, fadeDuration = 2000) {
        if (this.muted || !this.sounds[key]) return;
        
        // If already playing this track, do nothing
        if (this.currentBGM && this.currentBGM.src === this.sounds[key].src && !this.currentBGM.paused) return;

        // Stop previous
        if (this.currentBGM) {
            const oldBGM = this.currentBGM;
            // Simple fade out logic could go here
            oldBGM.pause();
            oldBGM.currentTime = 0;
        }

        this.currentBGM = this.sounds[key];
        this.currentBGM.loop = true;
        this.currentBGM.volume = 0.4; // Background level
        this.currentBGM.play().catch(e => console.log("Audio waiting for interaction"));
    }

    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
        }
    }
}