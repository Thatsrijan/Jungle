import SceneManager from './utils/SceneManager.js';
import AssetLoader from './utils/AssetLoader.js';
import SoundManager from './utils/SoundManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- DESIGN RESOLUTION ---
// iPhone 12/13/14/15/16 Pro Dimensions (Logical)
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

let sceneManager;
let lastTime = 0;

// --- AUTO-SCALER ---
function resize() {
    // Get browser window dimensions
    // We use documentElement.clientWidth to exclude scrollbars if any
    const winW = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const winH = Math.min(window.innerHeight, document.documentElement.clientHeight);
    
    const aspect = DESIGN_WIDTH / DESIGN_HEIGHT;
    const windowAspect = winW / winH;
    
    let scale;
    
    // Determine scale to fit screen while maintaining aspect ratio
    if (windowAspect < aspect) {
        // Screen is taller/thinner than game (Mobile)
        scale = winW / DESIGN_WIDTH;
    } else {
        // Screen is wider than game (Desktop/Tablet)
        scale = winH / DESIGN_HEIGHT;
    }
    
    // Apply CSS sizing
    canvas.style.width = `${DESIGN_WIDTH * scale}px`;
    canvas.style.height = `${DESIGN_HEIGHT * scale}px`;
    
    // Center the canvas vertically on desktop
    canvas.style.marginTop = `${(winH - (DESIGN_HEIGHT * scale)) / 2}px`;
    
    // Internal resolution stays constant for sharpness
    canvas.width = DESIGN_WIDTH;
    canvas.height = DESIGN_HEIGHT;
}

// ... imports ...

async function init() {
    resize();
    window.addEventListener('resize', resize);

    const loader = new AssetLoader();
    const soundManager = new SoundManager();

    const getGameCoords = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = DESIGN_WIDTH / rect.width;
        const scaleY = DESIGN_HEIGHT / rect.height;
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const handleStart = (e) => {
        e.preventDefault();
        if (!sceneManager) return;
        const { x, y } = getGameCoords(e);
        sceneManager.handlePressStart(x, y);
    };

    const handleEnd = (e) => {
        e.preventDefault();
        if (!sceneManager) return;
        sceneManager.handlePressEnd();
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    // --- AUDIO CONFIGURATION ---
    // 1. City/Car Scene Ambience
    soundManager.load('bgm_city', 'assets/audio/city_ambience.mp3');
    // 2. Travel/Flight Theme (Soft, airy)
    soundManager.load('bgm_travel', 'assets/audio/travel_theme.mp3');
    // 3. Jungle Ambience (Birds, wind, nature)
    soundManager.load('bgm_jungle', 'assets/audio/jungle_ambience.mp3');
    // 4. UI Sounds
    soundManager.load('sfx_tap', 'assets/audio/tap.mp3');

    // --- ASSET LOADING ---
    await loader.loadImages({
        // Previous...
        'intro_bg': 'assets/environments/intro_bg.jpg',
        'city': 'assets/environments/city.jpg',
        'home_bg': 'assets/environments/home.jpg', 
        'travel_transition': 'assets/environments/travel_transition.png',
        
        // NEW: Phase 3 Jungle Assets
        'jungle_path': 'assets/environments/jungle_path.png',
        'unfolding': 'assets/characters/unfolding.png', // Preload for next scene
        'her_talk': 'assets/characters/her_talk.png',   // Preload for next scene

        // UI & Vehicles
        'intro_text': 'assets/ui/intro_text.png',
        'play': 'assets/ui/play.png',
        'car': 'assets/vehicles/car.png',
        'airplane': 'assets/vehicles/airplane.png',
        
        // Characters
        'you_front': 'assets/characters/you_front.png',
        'her_front': 'assets/characters/her_front.png',
        'blindfolding': 'assets/characters/blindfolding.png',
        'blindfolded': 'assets/characters/blindfolded.png',
        'you_walk_back': 'assets/characters/you_walk_back.png',
        'her_walk_back': 'assets/characters/her_walk_back.png'

        , // --- PHASE 4 ASSETS ---
        'unfolding': 'assets/characters/unfolding.png', // (Was 14451.png)
        'her_excited': 'assets/characters/her_excited.png', // (Was 14450.png) <--- UPDATED
        'blindfolded': 'assets/characters/blindfolded.png',
        'jungle': 'assets/environments/jungle.jpg'

        , // --- PHASE 5 ASSETS ---
        'tree_fell': 'assets/environments/tree_fell.png',
        // 'no_tree': 'assets/environments/no_tree.png', // Optional, depending if you want it later
        'helping_over': 'assets/characters/helping_over.png', // THE NEW CG IMAGE
        
        // Ensure character expressions are loaded
        'her_scared': 'assets/characters/her_scared.png',
        'her_trust_scared': 'assets/characters/her_trust_scared.png',
        'her_excited': 'assets/characters/her_excited.png',

        // --- PHASE 6: ANIMAL SCENE ASSETS ---
        'jungle_animals': 'assets/environments/jungle_animals.png', // The background
        'her_crouch': 'assets/characters/pat.png',                  // Her interaction pose
        'you_explain': 'assets/characters/you_explain.png',         // Your reaction
        
        // Ensure other expressions exist
        'her_front': 'assets/characters/her_front.png',
        'you_front': 'assets/characters/you_front.png',
        'her_soft_smile': 'assets/characters/her_soft_smile.png',
        'bridge': 'assets/environments/bridge.jpg',
        'bridge_cross': 'assets/characters/bridge_cross.png',

        // --- PHASE 7: SCARY JUNGLE ASSETS ---
        'jungle_scary':'assets/environments/jungle_scary.jpg', //
        
        // Expression Mapping
        'her_scared': 'assets/characters/her_scared.png',       //
        'her_trust': 'assets/characters/her_trust_scared.png',  // (Mapped to 'trust')
        
        // Ensure you have these if dialogue calls for them
        'you_listen': 'assets/characters/you_front.png', // Fallback if no specific listen image
        'you_explain': 'assets/characters/you_explain.png',

        // --- PHASE 8: WATERFALL & CAMERA ---
        'waterfall': 'assets/environments/Waterfall.png',          //
        'camera_frame': 'assets/ui/camera_frame.png',              //
        'camera_button': 'assets/ui/camera_button.png',            //
        
        // Actions
        'you_give_flower': 'assets/characters/you_give_flower.png', //
        'her_recieve_flower': 'assets/characters/her_recieve_flower.png', //
        
        // State (Make sure you have a file for this, or it will use fallback)
        'her_sleep': 'assets/characters/her_sleep.png', 
        
        // Standard Fallbacks
        'her_front': 'assets/characters/her_front.png',
        'you_front': 'assets/characters/you_front.png',
        'her_soft_smile': 'assets/characters/her_soft_smile.png',

        'notification_card': 'assets/ui/notification_card.png', //
        'bedroom': 'assets/environments/bedroom.png',
        'her_wakeup_confused': 'assets/characters/her_wakeup_confused.png',
        'her_phone_surprise': 'assets/characters/her_phone_surprise.png',
        'her_phone_smile': 'assets/characters/her_phone_smile.png'

    });

    sceneManager = new SceneManager(ctx, DESIGN_WIDTH, DESIGN_HEIGHT, loader, soundManager);
    sceneManager.switchScene('TITLE');
    
    // Start Loop
    requestAnimationFrame(loop);
}

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear Screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update & Draw
    if (sceneManager) {
        sceneManager.update(deltaTime);
        sceneManager.draw(ctx);
    }

    requestAnimationFrame(loop);
}

// Kickoff
init();