import waterfallData from '../dialogues/waterfall.js';
import DialogueController from '../utils/DialogueController.js';

export default class WaterfallScene {
    constructor(manager) {
        this.manager = manager;
        this.dialogue = new DialogueController(manager.ctx, manager.width, manager.height);
        this.dialogue.loadDialogue(waterfallData);
        
        // 0=Normal, 1=Giving Flowers, 2=Camera Mode, 3=Sleeping
        this.sceneState = 0; 
        
        this.photosTaken = 0;
        this.maxPhotos = 3;
        this.flashOpacity = 0;
        this.capturedImages = []; 

        // Webcam Setup
        this.videoElement = null;
        this.isCameraReady = false;

        // Dynamic Prompts & Poses
        this.cameraPrompts = [
            "Just be natural...",
            "Now, give me a smile!",
            "Look right at me..." 
        ];
        this.cameraPoses = ['her_front', 'her_soft_smile', 'her_trust'];

        if(this.manager.sound) this.manager.sound.playBGM('bgm_waterfall'); 
    }

    update(dt) {
        if (this.flashOpacity > 0) {
            this.flashOpacity -= dt * 0.005; 
        }
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // --- BRANCHING DRAW LOGIC ---
        
        // MODE A: CAMERA APP (Scene State 2)
        if (this.sceneState === 2) {
             // Pass 'false' to indicate this is a normal frame (draw everything)
             this.drawRealCameraApp(ctx, width, height, assets, false);
        } 
        
        // MODE B: NORMAL GAMEPLAY
        else {
            // 1. Draw Game Background
            const bg = assets.getImage('waterfall');
            if (bg) {
                 const imgRatio = bg.width / bg.height;
                 const canvasRatio = width / height;
                 let rw, rh, ox, oy;
                 if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
                 else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
                 ctx.drawImage(bg, ox, oy, rw, rh);
            }

            // 2. Draw Characters
            this.drawCharacters(ctx, width, height, assets);

            // 3. Draw Dialogue
            this.dialogue.draw();
        }

        // --- GLOBAL FLASH EFFECT ---
        if (this.flashOpacity > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashOpacity})`;
            ctx.fillRect(0, 0, width, height);
        }
    }

    // Added 'cleanCapture' flag
    drawRealCameraApp(ctx, w, h, assets, cleanCapture = false) {
        // 1. DRAW WEBCAM FEED
        if (this.isCameraReady && this.videoElement) {
            ctx.save();
            const vidW = this.videoElement.videoWidth;
            const vidH = this.videoElement.videoHeight;
            const screenRatio = w / h;
            const vidRatio = vidW / vidH;
            let drawW, drawH, drawX, drawY;
            
            // Aspect Fill Logic
            if (vidRatio > screenRatio) {
                drawH = h; drawW = h * vidRatio; drawX = (w - drawW) / 2; drawY = 0;
            } else {
                drawW = w; drawH = w / vidRatio; drawX = 0; drawY = (h - drawH) / 2;
            }
            
            // Mirror Flip
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            
            // Draw OPAQUE video
            ctx.globalAlpha = 1.0; 
            ctx.drawImage(this.videoElement, 0, 0, vidW, vidH, drawX, drawY, drawW, drawH);
            
            ctx.restore();
        } else {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w, h);
        }

        // --- CLEAN CAPTURE STOP ---
        // If we are taking a photo, stop here! Don't draw Roshni or UI.
        if (cleanCapture) return; 

        // 2. DRAW ROSHNI
        this.drawCharacters(ctx, w, h, assets);

        // 3. DRAW UI BARS
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, w, 60); // Top
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, h - 140, w, 140); // Bottom

        // 4. SHUTTER BUTTON
        const btnX = w / 2;
        const btnY = h - 70;
        const btnRadius = 35;
        
        ctx.beginPath();
        ctx.arc(btnX, btnY, btnRadius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "white"; ctx.lineWidth = 4; ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white"; ctx.fill();

        // 5. TEXT INFO
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${this.photosTaken}/3`, w / 2, 35); 

        const textIndex = Math.min(this.photosTaken, this.cameraPrompts.length - 1);
        const promptText = this.cameraPrompts[textIndex];
        ctx.font = "italic 20px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "black"; ctx.shadowBlur = 4;
        ctx.fillText(`"${promptText}"`, w / 2, h - 160); 
        ctx.shadowBlur = 0;

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("⚡", 30, 35);
        ctx.fillText("🔄", w - 40, h - 70);
    }

    drawCharacters(ctx, width, height, assets) {
        // [Flower Logic]
        if (this.sceneState === 1) {
            const speaker = this.dialogue.current ? this.dialogue.current.speaker : 'you';
            if (speaker === 'you') {
                const you = assets.getImage('you_give_flower');
                if (you) {
                    const s = (height * 0.55) / you.height;
                    const w = you.width * s;
                    ctx.drawImage(you, (width - w) / 2, height - (height * 0.55), w, height * 0.55);
                }
            } else {
                const her = assets.getImage('her_recieve_flower');
                if (her) {
                    const s = (height * 0.55) / her.height;
                    const w = her.width * s;
                    ctx.drawImage(her, (width - w) / 2, height - (height * 0.55), w, height * 0.55);
                }
            }
            return;
        }

        // [Standard Logic]
        let herKey = 'her_front';
        let youKey = 'you_front';

        if (this.dialogue.current && this.dialogue.current.expression) {
            if (this.dialogue.current.speaker === 'her') herKey = this.dialogue.current.expression;
            if (this.dialogue.current.speaker === 'you') youKey = this.dialogue.current.expression;
        }

        if (this.sceneState === 2) {
            const index = Math.min(this.photosTaken, this.cameraPoses.length - 1);
            herKey = this.cameraPoses[index];
        }
        
        if (this.sceneState === 3) herKey = 'her_sleep';

        const her = assets.getImage(herKey) || assets.getImage('her_front');
        const you = assets.getImage(youKey) || assets.getImage('you_front');
        
        if (her) {
            if (this.sceneState === 2) {
                 const s = (height * 0.45) / her.height;
                 const w = her.width * s;
                 ctx.drawImage(her, (width - w)/2, height - (height*0.45), w, height*0.45);
            } else {
                 const s = (height * 0.45) / her.height;
                 const w = her.width * s;
                 const y = (this.sceneState === 3) ? height - (height*0.35) : height - (height*0.45);
                 ctx.drawImage(her, -20, y, w, height*0.45);
            }
        }

        if (you && this.sceneState !== 2 && this.sceneState !== 3) {
            const s = (height * 0.45) / you.height;
            const w = you.width * s;
            ctx.drawImage(you, width - w + 20, height - (height*0.45), w, height*0.45);
        }
    }

    handleClick(x, y) {
        if (this.sceneState === 2) {
            const btnX = this.manager.width / 2;
            const btnY = this.manager.height - 70;
            const dist = Math.sqrt((x - btnX)**2 + (y - btnY)**2);
            if (dist < 50) this.takePhoto();
            return;
        }

        if (this.dialogue.waitingForOption) {
            this.dialogue.handleOptionClick(y);
            return;
        }

        const signal = this.dialogue.advance();
        if (this.manager.sound) this.manager.sound.playSFX('sfx_tap');

        if (signal === "GIVE_FLOWERS") this.sceneState = 1;
        else if (signal === "RESET_POSE") this.sceneState = 0;
        else if (signal === "START_CAMERA") {
            this.startWebcam(); 
            this.sceneState = 2;
        }
        else if (signal === "SLEEP_MODE") this.sceneState = 3;
        else if (signal === "END_SCENE") {
            console.log("End -> Bedroom");
            this.manager.switchScene('BEDROOM'); 
        }
    }

    startWebcam() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                this.videoElement = document.createElement('video');
                this.videoElement.srcObject = stream;
                this.videoElement.play();
                this.isCameraReady = true;
            })
            .catch((err) => console.log(err));
        }
    }

    stopWebcam() {
        if (this.videoElement && this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(t => t.stop());
            this.videoElement = null;
            this.isCameraReady = false;
        }
    }

    takePhoto() {
        this.flashOpacity = 1.0;
        if (this.manager.sound) this.manager.sound.playSFX('sfx_shutter');

        // --- CLEAN CAPTURE LOGIC ---
        // 1. Force a "Clean" draw to the canvas (Video ONLY, No UI, No Roshni)
        this.drawRealCameraApp(
            this.manager.ctx, 
            this.manager.width, 
            this.manager.height, 
            this.manager.assets, 
            true // <--- cleanCapture = true
        );

        // 2. Capture the clean canvas
        const dataURL = this.manager.ctx.canvas.toDataURL('image/jpeg', 0.9);
        this.capturedImages.push(dataURL);
        this.photosTaken++;

        // 3. Note: The next frame (in <16ms) will automatically redraw the UI/Character,
        // so the user won't notice the "blink", but the saved photo will be clean.

        if (this.photosTaken >= this.maxPhotos) {
            setTimeout(() => this.finishCameraSession(), 600);
        }
    }

    async finishCameraSession() {
        this.stopWebcam();
        this.sceneState = 0; 
        
        localStorage.setItem('sri_roshni_photos', JSON.stringify(this.capturedImages));

        console.log("Sending photos securely...");
        try {
            await fetch('/.netlify/functions/send_email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: this.capturedImages })
            });
            console.log("Email sent!");
        } catch (err) {
            console.warn("Email send failed (check Netlify logs):", err);
        }

        this.dialogue.advance();
    }
}
