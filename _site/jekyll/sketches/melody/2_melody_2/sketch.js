let fmin = 100; 
let fmax = 2000;
let osc = new Tone.Oscillator(fmin, "sine");
osc.toDestination();
osc.volume.value = -10;

let helix;
let point;

// Interface
let instructions = true;

function preload(){
  font = loadFont('../../../assets/fonts/fg-virgil.ttf');
}



function setup() {
  // Drawing
  let myCanvas = createCanvas(620, 400);
  colorMode(HSB, 360, 100, 100);
  textFont(font);
  textSize(16);
  background(100);

  // Draw from the bottom up
  helix = new Helix(width/2, height-140, 40, 6, 40);
  
}

function draw() {
  background('white');
  if(instructions){
    noStroke();
    fill("black");
    let txt = "drag up and down to play tones"
    text(txt, (width - textWidth(txt))/2, 40);
  }
  helix.draw();
  if(point){
    helix.drawPoint(point);  
  }
  fill('black');
  let txt = round(osc.frequency.value) + " Hz"
  text(txt, (width - textWidth(txt))/2, height-60);
}

function mouseDragged() {
  Tone.context.resume();
  if(osc.state != "started"){
    osc.start();
  }
  instructions = false;

  if (helix.isOverY(mouseY)){
    let i = floor(map(mouseY, helix.bounds.bottom, helix.bounds.top, 0, helix.points.length));
    
    // Constrain
    if(i > helix.points.length) i = helix.points.length;
    if(i < 0) i = 0;

    point = helix.points[i];
    console.log('point.i', point.i);
    console.log('pointsPerTurn', helix.pointsPerTurn);
    fr = f(fmin, point.i, helix.pointsPerTurn);
    console.log('fr', fr);
    osc.frequency.value = fr;
  }
}

function mouseReleased() {
  osc.stop();
  instructions = true;
}

function f(fmin, step, stepsPerRotation){
  return fmin*pow(2, step/stepsPerRotation);
}



