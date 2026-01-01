export default class CarScene {
    constructor(manager) {
        this.manager = manager;
        this.timer = 0;
        this.duration = 4000;
        this.instructionDismissed = false;
        
        // Try to play city ambience if available
        if(this.manager.sound) this.manager.sound.playBGM('bgm_city');
    }

    update(dt) {
        // Only count down timer if instructions are dismissed
        if (this.instructionDismissed) {
            this.timer += dt;
            if (this.timer > this.duration) {
                this.manager.switchScene('HOME');
            }
        }
    }

    draw(ctx) {
        const { width, height, assets } = this.manager;
        
        // 1. Background
        const bg = assets.getImage('city');
        if (bg) {
            // Aspect Fill
            const imgRatio = bg.width / bg.height;
            const canvasRatio = width / height;
            let rw, rh, ox, oy;
            if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
            else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
            ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // 2. Car
        const car = assets.getImage('car');
        if (car) {
            const cWidth = width * 0.9;
            const cHeight = cWidth * (car.height / car.width);
            ctx.drawImage(car, (width - cWidth) / 2, height * 0.65, cWidth, cHeight);
        }

        // 3. INSTRUCTION BUBBLE (If not dismissed)
        if (!this.instructionDismissed) {
            this.drawInstruction(ctx, width, height);
        }
    }

    drawInstruction(ctx, w, h) {
        // Dim background
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, w, h);

        // Bubble
        const bw = w * 0.8;
        const bh = 120;
        const bx = (w - bw) / 2;
        const by = (h - bh) / 2;

        // Draw Glassy Black Rect
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 20);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 20px Arial";
        ctx.fillText("HOW TO PLAY", w/2, by + 40);
        
        ctx.font = "16px Arial";
        ctx.fillStyle = "#ccc";
        ctx.fillText("Tap the screen to", w/2, by + 75);
        ctx.fillText("advance the story.", w/2, by + 95);
        
        ctx.textAlign = "left"; // Reset
    }

    handleClick(x, y) {
        if (!this.instructionDismissed) {
            this.instructionDismissed = true;
            // Start Audio on first interaction
            if(this.manager.sound) this.manager.sound.playSFX('sfx_tap');
        } else {
            // Optional: Skip cinematic
            this.manager.switchScene('HOME');
        }
    }
}