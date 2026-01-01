export default class AssetLoader {
    constructor() {
        this.cache = {};
    }

    async loadImages(sources) {
        const promises = Object.keys(sources).map(key => this.loadImage(key, sources[key]));
        return Promise.all(promises);
    }

    loadImage(key, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.cache[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Missing: ${src}. Generating placeholder.`);
                this.cache[key] = this.createPlaceholder(key);
                resolve(this.cache[key]);
            };
            img.src = src;
        });
    }

    getImage(key) {
        return this.cache[key];
    }

    // Creates a colored box with text so you can test logic without assets
    createPlaceholder(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Random pastel color
        const hue = Math.floor(Math.random() * 360);
        ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
        ctx.fillRect(0, 0, 400, 600);
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 200, 300);
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
}