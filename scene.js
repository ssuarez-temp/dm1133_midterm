let grid = [];
let Rects = [];
let time = 0;

class Person {

  constructor(x, y, r, c = color(random(255), random(255), random(255))) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.startX = x;
    this.startY = y;
    this.targetX = x;
    this.targetY = y;
    this.startTime = 0;
    this.duration = 0;
    this.easePow = 3;
  }
  shimmer() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
  draw(opacity) {
    if (opacity !== undefined) {
      fill(red(this.c), green(this.c), blue(this.c), opacity);
    } else {
      fill(this.c);
    }
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
  march(speed) {
    this.y += speed;
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

class Cross {
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

function back() {
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

function scene0(opacity) {
  cruz = new Cross(width / 2, height / 2, 100, 10);
  cruz.draw(opacity);
}