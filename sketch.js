let grid = [];
let Rects = [];
let col = 5, row = 10;
let time = 0;

class Person {
  constructor(x, y, r, c = color(random(255), random(255), random(255))) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  shimmer() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
  draw(opacity) {
    if(opacity != undefined) this.c.setAlpha(opacity);
    fill(this.c);
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

function setup() {
  noStroke();
  createCanvas(800, 800);
  background(0);
  for (let i = 0; i < 10; ++i) {
    Rects[i] = new Rectangle(0, i * height / 10, width, height / 50);
  }
  scene1_x = width / 8;
  scene1_y = height / 8;
  scenewidth = width * 3 / 4;
  sceneheight = height * 3 / 4;
  for (let i = 0; i < col; i++) {
    grid[i] = [];
    for (let j = 0; j < row; j++) {
      let x = scene1_x + i * scenewidth / col + scenewidth / col / 2;
      let y = scene1_y + j * sceneheight * 2 / row + sceneheight / row / 2 - height * 1.5;
      grid[i][j] = new Person(x, y, 12.5, color(255, 255, 255));
    }
  }
}

function draw() {
  background(0);
  back();
  if (millis() < 15000) {
    scene0(map(millis(), 0, 15000, 255, 0));
  }
  if (millis() > 2500 && millis() < 15000) {
    scene1();
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

function scene1() {
  // background(0);
  noStroke();
  fill(255);
  if(time === 0) time = millis() + 1000;
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      let op = millis() > 7500 ? map(millis(), 7500, 15000, 255, 0) : 255;
      grid[i][j].draw(op);
    }
  }
  if (millis() > time) {
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        grid[i][j].march(75);
      }
    }
    time += 1000;
  }
}
