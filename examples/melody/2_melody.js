// canvas, rough canvas
let c;
let rc;
let circle1, line1;
let m; //margin
let x, y, w, h;

let startBtn;

let font;
let instructions = true;


// Audio
let freq = 440; // current frequency (updated by slider)
let minFreq = 20;
let maxFreq = 20000;
let notePosX = 0;

function preload(){
  //font = loadFont('../../../assets/fonts/fg-virgil.ttf');
}

function setup(){
  c = createCanvas(620, 200);
  // c = createCanvas(windowWidth, windowHeight);
  rc = roughjs.canvas(c.elt);
  //textFont(font);
  textSize(16);

  m = width/10;
  x = 80,
  y = height / 2;
  w = width - 2 * x;
  let generator = rc.generator;
  //rc.rectangle(10, 10, 200, 200); // x, y, width, height

  /*line1 = generator.line(0, 0, w, 0, 
                              { stroke:"black",
                                roughness: 0.4 });

  circle1 = generator.ellipse(0, 0, 16, 16, 
                              { fill: "rgba(0,0,255,0.4)", 
                                stroke: "blue",
                                fillStyle: "solid",
                                roughness: 0.5 });*/

  // startBtn = createButton('start')
  // startBtn.position(0, 0);
  // startBtn.mousePressed(play);

  freq = 440;
  osc = new Tone.Oscillator(freq, "sine");
  osc.toDestination();
  osc.volume.value = -15;
  
}

function draw(){
  background(255);
  translate(x, y);
  let txt = "4" + " Hz";
  fill("black");
  text(txt, w - 4, height/4);
  //rect(10,10,200,200);
  rc.rectangle(10, 10, 20, 20);
  rc.circle(50, 50, 80);
  //rc.draw(line1);
  // maybe two small vertical lines to cap horizontal line
  translate(notePosX, 0);
  
  if(instructions){
    fill("blue");
    text("drag to play tones", -10, -20);
  }
  //rc.draw(circle1);
}

function mouseDragged() {
  Tone.context.resume();
  if(osc.state != "started"){
    console.log("starting")
    osc.start();
  }
  //frequency slider
  if (x < mouseX &&
    mouseX < x + w &&
    0 < mouseY &&
    mouseY < height) {
    notePosX = mouseX - x;
  
    freq = map(notePosX, 0, w, minFreq, maxFreq);
    osc.frequency.value = freq;
  }
  instructions = false;
}

function mouseReleased() {
  osc.stop();
  instructions = true;
}

// function play() {
//   if (oscOn) {
//     osc.stop();
//     startBtn.html("start");
//   } else {
//     osc.start();
//     startBtn.html("stop");
//   }
//   oscOn = !oscOn;
// }
