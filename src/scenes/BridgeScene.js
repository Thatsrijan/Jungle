import bridgeData from '../dialogues/bridge.js';
import DialogueController from '../utils/DialogueController.js';

export default class BridgeScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(bridgeData);
        
        // 0=Dialogue, 1=Quest Active, 2=CG/Success, 3=Final Dialogue
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

        // 1. Background
        const bg = assets.getImage('bridge'); 
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Visuals (Sprites or CG)
        if (this.questState === 2) {
            // Optional CG if you have it
            const cg = assets.getImage('bridge_cross');
            if (cg) {
                 const imgRatio = cg.width / cg.height;
                 const canvasRatio = width / height;
                 let rw, rh, ox, oy;
                 if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
                 else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
                 ctx.drawImage(cg, ox, oy, rw, rh);
            } else {
                // Fallback to sprites if no CG
                this.drawSprites(ctx, width, height, assets);
            }
        } else {
            this.drawSprites(ctx, width, height, assets);
        }

        // 3. UI
        if (this.questState === 1) {
            this.drawQuestButton(ctx, width, height);
        } else {
            this.dialogue.draw();
        }
    }

    drawSprites(ctx, width, height, assets) {
        let herKey = 'her_front';
        let youKey = 'you_front';

        if (this.dialogue.current && this.dialogue.current.expression) {
            if (this.dialogue.current.speaker === 'her') herKey = this.dialogue.current.expression;
            if (this.dialogue.current.speaker === 'you') youKey = this.dialogue.current.expression;
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
        const btnX = w / 2; const btnY = h / 2; const baseR = 55;
        const scale = 1 + (Math.sin(this.pulse) * 0.1); 

        ctx.save(); ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 25;
        ctx.fillStyle = "rgba(255, 215, 0, 0.9)"; ctx.beginPath();
        ctx.arc(btnX, btnY, baseR * scale, 0, Math.PI * 2); ctx.fill(); ctx.restore();

        ctx.fillStyle = "#fff"; ctx.font = "bold 18px Arial"; 
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("STEADY", btnX, btnY - 5); // Changed text
        ctx.font = "14px Arial"; ctx.fillText("(Tap)", btnX, btnY + 15);
    }

    handleClick(x, y) {
        if (this.questState === 1) {
            const dx = x - (this.manager.width / 2);
            const dy = y - (this.manager.height / 2);
            if (Math.sqrt(dx*dx + dy*dy) < 80) {
                this.questState = 2; // Success
                if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');
                this.dialogue.advance(); 
            }
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        // Logic to transition back to sprites if CG was used
        if (this.questState === 2 && this.dialogue.current.text.includes("made it")) {
             this.questState = 3; 
        }

        if (signal === "START_QUEST") {
            this.questState = 1;
        }
        else if (signal === "END_SCENE") {
            console.log("Bridge Crossed -> Scary Jungle");
            this.manager.switchScene('SCARY'); // <--- Update this
        }
    }
}