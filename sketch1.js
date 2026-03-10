let col = 5, row = 10;

function setup() {
  noStroke();
  createCanvas(windowWidth, windowHeight);
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
      let x = scene1_x + i / 1.5 * scenewidth / col + (7.0 / 3) * scenewidth / col / 2;
      let y = scene1_y + j * 2 * sceneheight / row + sceneheight / row / 2 - height * 1.5;
      grid[i][j] = new Person(x, y, 12.5, color(255, 255, 255));
    }
  }
}

function draw() {
  background(0);
  back();
  if (millis() < 10000) {
    scene0(map(millis(), 0, 10000, 255, 0));
  }
  if (millis() > 1500 && millis() < 12500) {
    scene1();
  }
}

function scene1() {
  // background(0);
  noStroke();
  fill(255);
  if(time === 0) time = millis() + 1000;
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      let op = millis() > 7500 ? map(millis(), 7500, 12500, 255, 0) : 255;
      grid[i][j].draw(op);
      // grid[i][j].draw();
    }
  }
  if (millis() > time) {
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < row; j++) {
        grid[i][j].march(height / 10);
      }
    }
    time += 1000;
  }
}