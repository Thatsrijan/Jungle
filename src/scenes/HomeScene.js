import homeData from '../dialogues/home.js';
import DialogueController from '../utils/DialogueController.js';

export default class HomeScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(homeData);
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
        } else {
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Characters (Professional "Half-Body" Size)
        // We set them to ~45% of screen height and anchor to bottom
        
        // HER (Left)
        const herImg = assets.getImage('her_front');
        if (herImg) {
            const scale = (height * 0.45) / herImg.height; 
            const w = herImg.width * scale;
            const h = herImg.height * scale;
            
            // Anchor Bottom-Left (with slight padding from edge)
            ctx.drawImage(herImg, -20, height - h, w, h); 
        }

        // YOU (Right)
        const youImg = assets.getImage('you_front');
        if (youImg) {
            const scale = (height * 0.45) / youImg.height; 
            const w = youImg.width * scale;
            const h = youImg.height * scale;
            
            // Anchor Bottom-Right
            ctx.drawImage(youImg, width - w + 20, height - h, w, h);
        }

        // 3. Dialogue Layer
        this.dialogue.draw();
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }
        const signal = this.dialogue.advance();
        if (signal === "BLINDFOLD") {
            this.manager.switchScene('BLINDFOLD');
        }
    }
}