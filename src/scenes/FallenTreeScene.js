import treeData from '../dialogues/fallen_tree.js';
import DialogueController from '../utils/DialogueController.js';

export default class FallenTreeScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(treeData);
        
        // 0=Dialogue, 1=Button Active, 2=Showing CG, 3=Final Dialogue
        this.questState = 0; 
        this.pulse = 0; 
        
        if(this.manager.sound) this.manager.sound.playBGM('bgm_jungle');
    }

    update(dt) {
        if (this.questState === 1) {
            this.pulse += dt * 0.005;
        }
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Draw Background (FIXED: Standard Aspect Fill)
        const bg = assets.getImage('tree_fell');
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. VISUAL CONTENT BASED ON STATE
        if (this.questState === 2) {
            // --- STATE 2: SHOW THE CG IMAGE ---
            const cg = assets.getImage('helping_over');
            if (cg) {
                // Draw CG centered, covering sprites
                const imgRatio = cg.width / cg.height;
                const canvasRatio = width / height;
                let rw, rh, ox, oy;
                 if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
                 else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
                ctx.drawImage(cg, ox, oy, rw, rh);
            }
        } else {
            // --- STATES 0, 1, 3: SHOW STANDARD SPRITES ---
            this.drawSprites(ctx, width, height, assets);
        }

        // 3. QUEST UI (Only in State 1)
        if (this.questState === 1) {
            this.drawQuestButton(ctx, width, height);
        }

        // 4. Dialogue (Hide during button interaction)
        if (this.questState !== 1) {
            this.dialogue.draw();
        }
    }

    drawSprites(ctx, width, height, assets) {
        let herKey = 'her_front';
        let youKey = 'you_front';

        // Use current dialogue expression if available
        if (this.dialogue.current && this.dialogue.current.expression && this.questState !== 3) {
            if (this.dialogue.current.speaker === 'her') herKey = this.dialogue.current.expression;
            if (this.dialogue.current.speaker === 'you') youKey = this.dialogue.current.expression;
        } 
        // If in final state (3), force specific "after crossing" looks
        else if (this.questState === 3) {
             herKey = 'her_soft_smile'; 
             youKey = 'you_smile';
        }

        const her = assets.getImage(herKey) || assets.getImage('her_front');
        const you = assets.getImage(youKey) || assets.getImage('you_front');
        
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

    drawQuestButton(ctx, w, h) {
        const btnX = w / 2;
        const btnY = h / 2;
        const baseR = 55;
        const scale = 1 + (Math.sin(this.pulse) * 0.1); 

        // Glow
        ctx.save();
        ctx.shadowColor = "#FFD700"; // Gold glow
        ctx.shadowBlur = 25;
        
        // Button Circle
        ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
        ctx.beginPath();
        ctx.arc(btnX, btnY, baseR * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HELP HER", btnX, btnY - 5);
        ctx.font = "14px Arial";
        ctx.fillText("(Tap)", btnX, btnY + 15);
    }

    handleClick(x, y) {
        // -- QUEST INTERACTION (State 1) --
        if (this.questState === 1) {
            const dx = x - (this.manager.width / 2);
            const dy = y - (this.manager.height / 2);
            if (Math.sqrt(dx*dx + dy*dy) < 80) {
                // SUCCESS: Switch to CG state
                this.questState = 2; 
                if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');
                this.dialogue.advance(); // Advance to "Whoa!" line showing over CG
            }
            return;
        }

        // -- NORMAL DIALOGUE ADVANCE --
        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        // Logic to transition out of CG state back to sprites
        // When the girl says "Thanks", we hide the CG
        if (this.questState === 2 && this.dialogue.current && this.dialogue.current.text.includes("Thanks")) {
             this.questState = 3; 
        }

        if (signal === "START_QUEST") {
            this.questState = 1; // Show button
        }
        else if (signal === "END_SCENE") {
            console.log("Quest Complete -> Next Phase");
            this.manager.switchScene('ANIMAL'); 
        }
    }
}