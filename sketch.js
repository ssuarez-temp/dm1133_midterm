let col = 5, row = 5;

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
      let y = scene1_y + j * sceneheight / row + sceneheight / row / 2;

      grid[i][j] = new Person(x, y, 12.5, color(255,255,255));
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {

      let p = grid[i][j];

      p.targetX = p.x;
      p.targetY = p.y;

      p.startX = p.targetX + random(-20,20);
      p.startY = -random(100,300);

      p.x = p.startX;
      p.y = p.startY;

      p.startTime = random(1000,4000);

      p.duration = random(5000,10000);

      p.easePow = random(2.2,3.2);
    }
  }

  grid[0][1].c = color(255, 0, 0);
  grid[1][1].c = color(255, 0, 0);
  grid[1][2].c = color(255, 0, 0);
  grid[3][0].c = color(255, 0, 0);
  grid[4][0].c = color(255, 0, 0);

  grid[3][2].c = color(225, 21, 132);
  grid[3][3].c = color(225, 21, 132);
  grid[4][2].c = color(225, 21, 132);
  grid[4][3].c = color(225, 21, 132);

  grid[0][4].c = color(255, 170, 0);
  grid[1][4].c = color(255, 170, 0);
  grid[2][4].c = color(255, 170, 0);
  grid[3][4].c = color(255, 170, 0);

  grid[2][2].c = color(255, 255, 255, 224);
}

function draw() {

  background(0);
  back();

  // if (millis() < 15000) {
  //   scene0(map(millis(),0,15000,255,0));
  // }

  scene0(map(millis(),0,15000,255,64));

  if (millis() > 1000) {
    scene1();
  }
}

function scene1(){

  noStroke();

  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {

      let p = grid[i][j];

      let t = map(millis(), p.startTime, p.startTime + p.duration, 0, 1);
      t = constrain(t,0,1);

      t = 1 - pow(1 - t, p.easePow);

      p.x = map(t,0,1,p.startX,p.targetX);
      p.y = map(t,0,1,p.startY,p.targetY);

      p.draw();
    }
  }

}