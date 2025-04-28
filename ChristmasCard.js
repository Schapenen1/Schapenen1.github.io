//Authors : Lars Gerritsen & Arthur Godthelp
//Movement instructions
//Click the mouse to shake the snow globe
let globe;
let background;
let match;
let fire;
let socks;
let stocking = new Array(5);
function setup() {
  createCanvas(500, 800); // Set the size of the window
  background = new Background();
  match = new Match();
  globe = new SnowGlobe();
  fire = new Fire();
  for (let i = 0; i < stocking.length; i++) {
    stocking[i] = new Stocking();
  }
}
function draw() {
  background(255);
  globe.display();
  globe.movement();
  background.bricks();
  background.fireplace();
  background.shelf();
  stocking[0].display(0);
  stocking[1].display(100);
  stocking[2].display(200);
  stocking[3].display(300);
  stocking[4].display(400);
  if (mouseY > 590 || (mouseX > 90 && mouseX < 400 && mouseY > 530)) {
    match.display(mouseX, mouseY);
  }
  fire.display();
  noStroke();
  rect(500, 0, height, width);
  rect(0, 750, height, width);
}
function mousePressed() {
  if (mouseY < height / 2) {
    globe.start();
  }
}
function keyPressed() {
  //Logic to light frame only when mouse is on the log and the l key is pressed
  if (mouseY > 720 && mouseX > 130 && mouseX < 365) {
    if (key == "l") {
      fire.update();
    }
  }
}
class Fire {
   i;
  numPics = 8;
  images = new Array(numPics);
  imageName;
  frameDelay = 10;
  frameCountTracker;
  light = false;
  constructor() {
    for (let j = 0; j < this.numPics; j++) {
      this.imageName = "Fire " + (j + 1) + ".png";
      this.images[j] = loadImage(this.imageName);
      if (this.images[j] == null) {
        console.log("Error: Could not load " + this.imageName);
        exit();
      }
    }
  }
  display() {
    if (this.light) {
      //Delay logic
      if (this.frameCountTracker >= this.frameDelay) {
        this.i = (this.i + 1) % this.numPics;
        this.frameCountTracker = 0;
      } else {
        this.frameCountTracker++;
      }
      image(this.images[this.i], 50, 550, 400, 400);
    }
  }
  update() {
    this.light = true;
  }
}
class Background {
  Mortar = "#C1C1BF";
  fireplace() {
    push();
    translate(0, 375);
    noStroke(); // Outer dark ellipse for fireplace
    fill(this.Mortar);
    ellipse(250, 300, 600, 400); // Inner lighter ellipse for depth
    fill(30);
    ellipse(250, 325, 600, 400); // Firewood
    fill("#553F16", 250);
    ellipse(250, 385, 240, 40);
    pop();
  }
  brickHeight = 20;
  brickWidth = 40;
  Brick = "#AF5A39";
  bricks() {
    stroke(1);
    push();
    translate(0, 375); // Mortar
    fill(this.Mortar);
    rect(0, 0, 500, 325); // Bricks
    for (let brickY = 0; brickY < 750 - 375; brickY += 25) {
      for (let brickX = 0; brickX < 500; brickX += this.brickWidth + 5) {
        fill(this.Brick);
        if ((brickY / 25) % 2 == 0) {
          rect(brickX, brickY, this.brickWidth, this.brickHeight);
        } else {
          rect(
            brickX - this.brickWidth / 2,
            brickY,
            this.brickWidth,
            this.brickHeight
            );
        }
      }
    }
    noStroke();
    pop();
  } //Shelf
  shelf() {
    fill("#6C5B2B");
    stroke(0);
    strokeWeight(1);
    rect(0, 365, 500, 40);
  }
}
class Match {
  image;
  constructor() {
    this.image = loadImage("Fire 1.png");
    if (this.image == null) {
      console.log("n");
    }
  }
  display(x, y) {
    fill(255);
    rect(x, y, 10, 50);
    image(this.image, x - 45, y - 50, 100, 100);
  }
}
class Scenery {
  house = "#9B6030";
  display() {
    //Draws a Pinetree
    push();
    translate(10, 0);
    fill("#376C1C");
    triangle(-80, 15, -60, -25, -40, 15);
    scale(1.5, 1.5);
    translate(20, 25); //Draws the Roof
    fill("#623800");
    rect(-65, 0, 10, 35);
    fill("#376C1C");
    triangle(-80, 15, -60, -25, -40, 15);
    pop(); //Draws a House
    push();
    translate(-10, 20);
    push();
    scale(1.2, 1.2);
    translate(-10, 0);
    fill("#C63A1E");
    triangle(20, 20, 95, 20, 57.5, -15);
    pop();
    fill(this.house);
    triangle(20, 20, 95, 20, 57.5, -15);
    rect(20, 20, 75, 35); //Draws a Door
    fill(0);
    rect(75, 25, 15, 30);
    fill("#EDD33E");
    circle(87, 40, 3); //Draws the Windows
    fill("#F7DA7A");
    rect(30, 25, 15, 20);
    rect(50, 25, 15, 20);
    circle(57.5, 5, 15);
    pop(); //Draws the Snow
    fill(255);
    ellipse(0, 94, 200, 50);
    ellipse(45, 85, 100, 30);
  }
}
class SnowGlobe {
  song;
  scenery;
  x;
  y;
  angle;
  toRight = false; // Constructor
  constructor() {
    this.song = new Song();
    this.scenery = new Scenery();
  }
  display() {
    push();
    translate(250, 187.5);
    rotate(radians(this.angle)); //Sphere of snowglobe
    fill("#A29ED3");
    stroke(0);
    circle(this.x, this.y, 300);
    noStroke(); //display scenery
    this.scenery.display(); //display song when snowglobe is shaked
    fill(0);
    if (this.toggleCount == this.maxToggles) {
      this.song.display();
      this.song.update();
    } //Base of the Snowglobe
    //Has to be last in drawing order, due to the animation
    fill("#5D4301");
    quad(
      this.x + 120,
      this.y + 160,
      this.x + 110,
      this.y + 100,
      this.x - 110,
      this.y + 100,
      this.x - 120,
      this.y + 160
      );
    pop();
  }
  targetAngle = 20;
  rotationSpeed = 0.3;
  toggleCount = 0;
  maxToggles = 3;
  movement() {
    if (!this.start) {
      if (this.toggleCount >= this.maxToggles) {
        this.angle += this.rotationSpeed;
        if (this.angle > 0) {
          this.angle = 0;
          return;
        }
      } // Adjust angle gradually toward target
      if (this.toRight && this.angle > -this.targetAngle) {
        this.angle = max(
          this.angle - this.rotationSpeed,
          -this.targetAngle
          );
      } else if (!this.toRight && this.targetAngle > this.angle) {
        this.angle = min(
          this.angle + this.rotationSpeed,
          this.targetAngle
          );
      } // Check if maximum angle is reached and reverse direction
      if (this.angle <= -this.targetAngle && this.toRight) {
        this.toRight = false;
        this.toggleCount++;
      } else if (this.angle >= this.targetAngle && !this.toRight) {
        this.toRight = true;
        this.toggleCount++;
      }
    }
  }
  isStarted = true;
  startShake() {
    this.isStarted = false;
  }
  }

