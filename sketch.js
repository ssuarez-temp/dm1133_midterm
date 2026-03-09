let c;
let mouthAngle = 0;
let cheek = 1;
let browAngle = 0;

function setup() {
  createCanvas(800, 800);
  background(255);
  c = color(255, 220, 80);
}

function draw() {
  background(255);
  face(width / 2, height / 2, 220, c);
}

function face(cx, cy, d, c) {

  noStroke();
  fill(c);
  ellipse(cx, cy, d, d);

  //cheek
  ellipse(cx, cy + d * 0.15, d * cheek, d * cheek);
  //ellipse(cx, cy + d * 0.15, d * 1.05, d * 1.05);

  let eyeX = d * 0.22;
  let eyeY = d * 0.1;
  let eyeR = d * 0.18;
  let leftX = cx - eyeX;
  let rightX = cx + eyeX;
  let vertY = cy - eyeY;

  //eyes
  fill(255);
  eye(leftX, vertY, eyeR, PI - PI / 12, TWO_PI + PI / 12);
  eye(rightX, vertY, eyeR, PI - PI / 12, TWO_PI + PI / 12);

  //eyebrows
  stroke(5);
  line(leftX - d * 0.125 * cos(browAngle), vertY - d * 0.3 - d * 0.125 * sin(browAngle),
       leftX + d * 0.125 * cos(browAngle), vertY - d * 0.3 + d * 0.125 * sin(browAngle));
  line(rightX - d * 0.125 * cos(browAngle), vertY - d * 0.3 + d * 0.125 * sin(browAngle),
       rightX + d * 0.125 * cos(browAngle), vertY - d * 0.3 - d * 0.125 * sin(browAngle));

  //mouth
  //mouth(cx, cy + d * 0.025, d);

  //tongue
  //beginShape();
  //fill('#F9BEDD');
  //noStroke();
  //for (let a = -PI / 2 - atan(3.5 / 1.5); a <= -PI / 2 + atan(3.5 / 1.5); a += 0.005) {
  //  let x = cx + cos(a) * d * 0.15;
  //  let y = cy + d * 0.4 + sin(a) * d * 0.15;
  //  vertex(x, y);
  //}
  //endShape(CLOSE);

  //arcmouth
  noFill();
  strokeWeight(5);
  stroke(0);
  if (abs(mouthAngle) < 0.01) line(cx - d * 0.175, cy + 0.3 * d, cx + d * 0.175, cy + 0.3 * d);
  else if (mouthAngle > 0) {
    arc(cx, cy + 0.3 * d, d * 0.35, d * mouthAngle, 0, PI);
  } else {
    arc(cx, cy + 0.3 * d, d * 0.35, d * -mouthAngle, PI, TWO_PI);
  }

}

function eye(cx, cy, r, start, end) {

  //sclera
  fill(255);
  //stroke(0);
  //strokeWeight(r * 0.1);
  beginShape();
  strokeJoin(ROUND);
  for (let a = start; a <= end; a += 0.05) {
    let x = cx + cos(a) * r;
    let y = cy + sin(a) * r;
    vertex(x, y);
  }
  endShape(CLOSE);

  //pupil
  fill(0);
  noStroke();
  let pupilR = r * 0.5;
  let innerR = r - pupilR * 1;
  let dx = mouseX - cx;
  let dy = mouseY - cy;
  let dR = sqrt(dx * dx + dy * dy);
  if (dR > innerR) {
    dx = dx / dR * innerR;
    dy = dy / dR * innerR;
  }
  if (dy > sin(start) * r - (r - pupilR * 1.5)) dy = sin(start) * r - (r - pupilR * 1.5);
  fill(0);
  ellipse(cx + dx, cy + dy, pupilR, pupilR);

}

function mouth(cx, cy, d) {
  fill(255);
  beginShape();
  fill('#871945');
  noStroke();
  //stroke(0);
  //strokeWeight(d * 0.025);
  strokeJoin(ROUND);
  for (let a = 0; a <= PI; a += 0.005) {
    let x = cx + cos(a) * d * 0.35;
    let y = cy + sin(a) * d * 0.35;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function mousePressed() { //left click to change color
  c = color(random(255), random(255), random(255));
  if (mouseButton === RIGHT) { //right click to reset everything
    c = color(255, 220, 80);
    mouthAngle = 0;
    browAngle = 0;
  }
  print("(" + red(c) + ", " + green(c) + ", " + blue(c) + ")");
}

function mouseWheel(event) { //use wheel to change lips
  let delta = event.delta * 0.0005;
  mouthAngle += delta;
  mouthAngle = constrain(mouthAngle, -0.3, 0.3);
  print(mouthAngle);
}

function keyPressed() { //use up and down keys to change expression
  if (keyCode === UP_ARROW) {
    cheek += 0.01;
    browAngle += PI / 30;
  } else if (keyCode === DOWN_ARROW) {
    cheek -= 0.01;
    browAngle -= PI / 30;
  }
  cheek = constrain(cheek, 0.95, 1.05);
  browAngle = constrain(browAngle, -PI / 6, PI / 6);
  print(int(cheek));
  print(int(browAngle / PI * 180) + " degrees");
}