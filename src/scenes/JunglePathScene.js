export default class JunglePathScene {
    constructor(manager) {
        this.manager = manager;
        this.isWalking = false;
        
        // Progress: 0 (Start) -> 1 (Finished)
        this.progress = 0; 
        this.speed = 0.3; 
        
        // --- 1. DISTANCE & DEPTH ---
        // Start: Bottom (0.85)
        this.startY = manager.height * 0.85; 
        this.startScale = 1.0;

        // End: Much higher/deeper (0.25)
        this.targetY = manager.height * 0.25; 
        this.targetScale = 0.3; // Get very small

        // --- 2. CENTERING ---
        // Converge exactly at center (0.5)
        this.targetX = manager.width * 0.5;
        // Start closer to center so they fit on the path
        this.startX_You = manager.width * 0.35; 
        this.startX_Her = manager.width * 0.65;

        if(this.manager.sound) this.manager.sound.playBGM('bgm_jungle');
    }

    update(dt) {
        if (this.isWalking) {
            this.progress += (dt / 1000) * this.speed;
            
            if (this.progress >= 1) {
                this.progress = 1;
                console.log("Walk Complete");
                // this.manager.switchScene('FALLEN_TREE'); 
                this.manager.switchScene('JUNGLE_MAIN');
            }
        }
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // 1. Background
        const bg = assets.getImage('jungle_path');
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Movement Calculations
        const curScale = this.lerp(this.startScale, this.targetScale, this.progress);
        const curY = this.lerp(this.startY, this.targetY, this.progress);
        
        // Tighter walking width as they get further
        const spread = 20 * curScale; 
        const curX_You = this.lerp(this.startX_You, this.targetX - spread, this.progress);
        const curX_Her = this.lerp(this.startX_Her, this.targetX + spread, this.progress);

        // --- 3. FADE EFFECT (Atmosphere + Character) ---
        
        // A. Character Opacity (They fade out as they get far)
        // Starts fading at 50% progress, fully gone at 100%
        let charAlpha = 1.0;
        if (this.progress > 0.5) {
            charAlpha = 1.0 - ((this.progress - 0.5) * 2);
            charAlpha = Math.max(0, charAlpha);
        }

        ctx.save();
        ctx.globalAlpha = charAlpha;

        // Draw YOU
        const youWalk = assets.getImage('you_walk_back'); 
        if (youWalk) {
            const w = (youWalk.width * 0.45) * curScale; 
            const h = (youWalk.height * 0.45) * curScale;
            // Center the sprite anchor
            ctx.drawImage(youWalk, curX_You - (w/2), curY, w, h);
        }

        // Draw HER
        const herWalk = assets.getImage('her_walk_back');
        if (herWalk) {
            const w = (herWalk.width * 0.45) * curScale; 
            const h = (herWalk.height * 0.45) * curScale;
            // Center the sprite anchor
            ctx.drawImage(herWalk, curX_Her - (w/2), curY, w, h);
        }

        ctx.restore(); 

        // B. Scene Darkening (Vignette Fade)
        // As they go deep, the screen gets darker to transition to next scene
        if (this.progress > 0.3) {
            const darkness = (this.progress - 0.3) * 1.2; // Ramps up to ~0.8 opacity
            ctx.fillStyle = `rgba(0, 10, 5, ${Math.min(0.9, darkness)})`;
            ctx.fillRect(0, 0, width, height);
        }

        // 4. UI: Hold Button
        if (this.progress < 1) {
            this.drawHoldButton(ctx, width, height);
        }
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    drawHoldButton(ctx, w, h) {
        const btnY = h - 130;
        const btnR = 45;
        
        ctx.fillStyle = this.isWalking ? "rgba(255, 215, 0, 0.9)" : "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(w/2, btnY, btnR, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.isWalking) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(w/2, btnY, btnR + 8, -Math.PI/2, (-Math.PI/2) + (this.progress * Math.PI * 2));
            ctx.stroke();
        }

        ctx.fillStyle = "#000";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HOLD", w/2, btnY);
        
        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.fillText("to walk", w/2, btnY + 70);
    }

    handleInputStart() { this.isWalking = true; }
    handleInputEnd() { this.isWalking = false; }
    handleClick(x, y) {} 
}