class Socks {
  x;
  y;
  strokeValue = random(100, 255);
  display(x) {
    push();
    translate(0 + x, 375);
    noStroke(); //red part of the sock
    fill("#D81111");
    rect(31, this.y + 45, 58, 60);
    rotate(PI / 2.6);
    ellipse(120, this.y - 10, 40, 80);
    pop();
    push();
    translate(0 + x, 375);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(26, this.y + 15, 70, 34); //White part of the sock
    strokeWeight(1);
    pop();
  }
}
class Song {
  wordX; // Array for random x positions
  wordY; // Array for dynamic y positions
  amplitudes; // Array for unique amplitudes per word
  lineHeight = 50; // Height between words
  storestrings; // The words from the file
  font; // Constructor to initialize the Song
  constructor() {
    // Load the file and split into words
    let storelines = loadStrings("Jingle Bells.txt");
    let storetext = join(storelines, " ");
    let storestrings;

function preload() {
  let storelines = loadStrings('Jingle Bells.txt');  // Make sure 'Jingle Bells.txt' is in the correct folder
  let storetext = join(storelines, " ");
  storestrings = split(storetext, " ");
}
 //Load the font
    this.font = loadFont("FreestyleScript-Regular-48.vlw"); // Initialize random x positions and unique amplitudes
    this.wordX = new Array(storestrings.length);
    this.wordY = new Array(storestrings.length);
    this.amplitudes = new Array(storestrings.length);
    for (let i = 0; i < this.storestrings.length; i++) {
      this.wordX[i] = random(-100, 50);
      this.wordY[i] = i * this.lineHeight - 1100;
      this.amplitudes[i] = random(5, 15);
    }
  }
  display() {
    fill(255);
    textFont(this.font, 40); // words in reverse order
    for (let i = this.storestrings.length - 1; i >= 0; i--) {
      // Calculate sinusoidal offset
      let wordOffset = this.amplitudes[i] * sin(frameCount * 0.05 + i); // Calculate reversed index for vertical alignment
      let reversedIndex = this.storestrings.length - 1 - i; // Draw the word at the current position
      text(
        this.storestrings[i],
        this.wordX[i] + wordOffset,
        this.wordY[reversedIndex]
        );
    }
  } // Update method to move words
  update() {
    //Moving Downwards
    for (let i = 0; i < this.storestrings.length; i++) {
      this.wordY[i] += 1; // Reset Position
      if (this.wordY[i] > 150) {
        this.wordY[i] = -900;
      }
    }
  }
}
class Stocking extends Socks {
  constructor() {
    super();
  }
  object() {
    fill("#298343");
    triangle(50, 430, 60, 420, 70, 430);
  }
}
