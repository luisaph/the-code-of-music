const player = new Tone.Player("../../../assets/sounds/kill_bill_whistle.mp3");
player.toDestination();

let fft = new Tone.FFT();
player.connect(fft);

function preload(){
  font = loadFont('../../../assets/fonts/fg-virgil.ttf');
}



function setup() {
  createCanvas(620, 200);

  playBtn = createButton('');
  playBtn.position(width/2-20, height);
  playBtn.style('background-image:url(../../../assets/ui/play.png); background-position: center;background-repeat: no-repeat; background-size: 100%; border-radius: 50%; width:40px; height:40px; background-color:white');
  playBtn.mouseReleased(togglePlay);

  textFont(font);
  textSize(12);

  // fft = new Tone.FFT(128);
  // player.connect(fft);


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

  // Whole canvas
  // let w = width;
  // let h = height;
  // let x = 0;
  // let y = 0; 
  
  // Rectangle
  let w = 40;
  let h = 120;
  let x = (width-w)/2;
  let y = (height-h)/2;
  fill('white');
  stroke('black');
  rect(x, y, w, h);

  // Labels
  fill('black');
  noStroke();
  text("high pitch", x + w + 20, y + 20);
  text("low pitch", x + w + 20, y + h - 20);

  if(player.state == "started"){
    let frequencyData = fft.getValue();
    let max = -Infinity;
    let min = 0;
    let f;
    for (let i = 0; i < frequencyData.length; i++) {
      if(frequencyData[i] > max){
        max = frequencyData[i];
        f = i;
      } 
    }
    // console.log(f);
    // if(f < fmin) fmin = f;
    // if(f > fmax) fmax = f;
    

    //min max found empirically
    let fHeight = map(f, 50, 120, 0, h);
    fHeight = constrain(fHeight,0, h);
    fill('#fd7e14');
    noStroke();
    // Bar
    // rect(x, y+h-fHeight, w, fHeight);
    // Line
    rect(x, y+h-fHeight, w, 4);
  }
  


}

function togglePlay(){
  if(player.state == "started"){
    player.stop();
  }
  else{
    player.start();
  }
}


