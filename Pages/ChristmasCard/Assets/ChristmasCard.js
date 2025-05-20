let globe, bg, match, fire;
let stocking = [];
let storestrings = [];
let font;

// Asset holders
let fireImages = [];
let matchImage;
let jingleLyrics = [];

function preload() {
  for (let i = 0; i < 8; i++) {
    fireImages[i] = loadImage('Assets/Fire ' + (i + 1) + '.png');
  }
  matchImage = loadImage('Assets/Fire 1.png');
  jingleLyrics = loadStrings('Assets/Jingle Bells.txt');
}

function setup() {
  let cnv = createCanvas(500, 800);
  cnv.parent("canvas-container"); // This puts the canvas in the correct place
  textFont('Lavishly Yours'); 
  bg = new Background();
  match = new Match();
  globe = new SnowGlobe();
  fire = new Fire();
  for (let i = 0; i < 5; i++) {
    stocking[i] = new Stocking();
  }
}

function draw() {
  background(255);
  globe.display();
  globe.movement();
  bg.bricks();
  bg.fireplace();
  bg.shelf();

  for (let i = 0; i < 5; i++) {
    stocking[i].display(i * 100);
  }

  if (mouseY > 590 || (mouseX > 90 && mouseX < 400 && mouseY > 530)) {
    match.display(mouseX, mouseY);
  }

  fire.display();

  noStroke();
  }

function mousePressed() {
 if (mouseY<590 && mouseX>0 && mouseX<width) {
      globe.startShake();
  }
}

function keyPressed() {
  if (mouseY > 720 && mouseX > 130 && mouseX < 365) {
    if (key === 'l') {
      fire.update();
    }
  }
}

class Fire {
  constructor() {
    this.images = fireImages;
    this.numPics = this.images.length;
    this.i = 0;
    this.frameDelay = 10;
    this.frameCountTracker = 0;
    this.light = false;
  }

  display() {
    if (this.light) {
      if (this.frameCountTracker >= this.frameDelay) {
        this.i = (this.i + 1) % this.numPics;
        this.frameCountTracker = 0;
      } else {
        this.frameCountTracker++;
      }
      image(this.images[this.i], 50, 550, 400, 475);
    }
  }

  update() {
    this.light = true;
  }
}

class Background {
  constructor() {
    this.Mortar = "#C1C1BF";
    this.Brick = "#AF5A39";
    this.brickHeight = 20;
    this.brickWidth = 40;
  }

  fireplace() {
    push();
    translate(0, 375);
    noStroke();
    fill(this.Mortar);
    ellipse(250, 300, 600, 400);
    fill(30);
    ellipse(250, 325, 600, 400);
    fill("#553F16");
    ellipse(250, 425, 240, 40);
    pop();
  }

  bricks() {
    stroke(1);
    push();
    translate(0, 375);
    fill(this.Mortar);
    rect(0, 0, 500, 325);
    for (let brickY = 0; brickY < 375; brickY += 25) {
      for (let brickX = 0; brickX < 500; brickX += this.brickWidth + 5) {
        fill(this.Brick);
        if ((brickY / 25) % 2 == 0) {
          rect(brickX, brickY, this.brickWidth, this.brickHeight);
        } else {
          rect(brickX - this.brickWidth / 2, brickY, this.brickWidth, this.brickHeight);
        }
      }
    }
    noStroke();
    pop();
  }

  shelf() {
    fill("#6C5B2B");
    stroke(0);
    strokeWeight(1);
    rect(0, 365, 500, 40);
  }
}

class Match {
  constructor() {
    this.image = matchImage;
  }

  display(x, y) {
    fill(255);
    rect(x, y, 10, 50);
    image(this.image, x - 45, y - 50, 100, 100);
  }
}

