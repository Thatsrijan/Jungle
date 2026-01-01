import TitleScene from '../scenes/TitleScene.js';
import CarScene from '../scenes/CarScene.js';
import HomeScene from '../scenes/HomeScene.js';
import BlindfoldScene from '../scenes/BlindfoldScene.js';
import TravelScene from '../scenes/TravelScene.js';
import JungleArrivalScene from '../scenes/JungleArrivalScene.js';
import JunglePathScene from '../scenes/JunglePathScene.js';
import JungleMainScene from '../scenes/JungleMainScene.js';
import FallenTreeScene from '../scenes/FallenTreeScene.js';
import AnimalScene from '../scenes/AnimalScene.js';
import BridgeScene from '../scenes/BridgeScene.js';
import ScaryJungleScene from '../scenes/ScaryJungleScene.js'; // <--- ADD THIS LINE
import WaterfallScene from '../scenes/WaterfallScene.js';
import BedroomScene from '../scenes/BedroomScene.js';
import EndScene from '../scenes/EndScene.js';

export default class SceneManager {
    constructor(ctx, width, height, assets, soundManager) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.assets = assets;
        this.sound = soundManager;
        this.currentScene = null;
    }

    switchScene(key) {
        this.loadScene(key);
    }

    loadScene(key) {
        // Clear previous inputs if any
        if (this.currentScene && this.currentScene.handleInputEnd) {
            this.currentScene.handleInputEnd();
        }

        switch(key) {
            case 'TITLE': this.currentScene = new TitleScene(this); break;
            case 'CAR': this.currentScene = new CarScene(this); break;
            case 'HOME': this.currentScene = new HomeScene(this); break;
            case 'BLINDFOLD': this.currentScene = new BlindfoldScene(this); break;
            case 'TRAVEL': this.currentScene = new TravelScene(this); break;
            case 'JUNGLE_ARRIVAL': this.currentScene = new JungleArrivalScene(this); break;
            case 'JUNGLE_WALK': this.currentScene = new JunglePathScene(this); break;
            case 'JUNGLE_MAIN': this.currentScene = new JungleMainScene(this); break;
            case 'FALLEN_TREE': this.currentScene = new FallenTreeScene(this); break;
            case 'ANIMAL': this.currentScene = new AnimalScene(this); break;
            case 'BRIDGE': this.currentScene = new BridgeScene(this); break;
            case 'SCARY': this.currentScene = new ScaryJungleScene(this); break; // <--- This line works now
            case 'WATERFALL': this.currentScene = new WaterfallScene(this); break;
            case 'BEDROOM': this.currentScene = new BedroomScene(this); break; 
            case 'END_CREDITS': this.currentScene = new EndScene(this); break;
        }
    }

    // ... (rest of the file remains the same)
    update(dt) { if (this.currentScene && this.currentScene.update) this.currentScene.update(dt); }
    draw() { if (this.currentScene && this.currentScene.draw) this.currentScene.draw(this.ctx); }
    
    handlePressStart(x, y) {
        if (!this.currentScene) return;
        if (this.currentScene.handleInputStart) this.currentScene.handleInputStart();
        if (this.currentScene.handleClick) this.currentScene.handleClick(x, y);
    }

    handlePressEnd() {
        if (this.currentScene && this.currentScene.handleInputEnd) this.currentScene.handleInputEnd();
    }
}