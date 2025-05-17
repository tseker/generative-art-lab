let flowers = []; // Tüm çiçekleri saklayan dizi

function setup() {
  createCanvas(400, 400);
  background(255);
  angleMode(DEGREES); // Açılar derece cinsinden
}

function draw() {
  background(255, 20); // Hafif opaklıkla iz efekti

  for (let f of flowers) {
    f.update();
    f.display();
  }
}

// Fare tıklandığında yeni bir çiçek oluştur
function mousePressed() {
  flowers.push(new Flower(mouseX, mouseY));
}

// Çiçek sınıfı
class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.petalSize = random(20, 80);
    this.angle = 0;
    this.growing = true;

    // Renk rastgele atanır
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  update() {
    // Yaprak boyutu açılıp kapanır
    if (this.growing) {
      this.petalSize += 0.5;
      if (this.petalSize > 80) this.growing = false;
    } else {
      this.petalSize -= 0.5;
      if (this.petalSize < 20) this.growing = true;
    }

    // Hafif dönme efekti
    this.angle += 1;
  }

  display() {
    push();
    translate(this.x, this.y); // Çiçeği kendi konumuna taşı
    for (let i = 0; i < 360; i += 60) {
      push();
      rotate(i + this.angle); // Her yaprağı döndür
      fill(this.r, this.g, this.b, 150); // Renkli, yarı saydam
      noStroke();
      ellipse(30, 0, this.petalSize, 20);
      pop();
    }
    pop();
  }
}

let bloomSound;

function preload() {
  bloomSound = loadSound('compressed_cd_yang_001_exp01.mp3');
}


function mousePressed() {
  flowers.push(new Flower(mouseX, mouseY));

  // Ses çal
  if (bloomSound.isPlaying()) {
    bloomSound.stop(); // Aynı ses tekrar başlamasın diye
  }
  bloomSound.play();
}
