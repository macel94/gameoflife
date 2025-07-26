
import './style.css'

const WIDTH = 1000;
const HEIGHT = 1000;

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
const ctx = canvas.getContext('2d', { alpha: false })!;
const fpsDisplay = document.getElementById('fps')!;
const imageData = ctx.createImageData(WIDTH, HEIGHT);

let grid = new Uint8Array(WIDTH * HEIGHT);
let nextGrid = new Uint8Array(WIDTH * HEIGHT);
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
  const data = imageData.data;
  for (let i = 0; i < grid.length; i++) {
    const offset = i * 4;
    const v = grid[i] ? 255 : 0;
    data[offset] = v;
    data[offset + 1] = v;
    data[offset + 2] = v;
    data[offset + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

function step() {
  nextGrid.fill(0);
  for (let y = 1; y < HEIGHT - 1; y++) {
    for (let x = 1; x < WIDTH - 1; x++) {
      const idx = y * WIDTH + x;
      const neighbors =
        grid[idx - WIDTH - 1] + grid[idx - WIDTH] + grid[idx - WIDTH + 1] +
        grid[idx - 1] + grid[idx + 1] +
        grid[idx + WIDTH - 1] + grid[idx + WIDTH] + grid[idx + WIDTH + 1];
      
      if ((grid[idx] === 1 && (neighbors === 2 || neighbors === 3)) || (grid[idx] === 0 && neighbors === 3)) {
        nextGrid[idx] = 1;
      }
    }
  }
  const temp = grid;
  grid = nextGrid;
  nextGrid = temp;
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
