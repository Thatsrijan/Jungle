import animalData from '../dialogues/animals.js';
import DialogueController from '../utils/DialogueController.js';

export default class AnimalScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(animalData);
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_jungle');
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background (The Animals)
        // This image already contains the animals, so we just draw it as the BG.
        const bg = assets.getImage('jungle_animals'); 
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Characters (Custom Logic for Blending)
        this.drawCharacters(ctx, width, height, assets);

        // 3. Dialogue
        this.dialogue.draw();
    }

    drawCharacters(ctx, width, height, assets) {
        // --- YOU (Watching Her) ---
        // Default to "Explain" or "Front" based on dialogue
        let youKey = 'you_explain'; 
        if (this.dialogue.current && this.dialogue.current.speaker === 'you' && this.dialogue.current.expression) {
            youKey = this.dialogue.current.expression;
        }

        const you = assets.getImage(youKey) || assets.getImage('you_front');
        if (you) {
            // Standard standing size
            const s = (height * 0.45) / you.height;
            const w = you.width * s;
            // Draw on the RIGHT side, observing
            ctx.drawImage(you, width - w + 20, height - (height*0.45), w, height*0.45);
        }


        // --- HER (Crouching / Interacting) ---
        // If the scene is active, we force the "Crouch/Pat" sprite because it fits the context
        // regardless of the exact facial expression in the text, unless she stands up later.
        // For this specific scene, keeping her crouching looks best.
        
        const her = assets.getImage('her_crouch'); //
        if (her) {
            // Crouch sprites are usually shorter, so we scale them slightly differently 
            // to match the human proportion of the "You" sprite.
            const s = (height * 0.40) / her.height; 
            const w = her.width * s;
            const h = her.height * s;
            
            // POSITIONING: 
            // Drawn on the LEFT side.
            // Y-Axis: Placed lower (height - h + 30) to ground her in the grass.
            ctx.drawImage(her, (width * 0.1), height - h + 20, w, h);
        }
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        if (signal === "END_SCENE") {
            this.manager.switchScene('BRIDGE'); // <--- Update this
        }
            // this.manager.switchScene('WATERFALL'); 
    }
}