// const player = new Tone.Player("assets/sounds/kill_bill_whistle.mp3").toMaster();
let c;
let playBtn;
let synth = new Tone.Synth().toDestination();
function setup() {
    c = createCanvas(600, 600);
  let rc = roughjs.canvas(c.elt);
  console.log('setup');
  playBtn = createButton('');
  playBtn.style('background-image:url(assets/ui/play.png); background-position: center;background-repeat: no-repeat; background-size: 100%; border-radius: 50%; width:40px; height:40px; background-color:white');
  playBtn.mouseReleased(togglePlay);
  let generator = rc.generator;
  rc.circle(50, 50, 80, { fill: 'red' });
  rc.rectangle(10, 10, 200, 200);
  synth.triggerAttackRelease('A3');
}
function draw() {
  //fill((sin(frameCount / 10) + 0.5) * 255);
  //rect(0, 0, width, height);
}
function togglePlay() {
    synth = new Tone.Synth().toDestination();
    //Tone.start();
    const now = Tone.now()
    // trigger the attack immediately
    synth.triggerAttack("C4", now)
    // wait one second before triggering the release
    synth.triggerRelease(now + 1)
}