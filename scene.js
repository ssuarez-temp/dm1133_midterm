let grid = [];
let Rects = [];

let elimQueue = [];
let curr = null;
let lastReplaced = 0;
let elimInterval = 750; // eliminations by person
let targetInterval = 750; // scanning
let destroyInterval = 500; // 
let shatterInterval = 500; // 
let replaceInterval = 1000; // 

let triggeredScenes = { // scene control mapping
  "Communists": false,
  "Socialists": false,
  "Trade Unionists": false,
  "none": false,
  "Me": false
};
let activeScene = null; // scene control

class Particle {
  constructor(x, y, c = color(255)) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.5, 1.5);
    this.vy = random(-0.4, 2);
    this.life = 255;
    this.r = red(c);
    this.g = green(c);
    this.b = blue(c);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 8;
  }
  draw(r = 3) {
    fill(this.r, this.g, this.b, this.life);
    ellipse(this.x, this.y, r);
  }
  dead() {
    return this.life <= 0;
  }
}

class scanParticle extends Particle {
  constructor(x, y) {
    super(x, y, color(255), 2);
    this.vx = 0;
    this.vy = random(-1.5, 0);
  }
  update() {
    super.update();
    // this.life -= 5;
  }
}

class Person {
  constructor(x, y, r, c = color(random(255), random(255), random(255)), group = "none") {
    // position
    this.x = x;
    this.y = y;
    // radius
    this.r = r;
    // color
    this.c = c;
    // entering
    this.startX = x;
    this.startY = y;
    this.targetX = x;
    this.targetY = y;
    this.startTime = 0;
    this.duration = 0;
    this.easePow = 3;
    // scanned
    this.group = group;
    this.scanned = false;
    this.status = "secure" // "secure" "target" "destroy" "replaced"
    this.timer = 0; // timer for replacement
    this.destroyR = r; // radius for shimmering in destruction
    this.flash = true; // flashing for shimmering
    // particles
    this.fragments = [];
    this.fade = 0;
    this.destroyStarted = false;
  }
  shimmer() { // shimmering
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
  march(speed) { // unused marching
    this.y += speed;
  }
  changeGroup(newGroup, newColor) {
    this.group = newGroup;
    this.c = newColor;
  }
  replaced() { // start of elimination process
    if (this.status !== "secure") return;
    this.status = "target";
    this.timer = millis();
    // this.changeGroup(null, color(255));
  }
  update() { // update position and status
    if (this.status === "target") {
      if (millis() - this.timer >= targetInterval) {
        this.status = "destroy";
        this.timer = millis();
      }
    }
    else if (this.status === "destroy") {
      let t = millis() - this.timer;
      this.destroyR = this.group === "Me" ?
        this.r : map(t, 0, destroyInterval, this.r, this.r * 1.05);
      if (millis() - this.timer >= destroyInterval && this.group !== "Me") {
        this.status = "shatter";
        this.timer = millis();
      }
    }
    else if (this.status === "shatter") {
      if (!this.destroyStarted) { // push in particles
        for (let i = 0; i < 10; i++) {
          this.fragments.push(new Particle(this.x, this.y, this.c));
        }
        this.destroyStarted = true;
      }
      if (millis() - this.timer >= shatterInterval && this.group !== "none") {
        this.status = "replaced";
        this.timer = millis();
        this.c = color(255);
      }
    } else if (this.status === "replaced") {
      if (millis() - this.timer >= replaceInterval) {
        this.status = "replaced";
        this.timer = millis();
      }
    }
  }
  draw(opacity) {
    if (opacity !== undefined) {
      fill(red(this.c), green(this.c), blue(this.c), opacity);
    } else {
      fill(this.c);
    }
    if (this.status === "secure") {
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
    } else if (this.status === "target") {
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
      stroke(255);
      strokeWeight(2);
      let t = millis() - this.timer;
      let d = map(t, 0, targetInterval, this.r * 3, this.r * 2);
      // scanning frame
      line(this.x - d, this.y - d, this.x - 0.5 * d, this.y - d);
      line(this.x - d, this.y - d, this.x - d, this.y - 0.5 * d);

      line(this.x + d, this.y - d, this.x + 0.5 * d, this.y - d);
      line(this.x + d, this.y - d, this.x + d, this.y - 0.5 * d);

      line(this.x - d, this.y + d, this.x - 0.5 * d, this.y + d);
      line(this.x - d, this.y + d, this.x - d, this.y + 0.5 * d);

      line(this.x + d, this.y + d, this.x + 0.5 * d, this.y + d);
      line(this.x + d, this.y + d, this.x + d, this.y + 0.5 * d);
      noStroke();
    } else if (this.status === "destroy") {
      this.flash = this.group === "Me" ?
        frameCount % 80 < 40 : frameCount % 6 < 3;
      if (this.flash) {
        stroke(255);
        strokeWeight(2);
        let d = this.destroyR * 2;
        line(this.x - d, this.y - d, this.x - 0.5 * d, this.y - d);
        line(this.x - d, this.y - d, this.x - d, this.y - 0.5 * d);

        line(this.x + d, this.y - d, this.x + 0.5 * d, this.y - d);
        line(this.x + d, this.y - d, this.x + d, this.y - 0.5 * d);

        line(this.x - d, this.y + d, this.x - 0.5 * d, this.y + d);
        line(this.x - d, this.y + d, this.x - d, this.y + 0.5 * d);

        line(this.x + d, this.y + d, this.x + 0.5 * d, this.y + d);
        line(this.x + d, this.y + d, this.x + d, this.y + 0.5 * d);
        noStroke();
      }
      if (this.group !== "Me") this.shimmer();
      ellipse(this.x, this.y, this.destroyR * 2, this.destroyR * 2);
    }
    else if (this.status === "shatter") {
      for (let i = this.fragments.length - 1; i >= 0; --i) {
        let f = this.fragments[i];
        f.update();
        f.draw(this.r / 1.25);
        this.fragments = this.fragments.filter(f => !f.dead());
      }
    } else if (this.status === "replaced") {
      this.fade += 5;
      if (this.fade > 255) this.fade = 255;
      fill(255, this.fade);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  }


}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    rect(this.x, this.y, this.w, this.h);
  }
  move(speed) {
    this.y += speed;
  }
}

