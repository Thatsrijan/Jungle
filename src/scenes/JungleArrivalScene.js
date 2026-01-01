import travelData from '../dialogues/travel.js'; // The "Landing" dialogue
import DialogueController from '../utils/DialogueController.js';

export default class JungleArrivalScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(travelData);
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_jungle'); 
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background
        const bg = assets.getImage('jungle_path');
        if (bg) {
            const imgRatio = bg.width / bg.height;
            const canvasRatio = width / height;
            let rw, rh, ox, oy;
            if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
            else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
            ctx.drawImage(bg, ox, oy, rw, rh);
        } else {
            ctx.fillStyle = "#2d4c1e";
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Characters
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

        // 3. Dialogue
        this.dialogue.draw();
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        if (signal === "JUNGLE_START") { 
             // Transition to Walking Scene
             this.manager.switchScene('JUNGLE_WALK');
        }
    }
}