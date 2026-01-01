import blindfoldData from '../dialogues/blindfold.js';
import DialogueController from '../utils/DialogueController.js';

export default class BlindfoldScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(blindfoldData);

        // 0 = Talk, 1 = Action (Putting on), 2 = Done (Wearing)
        this.visualState = 0; 
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;
        
        // 1. Background
        const bg = assets.getImage('home_bg');
        if (bg) {
            const imgRatio = bg.width / bg.height;
            const canvasRatio = width / height;
            let renderW, renderH, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                renderH = height;
                renderW = height * imgRatio;
                offsetX = (width - renderW) / 2;
                offsetY = 0;
            } else {
                renderW = width;
                renderH = width / imgRatio;
                offsetX = 0;
                offsetY = (height - renderH) / 2;
            }
            ctx.drawImage(bg, offsetX, offsetY, renderW, renderH);
        }

        // 2. Characters
        this.drawCharacters(ctx, width, height, assets);

        // 3. Dialogue
        this.dialogue.draw();
    }

    drawCharacters(ctx, width, height, assets) {
        if (this.visualState === 0) {
            // Normal
            const her = assets.getImage('her_front');
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
        else if (this.visualState === 1) {
            // Action
            const action = assets.getImage('blindfolding');
            if (action) {
                const s = (height * 0.55) / action.height;
                const w = action.width * s;
                const h = action.height * s;
                ctx.drawImage(action, (width - w) / 2, height - h, w, h);
            }
        }
        else if (this.visualState === 2) {
            // Result
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
    }

    handleClick(x, y) {
        const signal = this.dialogue.advance();

        if (signal === "SHOW_BLINDFOLDING_MOMENT") {
            this.visualState = 1;
            this.dialogue.advance(); 
        }
        else if (signal === "SHOW_BLINDFOLDED_STATE") {
            this.visualState = 2;
            this.dialogue.advance(); 
        }
        else if (signal === "TRAVEL") {
             // --- FIX: ACTUAL TRANSITION ---
             this.manager.switchScene('TRAVEL'); 
        }
    }
}