# Conway's Game of Life (Vite + TypeScript + Rust + WebAssembly)

This project implements Conway's Game of Life using Vite, TypeScript, and Rust compiled to WebAssembly for maximum performance. Features:
- 1000x1000 grid (upgraded for performance testing)
- Buttons to randomize, clear, and start the game
- Core game logic implemented in Rust and compiled to WebAssembly
- TypeScript handles UI and rendering
- Optimized for high performance with Generations Per Second (GPS) counter

## Performance

The Rust + WebAssembly implementation provides significant performance improvements over pure JavaScript/TypeScript:
- Pure TypeScript: ~130 generations per second
- Rust + WebAssembly: Expected 500+ generations per second

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the WebAssembly module (if not already built):
   ```bash
   source "$HOME/.cargo/env" && wasm-pack build --target web --out-dir pkg
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at the provided local address to view the game.

## Project Structure
- `src/` - TypeScript source code
- `src/lib.rs` - Rust source code for WebAssembly
- `pkg/` - Generated WebAssembly files
- `.github/copilot-instructions.md` - Copilot custom instructions
- `.vscode/tasks.json` - VS Code tasks

## License
MIT
