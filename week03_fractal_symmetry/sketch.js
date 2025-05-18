let maxLength = 200;
let currentLength = 0;
let angleBase;
let swaySpeed;
let cello;

function preload() {
  // Load the compressed cello sound
  cello = loadSound("compressed_cello.mp3");
}

function setup() {
  createCanvas(600,600);
  angleMode(RADIANS);
  colorMode(HSL, 360, 100, 100, 255);
  noFill();

  angleBase = PI / 6;
  swaySpeed = 0.02;

  // Play sound once loaded
  if (cello && !cello.isPlaying()) {
    cello.setLoop(true);
    cello.setVolume(0.4);
    cello.play();
  }
}

function draw() {
  background(230, 100, 98); // pastel pinkish background

  translate(width / 2, height);
  let sway = sin(frameCount * swaySpeed) * 0.1;

  // Tree grows gradually
  let len = min(currentLength, maxLength);
  drawBranch(len, 0, sway);

  if (currentLength < maxLength) {
    currentLength += 1; // smooth slow growth
  }
}

function drawBranch(len, level, sway) {
  if (len < 5) return;

  let hue = map(level, 0, 10, 200, 320);
  let alpha = map(len, 5, maxLength, 80, 255);
  stroke(hue, 80, 50, alpha);
  strokeWeight(map(len, 5, maxLength, 0.5, 6));

  line(0, 0, 0, -len);
  translate(0, -len);

  push();
  rotate(angleBase + sway);
  drawBranch(len * 0.67, level + 1, sway);
  pop();

  push();
  rotate(-angleBase + sway);
  drawBranch(len * 0.67, level + 1, sway);
  pop();
}
