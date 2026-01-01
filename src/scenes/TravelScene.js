import flightData from '../dialogues/flight.js'; 
import DialogueController from '../utils/DialogueController.js';

export default class TravelScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(flightData);
        
        this.floatTime = 0;
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_travel');
    }

    update(dt) {
        this.floatTime += dt * 0.002;
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background (Sky)
        const bg = assets.getImage('travel_transition');
        if (bg) {
            const imgRatio = bg.width / bg.height;
            const canvasRatio = width / height;
            let rw, rh, ox, oy;
            if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
            else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
            ctx.drawImage(bg, ox, oy, rw, rh);
        } else {
            ctx.fillStyle = "#6a8dc9"; 
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Airplane
        const plane = assets.getImage('airplane');
        if (plane) {
            const scale = (width * 0.7) / plane.width; 
            const pw = plane.width * scale;
            const ph = plane.height * scale;
            const offsetY = Math.sin(this.floatTime) * 10;
            ctx.drawImage(plane, (width - pw)/2, (height * 0.3) + offsetY, pw, ph);
        }

        // 3. Characters
        const herImg = assets.getImage('blindfolded'); 
        if (herImg) {
            const scale = (height * 0.45) / herImg.height; 
            const w = herImg.width * scale;
            const h = herImg.height * scale;
            ctx.drawImage(herImg, -20, height - h, w, h); 
        }

        const youImg = assets.getImage('you_front');
        if (youImg) {
            const scale = (height * 0.45) / youImg.height; 
            const w = youImg.width * scale;
            const h = youImg.height * scale;
            ctx.drawImage(youImg, width - w + 20, height - h, w, h);
        }

        // 4. Dialogue
        this.dialogue.draw();
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        // --- FIX: ACTUAL TRANSITION ---
        if (signal === "LANDING") {
            this.manager.switchScene('JUNGLE_ARRIVAL');
        }
    }
}