class Scenery {
  display() {
    push();
    translate(10, 0);
    fill("#376C1C");
    triangle(-80, 15, -60, -25, -40, 15);
    scale(1.5);
    translate(20, 25);
    fill("#623800");
    rect(-65, 0, 10, 35);
    fill("#376C1C");
    triangle(-80, 15, -60, -25, -40, 15);
    pop();

    push();
    translate(-10, 20);
    push();
    scale(1.2);
    translate(-10, 0);
    fill("#C63A1E");
    triangle(20, 20, 95, 20, 57.5, -15);
    pop();
    fill("#9B6030");
    triangle(20, 20, 95, 20, 57.5, -15);
    rect(20, 20, 75, 35);
    fill(0);
    rect(75, 25, 15, 30);
    fill("#EDD33E");
    circle(87, 40, 3);
    fill("#F7DA7A");
    rect(30, 25, 15, 20);
    rect(50, 25, 15, 20);
    circle(57.5, 5, 15);
    pop();

    fill(255);
    ellipse(0, 94, 200, 50);
    ellipse(45, 85, 100, 30);
  }
}

class SnowGlobe {
  constructor() {
    this.song = new Song();
    this.scenery = new Scenery();
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.toRight = false;
    this.targetAngle = 20;
    this.rotationSpeed = 0.3;
    this.toggleCount = 0;
    this.maxToggles = 3;
    this.isStarted = true;
  }

  display() {
    push();
    translate(250, 187.5);
    rotate(radians(this.angle));
    fill("#A29ED3");
    stroke(0);
    circle(this.x, this.y, 300);
    noStroke();
    this.scenery.display();

    if (this.toggleCount === this.maxToggles) {
      this.song.display();
      this.song.update();
    }

    fill("#5D4301");
    quad(this.x + 120, this.y + 160, this.x + 110, this.y + 100,
         this.x - 110, this.y + 100, this.x - 120, this.y + 160);
    pop();
  }

  movement() {
    if (!this.isStarted) {
      if (this.toggleCount >= this.maxToggles) {
        this.angle += this.rotationSpeed;
        if (this.angle > 0) {
          this.angle = 0;
          return;
        }
      }

      if (this.toRight && this.angle > -this.targetAngle) {
        this.angle = max(this.angle - this.rotationSpeed, -this.targetAngle);
      } else if (!this.toRight && this.targetAngle > this.angle) {
        this.angle = min(this.angle + this.rotationSpeed, this.targetAngle);
      }

      if (this.angle <= -this.targetAngle && this.toRight) {
        this.toRight = false;
        this.toggleCount++;
      } else if (this.angle >= this.targetAngle && !this.toRight) {
        this.toRight = true;
        this.toggleCount++;
      }
    }
  }

  startShake() {
    this.isStarted = false;
  }
}

class Song {
  constructor() {
    this.font = font;
    this.lineHeight = 50;
    storestrings = jingleLyrics


    this.wordX = new Array(storestrings.length);
    this.wordY = new Array(storestrings.length);
    this.amplitudes = new Array(storestrings.length);

    for (let i = 0; i < storestrings.length; i++) {
      this.wordX[i] = random(-150, 0);
      this.wordY[i] = i * this.lineHeight - 500;
      this.amplitudes[i] = random(5, 15);
    }
  }

  display() {
    fill(255);
    textSize(30);
    for (let i = storestrings.length - 1; i >= 0; i--) {
      let wordOffset = this.amplitudes[i] * sin(frameCount * 0.05 + i);
      text(storestrings[i], this.wordX[i] + wordOffset, this.wordY[i]);
    }
    
  }

  update() {
    for (let i = 0; i < storestrings.length; i++) {
      this.wordY[i] += 1;
      if (this.wordY[i] > 150) {
        this.wordY[i] = -500;
      }
    }
  }
}

class Socks {
  constructor() {
    this.y = 0;
  }

  display(x) {
    push();
    translate(x, 375);
    noStroke();
    fill("#D81111");
    rect(31, this.y + 45, 58, 60);
    rotate(PI / 2.6);
    ellipse(120, this.y - 10, 40, 80);
    pop();

    push();
    translate(x, 375);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(26, this.y + 15, 70, 34);
    strokeWeight(1);
    pop();
  }
}

class Stocking extends Socks {
  constructor() {
    super();
  }
}
