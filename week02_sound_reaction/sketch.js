let song, fft;
let particles = [];
let beatCutoff = 0;
let beatThreshold = 0.15;
let beatDecayRate = 0.98;
let beatHoldFrames = 30;
let framesSinceLastBeat = 0;

function preload() {
  song = loadSound("compressed_flute_beat.mp3");
}

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);

  fft = new p5.FFT();
  fft.setInput(song);

  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }

  let btn = createButton("Play");
  btn.position(10, height + 10);
  btn.mousePressed(() => {
    if (!song.isPlaying()) {
      song.play();
    }
  });
}

function draw() {
  background(0, 55); // iz efekti için yarı saydam arka plan

  let level = fft.getEnergy("bass") / 255;
  detectBeat(level);

  for (let p of particles) {
    p.update();
    p.display();
  }
}

// -----------------------
// Beat Detection Logic
// -----------------------
function detectBeat(level) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
    beatCutoff = level * 1.1;
    framesSinceLastBeat = 0;
  } else {
    if (framesSinceLastBeat <= beatHoldFrames) {
      framesSinceLastBeat++;
    } else {
      beatCutoff *= beatDecayRate;
      beatCutoff = max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  console.log("💥 Beat detected!");
  for (let p of particles) {
    p.triggerBeat(); // partikül tepki versin
  }
}

// -----------------------
// Particle Class
// -----------------------
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.baseR = random(2, 5);
    this.r = this.baseR;
    this.t = random(1000);
    this.color = color(random(150, 255), random(100, 255), random(200, 255), 180);
    this.flashFrames = 0;
    this.glowColor = this.color;
  }

  update() {
    // Hareket: perlin noise ile
    let n = noise(this.x * 0.005, this.y * 0.005, this.t);
    let angle = TAU * n;
    this.x += cos(angle) * 1.5;
    this.y += sin(angle) * 1.5;
    this.t += 0.003;

    // Ekran dışına çıkarsa dön
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Beat etkisi varsa, etkisini azalt
    if (this.flashFrames > 0) {
      this.flashFrames--;
    }
  }

  triggerBeat() {
    this.flashFrames = 12;
    this.glowColor = color(random(255), random(255), random(255), 255);
  }

  display() {
    let size = this.flashFrames > 0 ? this.baseR * 5 : this.baseR;
    let c = this.flashFrames > 0 ? this.glowColor : this.color;

    fill(c);
    rect(this.x, this.y, size, size);
  }
}
