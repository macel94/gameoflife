# Conway's Game of Life (Vite + TypeScript + Rust + WebAssembly)

This project implements Conway's Game of Life using Vite, TypeScript, and Rust compiled to WebAssembly for maximum performance. Features:
- 1000x1000 grid (1 million cells!)
- Buttons to randomize, clear, and start the game
- Core game logic implemented in Rust and compiled to WebAssembly
- TypeScript handles UI and rendering
- Optimized for high performance with Generations Per Second (GPS) counter

## 🚀 Live Demo

**[Play it live on GitHub Pages!](https://macel94.github.io/gameoflife/)**

## Performance

The Rust + WebAssembly implementation provides significant performance improvements over pure JavaScript/TypeScript:
- **Pure TypeScript**: ~130 generations per second
- **Rust + WebAssembly**: **~290 generations per second** (2.2x faster!)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the WebAssembly module (if not already built):
   ```bash
   source "$HOME/.cargo/env" && wasm-pack build --target web --out-dir pkg --release
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at the provided local address to view the game.

## Deployment

The project automatically deploys to GitHub Pages using GitHub Actions whenever you push to the main branch. The workflow:

1. Sets up Node.js and Rust
2. Installs wasm-pack
3. Builds the WebAssembly module in release mode
4. Builds the Vite project
5. Deploys to GitHub Pages

## Project Structure
- `src/` - TypeScript source code
- `src/lib.rs` - Rust source code for WebAssembly
- `pkg/` - Generated WebAssembly files
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow
- `.github/copilot-instructions.md` - Copilot custom instructions
- `.vscode/tasks.json` - VS Code tasks

## Performance Optimizations

The implementation uses several key optimizations:
- **Direct memory access** between WebAssembly and JavaScript
- **Batch processing** with optimized Rust loops
- **Manual loop unrolling** and unsafe memory operations
- **Release mode compilation** with full optimizations
- **Efficient grid swapping** and memory management

## License
MIT
