window.registerP5Sketch((p) => {
  const colorOrange = '#F56324';
  let assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  let player = new Tone.Player(
    assetsUrl + '/sound/kill_bill_whistle_short.mp3'
  );
  player.toDestination();

  let fft = new Tone.FFT();
  player.connect(fft);
  let buttonStyle = `
      display: block;
      padding: 20px;
      background-image:url("${assetsUrl}/img/play.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 50%;
      background-color: white;
  `;

  function togglePlay() {
    if (player.state == 'started') {
      player.stop();
    } else {
      player.start();
    }

    if (player.state === 'stopped') {
      playBtn.style(`background-image:url("${assetsUrl}/img/play.png")`);
    } else {
      playBtn.style(`background-image:url("${assetsUrl}/img/pause.png")`);
    }
  }

  p.preload = () => {
    //font = loadFont('../../../assets/fonts/fg-virgil.ttf');
  };

  p.setup = () => {
    p.createCanvas(150, 240);

    playBtn = p.createButton('');
    playBtn.style(buttonStyle);
    playBtn.mouseReleased(togglePlay);
    playBtn.position(0, p.height - 50);
    //p.textFont(font);
    p.textSize(12);

    // fft = new Tone.FFT(128);
    // player.connect(fft);
  };

  // let fmin = Infinity;
  // let fmax = -Infinity;
  p.draw = () => {
    p.background(255);

    // Rectangle
    let w = 40;
    let h = p.height * 0.7;
    let x = 2;
    let y = 0;
    p.fill('white');
    p.stroke('black');
    p.rect(x, y, w, h);

    // Labels
    p.fill('black');
    p.noStroke();
    p.text('high pitch', x + w + 20, y + 20);
    p.text('low pitch', x + w + 20, y + h - 20);

    if (player.state == 'started') {
      let frequencyData = fft.getValue();
      let max = -Infinity;
      let min = 0;
      let f;
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > max) {
          max = frequencyData[i];
          f = i;
        }
      }
      // console.log(f);
      // if(f < fmin) fmin = f;
      // if(f > fmax) fmax = f;

      //min max found empirically
      let fHeight = p.map(f, 50, 120, 0, h);
      fHeight = p.constrain(fHeight, 0, h);
      p.fill(colorOrange);
      p.noStroke();
      // Bar
      // rect(x, y+h-fHeight, w, fHeight);
      // Line
      p.rect(x, y + h - fHeight, w, 4);
    }
  };
});
