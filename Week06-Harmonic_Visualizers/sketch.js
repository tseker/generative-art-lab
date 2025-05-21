
let sound, fft;
let zShift = 0;
let bgHue = 0;

function preload() {
  sound = loadSound("techno_loop_compressed.mp3");
}

function setup() {
  createCanvas(720, 1280); // Reels boyutu
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  fft = new p5.FFT();
  sound.loop();
  noStroke();
}

function draw() {
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // 🎨Background:
  bgHue = map(bass, 0, 255, 0, 360);
  background(bgHue, 50, 5, 15); 

  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);

  zShift += map(bass, 0, 255, 0.1, 0.5);

  for (let i = 0; i < 150; i++) {
    let angle = map(i, 0, 150, 0, 360);
    let noiseOffset = noise(i * 0.1, zShift) * 100;
    let r = 200 + noiseOffset;

    let x = r * cos(angle);
    let y = r * sin(angle);

    let hue = (angle + frameCount) % 360;
    fill(hue, 90, 100, 60);
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = color(hue, 90, 100);
    ellipse(x, y, 4 + sin(frameCount * 0.05 + i) * 3);
  }
}
