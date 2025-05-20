let inc = 0.1;        // Increment for Perlin noise input (higher = faster change)
let scl = 20;         // Size of each grid cell in the flow field
let cols, rows;       // Number of columns and rows based on canvas size
let zoff = 0;         // Third dimension for Perlin noise (time evolution)
let flowField = [];   // The flow field (vector directions)

let particles = [];   // Array of all moving particles
let sound, amp;       // Sound object and amplitude analyzer


function preload() {
  sound = loadSound("compressed_triumphant_pad.mp3");
}


function setup() {
  createCanvas(720, 1280);                 // Instagram reel-sized canvas
  colorMode(HSL, 360, 100, 100, 255);      // Enables rich color control
  blendMode(ADD);                          // Makes overlapping strokes glow
  background(0);                           // Black background

  cols = floor(width / scl);              // Number of horizontal flow vectors
  rows = floor(height / scl);             // Number of vertical flow vectors
  flowField = new Array(cols * rows);     // Preallocate flow field array

  for (let i = 0; i < 600; i++) {
    particles[i] = new Particle();         // Create 600 independent particles
  }

  sound.setLoop(true);
  sound.setVolume(0.4);
  sound.play();

  amp = new p5.Amplitude();               // Set up amplitude analyzer
  amp.setInput(sound);                    // Feed it the ambient music
}


function draw() {
  fill(0, 0, 0, 20);                      // Transparent black for trail fade
  rect(0, 0, width, height);              // Draw over the canvas each frame

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      // Get a noise-based angle between 0 and TWO_PI*4
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle); // Convert angle to direction
      v.setMag(1);                         // Vector length = 1
      flowField[index] = v;               // Store in the flow field

      xoff += inc;
    }
    yoff += inc;
  }

  // 🔊 Move through z-axis over time (affected by sound)
  let level = amp.getLevel();            // Get volume level (0–1)
  zoff += 0.003 + level * 0.02;          // Speed up noise changes based on sound

  for (let p of particles) {
    p.follow(flowField);                 // Align with current flow
    p.update();                          // Move position based on acceleration
    p.edges();                           // Wrap around edges
    p.show(level);                       // Draw particle based on sound level
  }
}


// -------------------
// Particle class
// -------------------

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height)); // Initial position
    this.vel = createVector(0, 0);                           // Velocity
    this.acc = createVector(0, 0);                           // Acceleration
    this.maxSpeed = 2;                                       // Movement speed cap
    this.hue = random(360);                                  // Starting color
    this.prevPos = this.pos.copy();                          // To draw motion trail
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];              // Look up vector from flow field
    if (force) this.applyForce(force);       // Apply if it exists
  }

  applyForce(force) {
    this.acc.add(force);                     // Accumulate force
  }

  update() {
    this.vel.add(this.acc);                  // Add acceleration to velocity
    this.vel.limit(this.maxSpeed);           // Limit top speed
    this.pos.add(this.vel);                  // Move position
    this.acc.mult(0);                        // Reset acceleration
  }

  show(level) {
    // Map volume level to brightness and alpha glow
    let brightness = map(level, 0, 0.3, 40, 100);
    let alpha = map(level, 0, 0.3, 60, 150);

    stroke((this.hue + frameCount / 4) % 360, 80, brightness, alpha);
    strokeWeight(1.2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    this.prevPos = this.pos.copy();          // Update trail start point
  }

  edges() {
    // Wrap around edges and reset previous position
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos.x = this.pos.x;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos.y = this.pos.y;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos.y = this.pos.y;
    }
  }
}
