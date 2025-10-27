
let bufferSmall;
let bufferScaleDivisor = 2;      // render at 1/2 res for sharper result with simple code

let balls = [];
let numberOfBalls = 5;

let speedMin = 0.06;             // slow drift (radians/sec)
let speedMax = 0.12;
let amplitudeMinFraction = 0.08; // of canvas height
let amplitudeMaxFraction = 0.16;

let radiusMinFraction = 0.10;    // of min(width, height)
let radiusMaxFraction = 0.17;

let mainLevel = 1.22;            // higher = tighter cores (prevents one big puddle)
let glowLevel = 1.08;            // glow sits close to core
let edgeSoftness = 0.05;         // small band = crisper edge

let glowAlphaDay = 0.03;         // very subtle glow
let glowAlphaNight = 0.035;

function makeSmallBuffer() {
  let bw = Math.max(240, Math.floor(width  / bufferScaleDivisor));
  let bh = Math.max(180, Math.floor(height / bufferScaleDivisor));
  bufferSmall = createGraphics(bw, bh);
  bufferSmall.pixelDensity(1);
}

function initBalls() {
  balls = [];
  // place evenly across width so gaps form naturally
  let leftEdge  = width * 0.12;
  let rightEdge = width * 0.88;

  for (let i = 0; i < numberOfBalls; i++) {
    let centerX = lerp(leftEdge, rightEdge, i / (numberOfBalls - 1));
    let baseY   = random(height * 0.30, height * 0.70);
    let radius  = min(width, height) * random(radiusMinFraction, radiusMaxFraction);
    let amplitudePixels = height * random(amplitudeMinFraction, amplitudeMaxFraction);
    let speed = random(speedMin, speedMax);
    let phase = random(0, Math.PI * 2);

    balls.push({
      centerX: centerX,
      baseY: baseY,
      radius: radius,
      amplitudePixels: amplitudePixels,
      speed: speed,
      phase: phase
    });
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("lamp-canvas");      // mount behind your centered clock

  pixelDensity(1);                   // simpler + faster
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();
  frameRate(24);                     // calm

  makeSmallBuffer();
  initBalls();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeSmallBuffer();
  initBalls(); // recompute sizes/positions in pixels
}

function draw() {
  clear(); // transparent canvas; the CSS day/night background shows through

  // Pick color based on the theme class your main.js sets
  let isDay = document.body.classList.contains('theme-day');
  let seconds = millis() / 1000;

  // slow hue drift: Day = orange↔red, Night = green↔blue
  let hueDegrees = isDay
    ? map(Math.sin(seconds * 0.18), -1, 1, 10, 25)
    : map(Math.sin(seconds * 0.18), -1, 1, 160, 220);

  let blobColor = color(hueDegrees, 90, 100, 255);
  let channelR = red(blobColor);
  let channelG = green(blobColor);
  let channelB = blue(blobColor);
  let glowAlphaFactor = isDay ? glowAlphaDay : glowAlphaNight;

  // current centers for this frame (in pixels)
  let centers = [];
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    let centerY = b.baseY + Math.sin(seconds * b.speed + b.phase) * b.amplitudePixels;
    centers.push({ x: b.centerX, y: centerY, r: b.radius });
  }

  // draw metaball field to the small buffer
  bufferSmall.loadPixels();

  let bw = bufferSmall.width;
  let bh = bufferSmall.height;

  for (let y = 0; y < bh; y++) {
    let py = (y / bh) * height;

    for (let x = 0; x < bw; x++) {
      let px = (x / bw) * width;

      //blob connect and disconnect (field sum)
      let fieldSum = 0;
      for (let j = 0; j < centers.length; j++) {
        let c = centers[j];
        let dx = px - c.x;
        let dy = py - c.y;
        fieldSum += (c.r * c.r) / (dx * dx + dy * dy + 1.0);
      }

      // crisp core + very thin halo (linear ramp -> simple)
      let alphaMain = constrain((fieldSum - mainLevel) / edgeSoftness, 0, 1);
      let alphaGlow = constrain((fieldSum - glowLevel) / edgeSoftness, 0, 1) * glowAlphaFactor;
      let alpha = max(alphaMain, alphaGlow);

      let idx = (y * bw + x) * 4;
      bufferSmall.pixels[idx + 0] = channelR;
      bufferSmall.pixels[idx + 1] = channelG;
      bufferSmall.pixels[idx + 2] = channelB;
      bufferSmall.pixels[idx + 3] = Math.floor(255 * alpha);
    }
  }

  bufferSmall.updatePixels();
  image(bufferSmall, 0, 0, width, height);
}


