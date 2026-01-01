import SceneManager from "./utils/SceneManager.js";

let canvas, ctx;
let lastTime = 0;
let sceneManager;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sceneManager.update(delta);
  sceneManager.draw(ctx);

  requestAnimationFrame(gameLoop);
}

export function startApp() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  sceneManager = new SceneManager(canvas);

  console.log("ENV CHECK:", {
    her: import.meta.env.VITE_HER_NAME,
    you: import.meta.env.VITE_YOUR_NAME
  });

  requestAnimationFrame(gameLoop);
}