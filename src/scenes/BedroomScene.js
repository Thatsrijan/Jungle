import bedroomData from '../dialogues/bedroom.js';
import DialogueController from '../utils/DialogueController.js';

export default class BedroomScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(bedroomData);
        
        // 0=Wakeup, 1=Notification, 2=Phone View, 3=Write Message
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

        // HTML Elements
        this.inputContainer = null;
        this.messageInput = null;

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

        // 4. Phone Overlay (States 2 & 3)
        if (this.sceneState === 2 || this.sceneState === 3) {
            this.drawPhoneOverlay(ctx, width, height);
        }

        // 5. Dialogue (Hide when typing)
        if (this.sceneState !== 3) {
            this.dialogue.draw();
        }
    }

    drawCharacter(ctx, width, height, assets) {
        let key = 'her_wakeup_confused';
        if (this.dialogue.current && this.dialogue.current.expression) key = this.dialogue.current.expression;
        
        // Force indoor clothes
        if (key === 'her_front' || key === 'her_soft_smile' || key === 'her_trust') key = 'her_wakeup_confused'; 
        
        if (this.sceneState === 1) key = 'her_phone_surprise';
        if (this.sceneState >= 2) key = 'her_phone_smile';    

        const img = assets.getImage(key) || assets.getImage('her_wakeup_confused');
        if (img) {
            const s = (height * 0.5) / img.height;
            const w = img.width * s;
            // Move left if phone/input is open
            let drawX = (this.sceneState >= 2) ? width * 0.05 : (width - w) / 2;
            ctx.drawImage(img, drawX, height - (height*0.5), w, height*0.5);
        }
    }

    drawPhoneOverlay(ctx, w, h) {
        const phoneW = Math.min(260, w * 0.5); 
        const phoneH = phoneW * 1.8; 
        const x = w - phoneW - 20; 
        const y = (h - phoneH) / 2;

        ctx.fillStyle = "#111"; ctx.beginPath(); ctx.roundRect(x, y, phoneW, phoneH, 20); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(x + 10, y + 40, phoneW - 20, phoneH - 60, 5); ctx.fill();

        const contentX = x + 20;
        const photoY = y + 60;
        const photoMaxH = phoneH * 0.45;
        
        if (this.finalPhoto && this.finalPhoto.complete) {
            ctx.drawImage(this.finalPhoto, contentX, photoY, phoneW - 40, photoMaxH);
        }

        const textStartY = photoY + photoMaxH + 20;
        ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.font = "bold 14px Arial";
        ctx.fillText("Sri", contentX, textStartY);
        
        ctx.font = "12px Arial"; ctx.fillStyle = "#555";
        ctx.fillText("See? I told you", contentX, textStartY + 20);
        ctx.fillText("memories stay.", contentX, textStartY + 35);
    }

    createInputUI() {
        if (this.inputContainer) return; 

        // Container (Fixed Position to ensure visibility)
        const div = document.createElement('div');
        div.style.position = 'fixed'; // Changed from absolute
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.width = '300px';
        div.style.padding = '20px';
        div.style.background = 'white';
        div.style.borderRadius = '15px';
        div.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '15px';
        div.style.zIndex = '10000'; // Very high Z-index

        // Label
        const label = document.createElement('div');
        label.innerText = "Attach a note to this memory:"; // Neutral text
        label.style.fontFamily = 'Arial, sans-serif';
        label.style.fontWeight = 'bold';
        label.style.color = '#333';
        div.appendChild(label);

        // Text Area
        const ta = document.createElement('textarea');
        ta.placeholder = "Write your thoughts about this moment... (Optional)";
        ta.style.width = '100%';
        ta.style.height = '100px';
        ta.style.padding = '10px';
        ta.style.border = '1px solid #ccc';
        ta.style.borderRadius = '8px';
        ta.style.fontFamily = 'Arial';
        ta.style.resize = 'none';
        div.appendChild(ta);
        this.messageInput = ta;

        // Send Button
        const btn = document.createElement('button');
        btn.innerText = "Send & Finish";
        btn.style.background = '#007AFF'; // Blue nice button
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        
        btn.onclick = () => this.handleSendClick();
        div.appendChild(btn);

        document.body.appendChild(div);
        this.inputContainer = div;
    }

    removeInputUI() {
        if (this.inputContainer) {
            document.body.removeChild(this.inputContainer);
            this.inputContainer = null;
        }
    }

    async handleSendClick() {
        const message = this.messageInput.value;
        const btn = this.inputContainer.querySelector('button');
        btn.innerText = "Sending...";
        btn.disabled = true;

        try {
            await fetch('/.netlify/functions/send_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    images: this.savedPhotos,
                    userMessage: message // Sending the note
                })
            });
            console.log("Sent!");
        } catch (err) {
            console.warn("Send Error:", err);
        }

        this.removeInputUI();
        this.manager.switchScene('END_CREDITS');
    }

    handleClick(x, y) {
        // If the input UI is open, ignore clicks on canvas
        if (this.sceneState === 3) return;

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
            this.sceneState = 3; 
            this.createInputUI(); // Triggers the popup
        }
    }
}
