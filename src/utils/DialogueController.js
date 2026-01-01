export default class DialogueController {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.queue = [];
        this.current = null;
        this.waitingForOption = false;
        this.baseY = height * 0.55; 
        
        // Font Configuration
        this.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        this.fontSize = 18;
        this.fontStr = `${this.fontSize}px ${this.fontFamily}`;
        this.nameFontStr = `bold 13px ${this.fontFamily}`;
    }

    loadDialogue(data) {
        this.queue = JSON.parse(JSON.stringify(data));
        this.advance();
    }

    advance() {
        if (this.waitingForOption) return null;

        if (this.queue.length > 0) {
            this.current = this.queue.shift();
            if (this.current.action) return this.current.action;
            if (this.current.options) this.waitingForOption = true;
            return "NEXT";
        } else {
            this.current = null;
            return "END";
        }
    }

    handleOptionClick(y) {
        if (!this.waitingForOption || !this.current || !this.current.options) return;

        const optionHeight = 55;
        const gap = 15;
        const totalHeight = (this.current.options.length * optionHeight) + ((this.current.options.length - 1) * gap);
        const startY = (this.height - totalHeight) / 2;

        this.current.options.forEach((opt, index) => {
            const optTop = startY + (index * (optionHeight + gap));
            if (y >= optTop && y <= optTop + optionHeight) {
                this.selectOption(opt);
            }
        });
    }

    selectOption(option) {
        this.waitingForOption = false;
        if (option.response && Array.isArray(option.response)) {
            [...option.response].reverse().forEach(line => this.queue.unshift(line));
        } else if (option.reply) {
            this.queue.unshift({ speaker: "you", text: option.reply });
        }
        this.advance();
    }

    draw() {
        if (!this.current) return;
        const ctx = this.ctx;

        if (this.waitingForOption) {
            this.drawOptions(ctx);
            return;
        }

        // --- DRAW BUBBLE ---
        const speaker = this.current.speaker;
        const margin = 20; 
        
        // 1. Calculate Max Width (75% of screen to be safe)
        const maxTextWidth = this.width * 0.75; 

        // 2. Wrap Text (Using precise font measurement)
        const wrappedData = this.wrapTextLines(this.current.text, maxTextWidth);
        const textLines = wrappedData.lines;
        const textBlockWidth = wrappedData.maxWidth;

        // 3. Height Calculation
        const lineHeight = 26;
        const headerHeight = speaker === "system" ? 0 : 25; 
        const textBlockHeight = textLines.length * lineHeight;
        const h = textBlockHeight + headerHeight + 40; 

        // 4. Width Calculation
        // Add 80px padding (40px Left + 40px Right)
        let nameWidth = 0;
        if (speaker !== "system") {
            ctx.font = this.nameFontStr;
            const name = speaker === "you" ? "SRI" : (speaker === "her" ? "ROSH" : "");
            nameWidth = ctx.measureText(name).width;
        }
        const w = Math.max(textBlockWidth, nameWidth) + 80; 

        // 5. Positioning (With Safety Clamp)
        let x, y;
        if (speaker === "her") { 
            x = margin; 
            y = this.baseY - h; 
        } else if (speaker === "you") { 
            x = this.width - w - margin;
            // FIX: Prevent bubble from going off-screen left
            if (x < margin) x = margin;
            y = this.baseY - h; 
        } else { 
            x = (this.width - w) / 2; 
            y = this.baseY - h; 
        }

        // 6. Draw Bubble
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        this.drawGlassRect(ctx, x, y, w, h, 18);
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

        // 7. Draw Tail
        ctx.fillStyle = "rgba(20, 20, 20, 0.6)"; 
        ctx.beginPath();
        if (speaker === "her") { ctx.moveTo(x + 20, y + h - 2); ctx.lineTo(x + 10, y + h + 15); ctx.lineTo(x + 40, y + h - 2); } 
        else if (speaker === "you") { ctx.moveTo(x + w - 40, y + h - 2); ctx.lineTo(x + w - 10, y + h + 15); ctx.lineTo(x + w - 20, y + h - 2); }
        ctx.fill();

        // 8. Draw Name
        if (speaker !== "system") {
            ctx.font = this.nameFontStr;
            ctx.fillStyle = "#FFD700"; 
            ctx.textAlign = "left"; // FORCE LEFT ALIGN
            ctx.textBaseline = "top";
            const name = speaker === "you" ? "SRI" : (speaker === "her" ? "ROSH" : "");
            ctx.fillText(name.toUpperCase(), x + 40, y + 15);
        }

        // 9. Draw Text
        ctx.font = this.fontStr;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "left"; // FORCE LEFT ALIGN
        ctx.textBaseline = "top";
        let textStartY = y + 15 + headerHeight; 
        
        textLines.forEach((line, i) => { 
            ctx.fillText(line, x + 40, textStartY + (i * lineHeight)); 
        });
    }

    drawOptions(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, this.width, this.height);
        const optionHeight = 55; const gap = 15;
        const btnWidth = Math.min(this.width * 0.85, 320); 
        const btnX = (this.width - btnWidth) / 2;
        const totalMenuHeight = 40 + (this.current.options.length * (optionHeight + gap));
        const startY = (this.height - totalMenuHeight) / 2;
        ctx.font = `bold 20px ${this.fontFamily}`;
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(this.current.text, this.width / 2, startY);
        const buttonStartY = startY + 45;
        this.current.options.forEach((opt, index) => {
            const optY = buttonStartY + (index * (optionHeight + gap));
            this.drawGlassRect(ctx, btnX, optY, btnWidth, optionHeight, 25);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = `16px ${this.fontFamily}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const btnText = opt.text || opt.choice; 
            ctx.fillText(btnText, this.width / 2, optY + (optionHeight / 2));
        });
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }

    drawGlassRect(ctx, x, y, w, h, r) {
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, "rgba(50, 50, 50, 0.6)");   
        grad.addColorStop(0.5, "rgba(20, 20, 20, 0.65)"); 
        grad.addColorStop(1, "rgba(5, 5, 5, 0.7)");   
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();
    }
    
    wrapTextLines(text, maxWidth) {
        if (!text) return { lines: [], maxWidth: 0 };
        this.ctx.font = this.fontStr; 
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
        let maxLineW = 0;
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = this.ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                maxLineW = Math.max(maxLineW, this.ctx.measureText(currentLine).width);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        maxLineW = Math.max(maxLineW, this.ctx.measureText(currentLine).width);
        return { lines: lines, maxWidth: maxLineW };
    }
}