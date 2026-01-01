export default class CameraUI {
    constructor(onComplete) {
      this.onComplete = onComplete;
      this.photos = [];
      this.maxPhotos = 3;
  
      this.container = document.createElement("div");
      this.container.id = "camera-ui";
  
      this.video = document.createElement("video");
      this.video.setAttribute("autoplay", "");
      this.video.setAttribute("playsinline", "");
      this.video.muted = true;
  
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
  
      this.shutter = document.createElement("button");
      this.shutter.className = "camera-shutter";
  
      this.thumb = document.createElement("img");
      this.thumb.className = "camera-thumb";
  
      this.container.append(
        this.video,
        this.thumb,
        this.shutter
      );
  
      document.body.appendChild(this.container);
  
      this.startCamera();
      this.bind();
    }
  
    async startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
  
      this.video.srcObject = stream;
  
      this.video.onloadedmetadata = () => {
        this.video.play();
      };
    }
  
    bind() {
      this.shutter.onclick = () => this.capture();
    }
  
    capture() {
      const vw = this.video.videoWidth;
      const vh = this.video.videoHeight;
  
      this.canvas.width = vw;
      this.canvas.height = vh;
  
      // Mirror draw
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(this.video, -vw, 0, vw, vh);
      this.ctx.restore();
  
      const data = this.canvas.toDataURL("image/png");
      this.photos.push(data);
  
      this.thumb.src = data;
  
      if (this.photos.length >= this.maxPhotos) {
        this.finish();
      }
    }
  
    finish() {
      this.video.srcObject.getTracks().forEach(t => t.stop());
  
      this.container.classList.add("fade-out");
  
      setTimeout(() => {
        this.container.remove();
        this.onComplete(this.photos);
      }, 800);
    }
  }
  