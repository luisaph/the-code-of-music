// const player = new Tone.Player(
//   '/assets/sounds/kill_bill_whistle.mp3'
// ).toMaster();
const ASSETS_URL = '/assets/img/';
const synth = new Tone.Synth().toDestination();
function setup() {
  playBtn = createButton('');
  playBtn.style(`
    display: block;
    padding: 20px;
    background-image:url("${ASSETS_URL}play.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 50%;
    background-color:white
  `);
  playBtn.mouseReleased(() => {
    synth.triggerAttackRelease('A3', 1);
  });
  createCanvas(200, 200);
  console.log('setup');
  fill(0);
  rect(0, 0, width, height);
}
function draw() {
  fill((sin(frameCount / 10) + 0.5) * 255);
  rect(0, 0, width, height);
}
