import revealData from '../dialogues/jungle_reveal.js';
import DialogueController from '../utils/DialogueController.js';

export default class JungleMainScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(revealData);

        // 0 = Blindfolded, 1 = Unfolding Action, 2 = Revealed
        this.visualState = 0; 
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_jungle');
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background
        const bg = assets.getImage('jungle'); 
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Characters
        this.drawCharacters(ctx, width, height, assets);

        // 3. Dialogue
        this.dialogue.draw();
    }

    drawCharacters(ctx, width, height, assets) {
        // STATE 0: WAITING
        if (this.visualState === 0) {
            const her = assets.getImage('blindfolded');
            const you = assets.getImage('you_front');
            if (her) {
                const s = (height * 0.45) / her.height;
                const w = her.width * s;
                ctx.drawImage(her, -20, height - (height*0.45), w, height*0.45);
            }
            if (you) {
                const s = (height * 0.45) / you.height;
                const w = you.width * s;
                ctx.drawImage(you, width - w + 20, height - (height*0.45), w, height*0.45);
            }
        }
        // STATE 1: THE REVEAL (Overlay)
        else if (this.visualState === 1) {
            const action = assets.getImage('unfolding'); 
            if (action) {
                const scale = (width * 0.95) / action.width; 
                const w = action.width * scale;
                const h = action.height * scale;
                ctx.drawImage(action, (width - w) / 2, height - h, w, h);
            }
        }
        // STATE 2: EXCITEMENT
        else if (this.visualState === 2) {
            const her = assets.getImage('her_excited'); 
            const you = assets.getImage('you_front');
            if (her) {
                const s = (height * 0.45) / her.height;
                const w = her.width * s;
                ctx.drawImage(her, -20, height - (height*0.45), w, height*0.45);
            }
            if (you) {
                const s = (height * 0.45) / you.height;
                const w = you.width * s;
                ctx.drawImage(you, width - w + 20, height - (height*0.45), w, height*0.45);
            }
        }
    }

    handleClick(x, y) {
        // If showing the CG, click to finish it
        if (this.visualState === 1) {
             this.visualState = 2; 
             this.dialogue.advance(); 
             return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        // --- TRANSITION LOGIC ---
        if (signal === "UNFOLD_ANIMATION") {
            this.visualState = 1; 
        }
        else if (signal === "END") {
            // This was missing/broken!
            console.log("Jungle Reveal Done -> Switching to Quest");
            this.manager.switchScene('FALLEN_TREE');
        }
    }
}