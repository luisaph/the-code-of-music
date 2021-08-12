// const player = new Tone.Player("assets/sounds/kill_bill_whistle.mp3").toMaster();
const synth = new Tone.Synth().toDestination();
function setup() {
  createCanvas(200, 200);
  console.log('setup');
  fill(0);
  rect(0, 0, width, height);
  synth.triggerAttackRelease('A3');
}
function draw() {
  fill((sin(frameCount / 10) + 0.5) * 255);
  rect(0, 0, width, height);
}
