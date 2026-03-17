let col = 5, row = 5;

let scanY = 0;        // scan line
let scanHeight = 50;  // the "height" of the scan line
let scanParticles = [];
let scanBase, scanSpeed;

function nextScene() {
  if (scanY > height + scanHeight) return true;
  else return false;
}

function setup() {
  scanBase = height * 0.018;
  scanSpeed = scanBase * 1.5;
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
  for (let i = 0; i < col; ++i) {
    grid[i] = [];
    for (let j = 0; j < row; ++j) {
      let x = scene1_x + i / 1.5 * scenewidth / col + (7.0 / 3) * scenewidth / col / 2;
      let y = scene1_y + j * sceneheight / row + sceneheight / row / 2;
      grid[i][j] = new Person(x, y, 12.5, color(255, 255, 255));
    }
  }
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      let p = grid[i][j];
      p.targetX = p.x;
      p.targetY = p.y;
      p.startX = p.targetX + random(-20, 20);
      p.startY = -random(100, 300);
      p.x = p.startX;
      p.y = p.startY;
      p.startTime = random(2500, 5000);
      p.duration = random(5000, 7500);
      p.easePow = random(2.2, 3.2);
    }
  }
  //First they came for the Communists—
  grid[0][1].changeGroup("Communists", color(255, 0, 0));
  grid[1][1].changeGroup("Communists", color(255, 0, 0));
  grid[1][2].changeGroup("Communists", color(255, 0, 0));
  grid[2][1].changeGroup("Communists", color(255, 0, 0));
  grid[3][0].changeGroup("Communists", color(255, 0, 0));
  grid[4][0].changeGroup("Communists", color(255, 0, 0));
  //Then they came for the Socialists—
  grid[2][3].changeGroup("Socialists", color(225, 21, 132));
  grid[3][1].changeGroup("Socialists", color(225, 21, 132));
  grid[3][2].changeGroup("Socialists", color(225, 21, 132));
  grid[3][3].changeGroup("Socialists", color(225, 21, 132));
  grid[4][1].changeGroup("Socialists", color(225, 21, 132));
  grid[4][2].changeGroup("Socialists", color(225, 21, 132));
  grid[4][3].changeGroup("Socialists", color(225, 21, 132));
  //Then they came for the Trade Unionists—
  grid[0][0].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[0][3].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[0][4].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[1][0].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[1][3].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[1][4].changeGroup("Trade Unionists", color(255, 170, 0));
  grid[2][4].changeGroup("Trade Unionists", color(255, 170, 0));
  //Then they came for me—
  grid[2][2].changeGroup("Me", color(224, 224, 224));
}

function draw() {
  background(0);
  back();
  // if (millis() < 15000) {
  //   scene0(map(millis(),0,15000,255,0));
  // }
  drawTime();
  scene0(map(constrain(millis(), 0, 12500), 0, 12500, 255, 64)); // the cross
  if (millis() > 2500) {
    scene1();
  }
  //And I did not speak out, because I was not a Communist;
  if (millis() > 10000 && !triggeredScenes["Communists"]) {
    activeScene = "Communists";
    triggeredScenes["Communists"] = true;
    scene2(activeScene, true);
  } else if (activeScene === "Communists") {
    scene2(activeScene);
  }
  //And I did not speak out, because I was not a Socialist;
  if (millis() > 20000 && !triggeredScenes["Socialists"] && nextScene()) {
    activeScene = "Socialists";
    triggeredScenes["Socialists"] = true;
    scene2(activeScene, true);
  } else if (activeScene === "Socialists") {
    scene2(activeScene);
  }
  //And I did not speak out, because I was not a Trade Unionist;
  if (millis() > 30000 && !triggeredScenes["Trade Unionists"] && nextScene()) {
    activeScene = "Trade Unionists";
    triggeredScenes["Trade Unionists"] = true;
    scene2(activeScene, true);
  } else if (activeScene === "Trade Unionists") {
    scene2(activeScene);
  }
  //M A S S A C R E
  if (millis() > 42500 && !triggeredScenes["none"] && nextScene()) {
    scanSpeed = scanBase * 2.25;
    elimInterval = 175;
    for (let i = 0; i < col; ++i) {
      for (let j = 0; j < row; ++j) {
        let p = grid[i][j];
        if (i != 2 || j != 2) {
          p.scanned = false;
          p.group = "none";
          p.status = "secure"
          p.fragments = [];
          p.fade = 0;
          p.destroyStarted = false;
        }
      }
    }
    activeScene = "none";
    triggeredScenes["none"] = true;
    scene2(activeScene, true);
  } else if (activeScene === "none") {
    scene2(activeScene);
  }
  //And there was no one left
  //To speak out for me
  if (millis() > 52500 && !triggeredScenes["Me"]) {
    scanSpeed = scanBase * 1;
    targetInterval = 1250;
    activeScene = "Me";
    triggeredScenes["Me"] = true;
    scene2(activeScene, true);
  } else if (activeScene === "Me") {
    scene2(activeScene);
  }
}

function scene1() {
  noStroke();
  for (let i = 0; i < col; ++i) {
    for (let j = 0; j < row; ++j) {
      let p = grid[i][j];
      let t = map(millis(), p.startTime, p.startTime + p.duration, 0, 1);
      t = constrain(t, 0, 1);
      t = 1 - pow(1 - t, p.easePow); //fast-to-slow easing
      p.x = map(t, 0, 1, p.startX, p.targetX);
      p.y = map(t, 0, 1, p.startY, p.targetY);
      p.draw();
    }
  }
}

function scene2(group, resetScan = false) {
  if (resetScan) {
    scanY = 0;
  }
  killUpdate();
  // for (let i = 0; i > -scanHeight; --i) {
  //   let opacity = map(i, 0, -scanHeight, 255, 0);
  //   fill(255, opacity);
  //   noStroke();
  //   rect(0, scanY + i, width, 1);
  // }
  drawScanParticles();
  let scanTop = scanY;
  let scanBottom = scanY - scanHeight;
  for (let i = 0; i < col; ++i) {
    for (let j = 0; j < row; ++j) {
      let p = grid[i][j];
      if (!p.scanned && p.group === activeScene
        && p.y <= scanTop && p.y >= scanBottom) {
        elimQueue.push(p);
        p.scanned = true;
      }
    }
  }
  scanY += scanSpeed;
}