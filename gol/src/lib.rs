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

    pub fn step(&mut self) {
        // Clear the next grid
        for cell in self.next_grid.iter_mut() {
            *cell = 0;
        }

        // Calculate next generation
        for y in 1..self.height - 1 {
            for x in 1..self.width - 1 {
                let idx = y * self.width + x;
                let neighbors = self.grid[idx - self.width - 1]
                    + self.grid[idx - self.width]
                    + self.grid[idx - self.width + 1]
                    + self.grid[idx - 1]
                    + self.grid[idx + 1]
                    + self.grid[idx + self.width - 1]
                    + self.grid[idx + self.width]
                    + self.grid[idx + self.width + 1];

                if (self.grid[idx] == 1 && (neighbors == 2 || neighbors == 3))
                    || (self.grid[idx] == 0 && neighbors == 3)
                {
                    self.next_grid[idx] = 1;
                }
            }
        }

        // Swap grids
        std::mem::swap(&mut self.grid, &mut self.next_grid);
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
        for cell in self.grid.iter_mut() {
            *cell = 0;
        }
    }

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
