// Perlin Noise Flow Field (Coding Train reference below)
// https://thecodingtrain.com/challenges/24-perlin-noise-flow-field

let inc = 0.1;          // noise increment
let scl = 24;           // scale of each grid cell
let cols, rows;

let zoff = 0;           // time dimension in noise (slow drift)
let flowfield = [];

let particles = [];
let numParticles = 900;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(30);


  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);

  background(4, 6, 14);

  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  //  subtle fade each frame 
  noStroke();
  fill(4, 6, 14, 12);
  rect(0, 0, width, height);

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      //  angle from noise, then vector from angle
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.05);

      flowfield[index] = v;

      xoff += inc;
    }
    yoff += inc;
  }

  // time drift
  zoff += 0.0003;

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  background(4, 6, 14);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 0.6;

    this.prevPos = this.pos.copy();

    // smoky palette
    this.a = random(10, 28);
    this.c = random([
      [190, 198, 255],
      [165, 150, 255],
      [210, 220, 255],
      [140, 155, 210],
    ]);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    if (force) this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(this.c[0], this.c[1], this.c[2], this.a);
    strokeWeight(1);

    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    let wrapped = false;

    if (this.pos.x > width) {
      this.pos.x = 0;
      wrapped = true;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      wrapped = true;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      wrapped = true;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      wrapped = true;
    }

    if (wrapped) this.updatePrev();
  }
}
