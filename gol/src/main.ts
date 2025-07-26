
import './style.css'
import wasmInit, { GameOfLife } from '../pkg/wasm_gol.js'

const WIDTH = 1000;
const HEIGHT = 1000;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Conway's Game of Life (Rust + WebAssembly)</h1>
  <div style="margin-bottom: 1em;">
    <button id="randomize">Randomize</button>
    <button id="clear">Clear</button>
    <button id="start">Start</button>
    <span id="fps" style="margin-left:2em;font-weight:bold;"></span>
  </div>
  <canvas id="game" width="${WIDTH}" height="${HEIGHT}" style="border:1px solid #888;"></canvas>
`;

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { alpha: false })!;
const fpsDisplay = document.getElementById('fps')!;
const imageData = ctx.createImageData(WIDTH, HEIGHT);

let game: GameOfLife;
let running = false;
let lastFrame = performance.now();
let generations = 0;
let gps = 0;

function draw() {
  const data = imageData.data;
  
  // Use get_cell method for each pixel
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cellValue = game.get_cell(x, y);
      const offset = (y * WIDTH + x) * 4;
      const v = cellValue ? 255 : 0;
      data[offset] = v;     // R
      data[offset + 1] = v; // G
      data[offset + 2] = v; // B
      data[offset + 3] = 255; // A
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function simulationLoop() {
  if (running) {
    const startTime = performance.now();
    // Run simulation batches for ~10ms to avoid blocking the UI thread.
    while (performance.now() - startTime < 10) {
      game.step();
      generations++;
    }
    setTimeout(simulationLoop, 0);
  }
}

function renderLoop(now: number) {
  if (running) {
    draw();
    if (now - lastFrame >= 1000) {
      gps = generations;
      generations = 0;
      lastFrame = now;
      fpsDisplay.textContent = `GPS: ${gps}`;
    }
    requestAnimationFrame(renderLoop);
  }
}

async function initGame() {
  await wasmInit();
  
  game = new GameOfLife(WIDTH, HEIGHT);
  
  document.getElementById('randomize')!.onclick = () => {
    game.randomize(0.2);
    draw();
  };
  
  document.getElementById('clear')!.onclick = () => {
    game.clear();
    draw();
  };
  
  document.getElementById('start')!.onclick = () => {
    running = !running;
    document.getElementById('start')!.textContent = running ? 'Stop' : 'Start';
    if (running) {
      lastFrame = performance.now();
      generations = 0;
      simulationLoop();
      requestAnimationFrame(renderLoop);
    }
  };

  // Allow clicking on canvas to toggle cells
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left));
    const y = Math.floor((e.clientY - rect.top));
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      const currentValue = game.get_cell(x, y);
      game.set_cell(x, y, currentValue ? 0 : 1);
      draw();
    }
  });

  game.clear();
  draw();
}

initGame().catch(console.error);