class Cross { // la cruz
  constructor(x, y, d, r) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.r = r;
  }
  draw(opacity = 255) {
    fill(255, opacity);
    rect(this.x - this.d * 0.8, this.y - this.r - this.d * 0.2, this.d * 1.6, this.r * 2);
    rect(this.x - this.r, this.y - this.d, this.r * 2, this.d * 2);
  }
}

function back() { // background rectangles, mimicing television static
  noStroke();
  fill(255, 100);
  for (let i = 0; i < Rects.length; ++i) {
    Rects[i].draw();
    Rects[i].move(0.5);
    if (Rects[i].y + Rects[i].h > height) {
      rect(0, 0, width, Rects[i].y + Rects[i].h - height);
    }
    if (Rects[i].y > height) {
      Rects[i].y -= height;
    }
  }
}

function drawTime() { // time for testing purposes

  let ms = millis();

  let cs = floor((ms % 1000) / 10);
  let s = floor(ms / 1000) % 60;
  let m = floor(ms / 60000) % 60;
  let h = floor(ms / 3600000);

  function pad(n) {
    if (n < 100) {
      return n.toString().padStart(2, "0");
    }
  }

  let t = pad(h) + ":" + pad(m) + ":" + pad(s) + "." + pad(cs);

  fill(255);
  noStroke();
  textSize(16);
  textFont("monospace");
  text(t, 10, 25);
}

function scene0(opacity) {
  cruz = new Cross(width / 2, height / 2, 100, 10);
  // cruz.draw(opacity);
}

function drawScanParticles() {
  let spacing = 5;
  let cols = floor(width / spacing);
  for (let i = 0; i < cols; i++) {
    let x = i * spacing + spacing / 2;
    let y = scanY;
    scanParticles.push(new scanParticle(x, y));
  }
  for (let i = scanParticles.length - 1; i >= 0; i--) {
    let p = scanParticles[i];
    p.update();
    p.draw(7.5);
    if (p.dead()) {
      scanParticles.splice(i, 1);
    }
  }
}

function killUpdate() {
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      let p = grid[i][j];
      p.update();
    }
  }
  if (elimQueue.length > 0 && curr === null
    && millis() - lastReplaced >= elimInterval) {
    curr = elimQueue.shift(); // first-in-first-out
    curr.replaced();
    // curr.scanned = false;
    lastReplaced = millis();
  }
  if (curr !== null && curr.scanned == true) {
    curr = null;
  }
}