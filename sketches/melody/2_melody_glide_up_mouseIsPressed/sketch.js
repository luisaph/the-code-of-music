// Press the mouse to hear tone move up the spiral


// Audio
let osc;
let minFreq = 200;
let maxFreq = 2000;
let freq = minFreq;
let vol = 0.1;

// Drawing (Spiral)
let x, y, h;
let r = 40;
let rotations = 5;
let pointsPerRotation = 40;
let angleIncrement;

// Interface
let instructions = true;

function preload(){
  font = loadFont('../../../assets/fonts/fg-virgil.ttf');
}

function setup() {
  let myCanvas = createCanvas(620, 400);
  colorMode(HSB, 360, 100, 100);
  textFont(font);
  textSize(16);

  osc = new Tone.Oscillator(freq, "sine");
  osc.toDestination();
  osc.volume.value = -10;


  x = width / 2;
  h = ySpiral(rotations * TWO_PI) - ySpiral(0);
  y = (height - h) / 2;

  background(255);
  stroke(0);

  // Draw Spiral
  strokeWeight(1);
  translate(x, y);
  beginShape();
  angleIncrement = TWO_PI / pointsPerRotation;
  for (var a = 0; a < TWO_PI * rotations; a += angleIncrement) {
    var point = createVector(xSpiral(a), ySpiral(a));
    noFill();
    vertex(point.x, point.y);
  }
  endShape();
  noStroke();
}

// point in the spiral
let p = 0;
let step = 0;
let fr = minFreq;

// uncomment advance() to add an ellipse per click (+ comment call to advance() on draw())
function mousePressed(){
  // advance();
  instructions = false;
}

function mouseReleased() {
  osc.stop();
  instructions = true;
}


function draw(){
  // erase text area
  fill(255);
  rect(0, 0, width, 60);

  fill('blue');
  noStroke();
  
  let txt = "Press the mouse to play tones";
  let txtX = (width-textWidth(txt))/2;
  if(instructions){
    text(txt, txtX, 40)
  }

  if(mouseIsPressed){
    advance();
    // instructions = false;
  }

}

// See minimal test of advance (just adding circles to the spiral by clicking) here: https://editor.p5js.org/luisa/sketches/FbyJpx4i4
function advance(){
  
  let point = createVector(xSpiral(p), ySpiral(p));
  fill(degrees(p%TWO_PI), 100, 100);
  translate(x, y);
  ellipse(point.x, point.y, 10, 10);
  noStroke();

  fr = f(minFreq, step);
  osc.frequency.value = fr;

  p += angleIncrement;
  step += 1;

  Tone.context.resume();
  if(osc.state != "started"){
    osc.start();
  }
}

function f(fmin, step){
  return fmin*pow(2, step/pointsPerRotation);
}

function xSpiral(t) {
  return r * 1.5 * sin(t);
}

function ySpiral(t) {
  return r * cos(t) - t * 4;
}
