export default class TitleScene {
    constructor(manager) {
        this.manager = manager;
        this.btnBounds = { x: 0, y: 0, w: 0, h: 0 };
    }

    update(dt) {}

    draw(ctx) {
        const { width, height, assets } = this.manager;
        
        // 1. Background (Aspect Fill / Cover Mode)
        const bg = assets.getImage('intro_bg');
        if (bg) {
            const imgRatio = bg.width / bg.height;
            const canvasRatio = width / height;
            
            let renderW, renderH, offsetX, offsetY;

            // If image is wider than screen (Landscape image on Portrait phone)
            if (imgRatio > canvasRatio) {
                renderH = height;
                renderW = height * imgRatio;
                offsetX = (width - renderW) / 2; // Center it horizontally
                offsetY = 0;
            } 
            // If image is taller than screen
            else {
                renderW = width;
                renderH = width / imgRatio;
                offsetX = 0;
                offsetY = (height - renderH) / 2; // Center it vertically
            }

            ctx.drawImage(bg, offsetX, offsetY, renderW, renderH);
        }

        // 2. Title Text
        const title = assets.getImage('intro_text');
        if (title) {
            const tWidth = width * 0.8;
            const tHeight = tWidth * (title.height / title.width);
            ctx.drawImage(title, (width - tWidth) / 2, height * 0.2, tWidth, tHeight);
        }

        // 3. Play Button
        const play = assets.getImage('play');
        if (play) {
            const pWidth = width * 0.35;
            const pHeight = pWidth * (play.height / play.width);
            const pX = (width - pWidth) / 2;
            const pY = height * 0.7;

            ctx.drawImage(play, pX, pY, pWidth, pHeight);
            this.btnBounds = { x: pX, y: pY, w: pWidth, h: pHeight };
        }
    }

    handleClick(x, y) {
        const b = this.btnBounds;
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
            this.manager.switchScene('CAR');
        }
    }
}