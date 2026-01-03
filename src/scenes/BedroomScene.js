import bedroomData from '../dialogues/bedroom.js';
import DialogueController from '../utils/DialogueController.js';

export default class BedroomScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(bedroomData);
        
        // 0=Wakeup, 1=Notification, 2=Phone View
        this.sceneState = 0; 
        
        this.notifY = -150; 
        this.showNotif = false;
        this.savedPhotos = [];

        try {
            const stored = localStorage.getItem('sri_roshni_photos');
            if (stored) this.savedPhotos = JSON.parse(stored);
        } catch (e) { console.error(e); }

        this.finalPhoto = null;
        if (this.savedPhotos.length > 0) {
            const img = new Image();
            img.src = this.savedPhotos[this.savedPhotos.length - 1]; 
            this.finalPhoto = img;
        }

        if(this.manager.sound) this.manager.sound.playBGM('bgm_piano_soft'); 
    }

    update(dt) {
        if (this.showNotif) {
            if (this.notifY < 20) this.notifY += dt * 0.4; 
        }
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background
        const bg = assets.getImage('bedroom'); 
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Character
        this.drawCharacter(ctx, width, height, assets);

        // 3. Notification
        if (this.showNotif) {
            const card = assets.getImage('notification_card');
            if (card) {
                const maxW = Math.min(350, width * 0.8);
                const scale = maxW / card.width;
                const wCard = card.width * scale;
                const hCard = card.height * scale;
                ctx.drawImage(card, (width - wCard)/2, this.notifY, wCard, hCard);
            }
        }

        // 4. Phone Overlay
        if (this.sceneState === 2) {
            this.drawPhoneOverlay(ctx, width, height);
        }

        // 5. Dialogue
        this.dialogue.draw();
    }

    drawCharacter(ctx, width, height, assets) {
        let key = 'her_wakeup_confused';
        if (this.dialogue.current && this.dialogue.current.expression) key = this.dialogue.current.expression;
        
        // Force pajama/indoor sprites
        if (key === 'her_front' || key === 'her_soft_smile' || key === 'her_trust') key = 'her_wakeup_confused'; 
        
        // State overrides
        if (this.sceneState === 1) key = 'her_phone_surprise';
        if (this.sceneState === 2) key = 'her_phone_smile';    

        const img = assets.getImage(key) || assets.getImage('her_wakeup_confused');
        if (img) {
            const s = (height * 0.5) / img.height;
            const w = img.width * s;
            // Move left if phone open
            let drawX = (this.sceneState === 2) ? width * 0.05 : (width - w) / 2;
            ctx.drawImage(img, drawX, height - (height*0.5), w, height*0.5);
        }
    }

    drawPhoneOverlay(ctx, w, h) {
        const phoneW = Math.min(260, w * 0.5); 
        const phoneH = phoneW * 1.8; 
        const x = w - phoneW - 20; 
        const y = (h - phoneH) / 2;

        // Body
        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.roundRect(x, y, phoneW, phoneH, 20); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(x + 10, y + 40, phoneW - 20, phoneH - 60, 5); ctx.fill();

        // Content
        const contentX = x + 20;
        const photoY = y + 60;
        const photoMaxH = phoneH * 0.45;
        
        if (this.finalPhoto && this.finalPhoto.complete) {
            ctx.drawImage(this.finalPhoto, contentX, photoY, phoneW - 40, photoMaxH);
        }

        // Text Message from Roshni
        const textStartY = photoY + photoMaxH + 20;
        ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.font = "bold 14px Arial";
        ctx.fillText("Sri", contentX, textStartY);
        
        ctx.font = "12px Arial"; ctx.fillStyle = "#555";
        ctx.fillText("See? I told you", contentX, textStartY + 20);
        ctx.fillText("memories stay.", contentX, textStartY + 35);
    }

    handleClick(x, y) {
        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        if (signal === "SHOW_NOTIFICATION") {
            this.showNotif = true;
            if (this.manager.sound) this.manager.sound.playSFX('sfx_notification');
        }
        else if (signal === "SHOW_PHONE_SCREEN") {
            this.showNotif = false; 
            this.sceneState = 2; 
        }
        else if (signal === "END_GAME") {
            // 1. Send Email in Background
            this.sendEmailInBackground();
            // 2. Go to Credits
            this.manager.switchScene('END_CREDITS');
        }
    }

    async sendEmailInBackground() {
        if (this.savedPhotos.length === 0) return;
        
        console.log("Sending memories to Sri...");
        try {
            // Fire and forget - don't await, just let it run
            fetch('/.netlify/functions/send_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: this.savedPhotos })
            });
        } catch (err) {
            console.warn("Background email error:", err);
        }
    }
}
