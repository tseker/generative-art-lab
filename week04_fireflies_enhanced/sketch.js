// Firefly sketch with depth, glow, motion trails, interactivity, and Perlin noise
// Includes sound-reactive brightness and mouse repulsion behavior

let fireflies = [];        // Array to store all firefly objects
let ambientSound;          // Background ambient sound
let amplitude;             // For detecting audio level

function preload() {
  // Load the ambient sound before the sketch starts
  ambientSound = loadSound("compressed_firefly_sound.mp3");
}

function setup() {
  createCanvas(720, 1280);                 // Create a vertical canvas suitable for Reels/Instagram
  noStroke();                              // No border around shapes
  colorMode(HSL, 360, 100, 100, 255);      // Use HSL color mode for softer hues
  blendMode(ADD);                          // Additive blend mode for glowing effect
  background(0);                           // Start with black background

  // Create 100 firefly instances
  for (let i = 0; i < 10; i++) {
    fireflies.push(new Firefly());
  }

  // Play ambient background sound with fade-in
  if (ambientSound && !ambientSound.isPlaying()) {
    ambientSound.setLoop(true);            // Loop the sound continuously
    ambientSound.setVolume(0);             // Start silent
    ambientSound.play();
    ambientSound.fade(0.5, 3);             // Fade in to 0.5 volume over 3 seconds
  }

  // Initialize amplitude analyzer for sound reactivity
  amplitude = new p5.Amplitude();
  amplitude.setInput(ambientSound);
}

function draw() {
  // Draw semi-transparent black background for motion trails
  fill(0, 0, 0, 25);
  rect(0, 0, width, height);

  // Update and display each firefly
  for (let f of fireflies) {
    f.update();
    f.display();
  }
}

function mousePressed() {
  // On mouse press, strongly repel all fireflies from mouse position
  for (let f of fireflies) {
    f.repelFrom(mouseX, mouseY, true);
  }
}

// ------------------------
// Firefly Class Definition
// ------------------------
class Firefly {
  constructor() {
    // Perlin noise offset coordinates
    this.xOff = random(1000);
    this.yOff = random(1000);

    // Base size of the firefly
    this.baseSize = random(2, 4);

    // Color hue between yellow and orange
    this.hue = random(4, 800);

    // Simulated depth for parallax and flicker scaling
    this.depth = random(0.5, 1.5);

    // Initial position
    this.x = random(width);
    this.y = random(height);
  }

  update() {
    // Get current sound volume level
    let vol = amplitude.getLevel();

    // Update Perlin noise offset values
    this.xOff += 0.005 * this.depth;
    this.yOff += 0.005 * this.depth;

    // Determine target position using noise
    let targetX = noise(this.xOff) * width;
    let targetY = noise(this.yOff) * height;

    // If near mouse, repel
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < 100) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      this.x += cos(angle) * 1.5 * this.depth;
      this.y += sin(angle) * 1.5 * this.depth;
    } else {
      // Otherwise, softly drift toward noise-based target
      this.x = lerp(this.x, targetX, 0.03 * this.depth);
      this.y = lerp(this.y, targetY, 0.03 * this.depth);
    }
  }

  repelFrom(mx, my, forceful = false) {
    // Calculate angle from mouse position and push away
    let angle = atan2(this.y - my, this.x - mx);
    let factor = forceful ? 5 : 2;
    this.x += cos(angle) * factor;
    this.y += sin(angle) * factor;
  }

  display() {
    // Flicker glow with sine wave for natural pulsation
    let flicker = 150 + 100 * sin(frameCount * 0.1 + this.xOff * 10);

    // Apply scaled color and alpha based on depth
    fill(this.hue, 100, 60, flicker * this.depth);
    ellipse(this.x, this.y, this.baseSize * this.depth * 2);
  }
}