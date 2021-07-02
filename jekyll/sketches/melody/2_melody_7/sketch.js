const player = new Tone.Player("../../../assets/sounds/kill_bill_whistle.mp3");
player.toDestination();
let frame = 0;
let fft = new Tone.FFT();
let pitchValues = [];
let fromcolour = '#f56a07';
let tocolour = '#c1ff7a'
let fmin = 0;
let fmax = 120;
let w = 800;
let h = 250;

let gridLines = 5;
let ystart = h-30;
let yend = 0 ;

player.connect(fft);

function preload(){
  font = loadFont('../../../assets/fonts/fg-virgil.ttf');
}



function setup() {
  createCanvas(800, 250);

  playBtn = createButton('');
  playBtn.position(width/2-20, height);
  playBtn.style('background-image:url(../../../assets/ui/play.png); background-position: center;background-repeat: no-repeat; background-size: 100%; border-radius: 50%; width:40px; height:40px; background-color:white');
  playBtn.mouseReleased(togglePlay);

  textFont(font);
  textSize(12);

  // fft = new Tone.FFT(128);
  // player.connect(fft);
  //drawing grid lines 

}

// let fmin = Infinity;
// let fmax = -Infinity;
function draw(){
  background(255);
  if(player.state == "stopped"){
    playBtn.style('background-image:url(../../../assets/ui/play.png)');
  }
  else{
    playBtn.style('background-image:url(../../../assets/ui/pause.png)');
  }
  makeGrid(ystart,yend,'y',5)
  makeGrid(2,w,'x',10)
  // Whole canvas
  // let w = width;
  // let h = height;
  // let x = 0;
  // let y = 0; 
  
  // Rectangle

  let x = (width-w)/2;
  let y = (height-h)/2;

  // Labels

  if(player.state == "started"){
    let frequencyData = fft.getValue();
    let max = -Infinity;
    let min = 0;
    let f;
    frame++;
    //TODO: use ml pitch detection
    for (let i = 0; i < frequencyData.length; i++) {
      if(frequencyData[i] > max){
        max = frequencyData[i];
        f = i;
      } 
    }
    let fHeight = map(f, fmin ,fmax, ystart, yend,true);
    console.log('fHeight',fHeight)
    pitchValues.push(fHeight);
    for(let i = 0;i<pitchValues.length;i++) {
        y1 = pitchValues[i-1];
        y2 = pitchValues[i];
        x1 = map(i,0,3000,0,w);
        x2 = map(i+1,0,3000,0,w);
        //let linecolour = lerpColor(fromcolour, tocolour, pitchValues[i]*0.3);

        //console.log('coordinates',y1,y2,x1,x2);
        strokeWeight(1);
        stroke("#ff8d01");
        line(x1, y1, x2, y2);
    }
    if (frame > 1) {
      push()
        fill("#FFFFFF");
        strokeWeight(2);
        stroke("#000000");
        let y = pitchValues[pitchValues.length-1];
        ellipse(map(frame,0,3000,0,w), y, 7, 7);
        pop();
    }
  }
  


}

function makeGrid(start,end,direction,count) {
  console.log('MAKE GRID',count)
  for(let i=0;i<count; i++) {
    let position;
    if(i == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(0.5);
      stroke("#000000");
    }
    if(direction == 'x') {
      position = start + i*(Math.abs((end-start))/count);
      line(position, ystart, position, yend);
      push()
        noStroke();
        text(round(map(position-2,0,w,0,3000)/24,1),position,ystart+20);
      pop()
      if(i == 0) {
        push()
          noStroke();
          text('pitch',position-5,yend+20);
        pop()
      }
    }
    if(direction == 'y') {
      position = start - i*(Math.abs((end-start))/count);
      console.log('POS',position)
      stroke("#000000");
      line(0, position, 3000, position);
      if(i == 0) {
        push()
          noStroke();
          text('time',w,position);
        pop()
      }
    }
    
  }
}
function togglePlay(){
  if(player.state == "started"){
    player.stop();
  }
  else{
    frame = 1;
    pitchValues = [0];
    player.start();
  }
}


