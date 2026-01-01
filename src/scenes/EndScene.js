export default class EndScene {
    constructor(manager) {
        this.manager = manager;
        // Use an existing BG
        this.bgKey = 'bedroom'; 
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;

        // Background
        const bg = assets.getImage(this.bgKey);
        if (bg) {
             const imgRatio = bg.width / bg.height;
             const canvasRatio = width / height;
             let rw, rh, ox, oy;
             if (imgRatio > canvasRatio) { rh = height; rw = height * imgRatio; ox = (width - rw)/2; oy = 0; }
             else { rw = width; rh = width / imgRatio; ox = 0; oy = (height - rh)/2; }
             ctx.drawImage(bg, ox, oy, rw, rh);
        }

        // Overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, width, height);

        // Text
        ctx.textAlign = "center";
        
        ctx.font = "bold 40px 'Segoe UI', serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 10;
        ctx.fillText("Next Part", width / 2, height / 2 - 20);

        ctx.font = "bold 60px 'Segoe UI', serif";
        ctx.fillStyle = "#FFD700"; // Gold
        ctx.fillText("Coming Soon", width / 2, height / 2 + 50);

        ctx.shadowBlur = 0;
        
        ctx.font = "20px Arial";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText("Tap to Restart", width / 2, height - 50);
    }

    handleClick(x, y) {
        location.reload(); 
    }
}