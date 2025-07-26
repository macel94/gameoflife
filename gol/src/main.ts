
import './style.css'

const WIDTH = 1024;
const HEIGHT = 768;
const CELL_SIZE = 1; // 1px per cell for performance

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Conway's Game of Life</h1>
  <div style="margin-bottom: 1em;">
    <button id="randomize">Randomize</button>
    <button id="clear">Clear</button>
    <button id="start">Start</button>
    <span id="fps" style="margin-left:2em;font-weight:bold;"></span>
  </div>
  <canvas id="game" width="${WIDTH}" height="${HEIGHT}" style="border:1px solid #888;"></canvas>
`;

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const fpsDisplay = document.getElementById('fps')!;

let grid = new Uint8Array(WIDTH * HEIGHT);
let running = false;
let lastFrame = performance.now();
let frames = 0;
let fps = 0;

function randomizeGrid() {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() > 0.8 ? 1 : 0;
  }
  draw();
}

function clearGrid() {
  grid.fill(0);
  draw();
}

function draw() {
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  for (let i = 0; i < grid.length; i++) {
    const v = grid[i] ? 255 : 0;
    imageData.data[i * 4 + 0] = v;
    imageData.data[i * 4 + 1] = v;
    imageData.data[i * 4 + 2] = v;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

function step() {
  const next = new Uint8Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT) {
            neighbors += grid[ny * WIDTH + nx];
          }
        }
      }
      const idx = y * WIDTH + x;
      next[idx] = (grid[idx] && (neighbors === 2 || neighbors === 3)) || (!grid[idx] && neighbors === 3) ? 1 : 0;
    }
  }
  grid = next;
}

function loop(now: number) {
  if (running) {
    step();
    draw();
    frames++;
    if (now - lastFrame >= 1000) {
      fps = frames;
      frames = 0;
      lastFrame = now;
      fpsDisplay.textContent = `FPS: ${fps}`;
    }
    requestAnimationFrame(loop);
  }
}

document.getElementById('randomize')!.onclick = () => randomizeGrid();
document.getElementById('clear')!.onclick = () => clearGrid();
document.getElementById('start')!.onclick = () => {
  running = !running;
  document.getElementById('start')!.textContent = running ? 'Stop' : 'Start';
  if (running) {
    lastFrame = performance.now();
    frames = 0;
    requestAnimationFrame(loop);
  }
};

// Allow clicking on canvas to toggle cells
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left));
  const y = Math.floor((e.clientY - rect.top));
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    const idx = y * WIDTH + x;
    grid[idx] = grid[idx] ? 0 : 1;
    draw();
  }
});

clearGrid();
