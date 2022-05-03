// Try "triangle", "square", and "sawtooth"
let osc = new Tone.Oscillator(440);
osc.toDestination();
osc.volume.value = -Infinity;
osc.start();

// Ball
let x;
let y;

function setup() {
  createCanvas(200, 200);
  x = width / 2;
  y = height / 2;
}

function draw() {
  background(0);
  ellipse(x, y, 50, 50);
}

function mouseDragged() {
  if (Tone.state != 'started') {
    Tone.start();
  }

  // note: ideally, the mapping of mouseX to volume and mouseY to frequency
  // would be on a log scale - see Elements of Sound chapter

  let volume = map(mouseX, 0, width, -100, 0);
  osc.volume.rampTo(volume, 0.1);

  let frequency = map(mouseY, 0, height, 880, 440);
  osc.frequency.rampTo(frequency, 0.1);

  // update ellipse position for drawing
  x = mouseX;
  y = mouseY;
}

function mouseReleased() {
  osc.volume.rampTo(-Infinity);
}
