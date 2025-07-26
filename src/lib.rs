use wasm_bindgen::prelude::*;

// Import the `console.log` function from the browser's Web API
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct GameOfLife {
    width: usize,
    height: usize,
    grid: Vec<u8>,
    next_grid: Vec<u8>,
}

#[wasm_bindgen]
impl GameOfLife {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> GameOfLife {
        console_log!("Creating Game of Life with {}x{}", width, height);
        let size = width * height;
        GameOfLife {
            width,
            height,
            grid: vec![0; size],
            next_grid: vec![0; size],
        }
    }

    // Optimized step function with manual loop unrolling for better performance
    pub fn step(&mut self) {
        let width = self.width;
        let height = self.height;
        
        // Clear the next grid efficiently
        unsafe {
            std::ptr::write_bytes(self.next_grid.as_mut_ptr(), 0, self.next_grid.len());
        }

        // Process interior cells only (avoid bounds checking in hot loop)
        for y in 1..height - 1 {
            let row_offset = y * width;
            let prev_row = (y - 1) * width;
            let next_row = (y + 1) * width;
            
            for x in 1..width - 1 {
                // Manual neighbor calculation for maximum speed
                let neighbors = 
                    self.grid[prev_row + x - 1] + self.grid[prev_row + x] + self.grid[prev_row + x + 1] +
                    self.grid[row_offset + x - 1] +                             self.grid[row_offset + x + 1] +
                    self.grid[next_row + x - 1] + self.grid[next_row + x] + self.grid[next_row + x + 1];

                let current_idx = row_offset + x;
                let is_alive = self.grid[current_idx] == 1;
                
                // Conway's rules optimized
                self.next_grid[current_idx] = if (is_alive && (neighbors == 2 || neighbors == 3)) || (!is_alive && neighbors == 3) {
                    1
                } else {
                    0
                };
            }
        }

        // Swap grids efficiently
        std::mem::swap(&mut self.grid, &mut self.next_grid);
    }

    // Batch step function - run multiple generations at once
    pub fn step_batch(&mut self, count: usize) {
        for _ in 0..count {
            self.step();
        }
    }

    pub fn set_cell(&mut self, x: usize, y: usize, value: u8) {
        if x < self.width && y < self.height {
            let idx = y * self.width + x;
            self.grid[idx] = value;
        }
    }

    pub fn get_cell(&self, x: usize, y: usize) -> u8 {
        if x < self.width && y < self.height {
            let idx = y * self.width + x;
            self.grid[idx]
        } else {
            0
        }
    }

    pub fn randomize(&mut self, probability: f32) {
        // Use JavaScript's Math.random() via web_sys
        for i in 0..self.grid.len() {
            let rand_val = js_sys::Math::random() as f32;
            self.grid[i] = if rand_val < probability { 1 } else { 0 };
        }
    }

    pub fn clear(&mut self) {
        unsafe {
            std::ptr::write_bytes(self.grid.as_mut_ptr(), 0, self.grid.len());
        }
    }

    // Direct memory access functions for JavaScript
    pub fn grid_ptr(&self) -> *const u8 {
        self.grid.as_ptr()
    }

    pub fn grid_len(&self) -> usize {
        self.grid.len()
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }
}
