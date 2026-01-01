import scaryData from '../dialogues/scary_jungle.js';
import DialogueController from '../utils/DialogueController.js';

export default class ScaryJungleScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(scaryData);
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_tense'); 
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background (Scary Jungle)
        const bg = assets.getImage('jungle_scary'); 
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Atmosphere: Dark Vignette
        const grad = ctx.createRadialGradient(width/2, height/2, height*0.3, width/2, height/2, height);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,10,20,0.6)"); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 3. Characters (Only Her)
        this.drawCharacters(ctx, width, height, assets);

        // 4. Dialogue
        this.dialogue.draw();
    }

    drawCharacters(ctx, width, height, assets) {
        // Default expression
        let herKey = 'her_scared';

        // Check dialogue for HER expression only
        if (this.dialogue.current && this.dialogue.current.expression) {
            if (this.dialogue.current.speaker === 'her') {
                herKey = this.dialogue.current.expression;
            }
        }

        const her = assets.getImage(herKey) || assets.getImage('her_scared');
        
        // Draw HER (Visible)
        if (her) {
            const s = (height * 0.45) / her.height;
            const w = her.width * s;
            ctx.drawImage(her, -20, height - (height*0.45), w, height*0.45);
        }

        // [REMOVED "YOU" SPRITE DRAWING LOGIC HERE]
        // You are now invisible (First Person View)
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        if (signal === "END_SCENE") {
            this.manager.switchScene('WATERFALL'); 
        }
    }
}