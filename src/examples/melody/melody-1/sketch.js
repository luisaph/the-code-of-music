window.registerP5Sketch((p) => {
  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  let c;
  let rc;
  let frame = 0;
  let pitchValues = [];
  let fromcolour = '#f56a07';
  let tocolour = '#c1ff7a';
  let fmin = 0;
  let fmax = 120;
  let w = 800;
  let h = 250;

  let gridLines = 5;
  let ystart = h - 30;
  let yend = 0;
  let xstart = 20;
  let xend = w - xstart;
  let currentValue = 0;
  let startTime = 0;
  let currentPlayTime = 0;
  //images
  let playBtn;
  let graph, pitchgrid, timegrid, timepitchgrid, measure, pitchLine, timeLine;
  let audio = new Tone.Player(assetsUrl + '/sound/whistle.mp3');
  audio.toDestination();
  let isPlaying = false;

  let state = {
    time: false,
    pitch: false,
  };
  let showtimebtn, actshowtimebtn;
  let showpitchbtn, actshowpitchbtn;

  p.preload = function () {
    //font = p.loadFont('../../../assets/fonts/fg-virgil.ttf');
    graph = p.loadImage(assetsUrl + '/img/grid.png');
    pitchgrid = p.loadImage(assetsUrl + '/img/pitchgrid.png');
    timegrid = p.loadImage(assetsUrl + '/img/timegrid.png');
    timepitchgrid = p.loadImage(assetsUrl + '/img/timepitchgrid.png');
    measure = p.loadImage(assetsUrl + '/img/measure.png');
    showtimebtn = p.loadImage(assetsUrl + '/img/showtime.png');
    showpitchbtn = p.loadImage(assetsUrl + '/img/showpitch.png');
    actshowtimebtn = p.loadImage(assetsUrl + '/img/showtimeactive.png');
    actshowpitchbtn = p.loadImage(assetsUrl + '/img/showpitchactive.png');
    pitchLine = p.loadImage(assetsUrl + '/img/pitch.png');
    timeLine = p.loadImage(assetsUrl + '/img/time.png');
  };
  p.setup = () => {
    c = p.createCanvas(800, 480);
    playBtn = p.createButton('');
    playBtn.position(0, p.height - 40);
    playBtn.style(
      `background-image:url("${assetsUrl}/img/play.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 50%;
      width:40px;
      height:40px;
      background-color:white`
    );
    playBtn.mouseReleased(togglePlay);
    //p.textFont(font);
    p.textSize(12);
  };

  p.draw = () => {
    p.background(255);
    p.imageMode(p.CORNER);
    pickButton();
    pickImage();
    p.image(
      pitchLine,
      0,
      graph.height / 2 - 90,
      30,
      (pitchLine.height * 30) / pitchLine.width + 100
    );
    //p.image(timeLine, 20, graph.height, (timeLine.width*2/timeLine.height)+100, 2);
    if (audio.state == 'stopped') {
      playBtn.style(`"background-image:url("${assetsUrl}/img/play.png")"`);
    } else {
      playBtn.style(`"background-image:url("${assetsUrl}/img/pause.png")"`);
      console.log('wwhy?');
      console.log('currentTime', currentPlayTime);
      currentPlayTime++;
    }

    p.push();
    p.noStroke();
    p.fill('rgba(176,221,49, 0.2)');
    let currentTime = currentPlayTime;
    //let currentTime = audio.currentTime();
    let rectWidth = p.map(currentTime, 0, 745, 0, p.width);
    p.rect(xstart, 125, rectWidth, graph.height - 100);

    p.pop();
  };

  function togglePlay() {
    if (!isPlaying) {
      isPlaying = true;
      if (currentPlayTime == 0) {
        startTime = p.frameCount;
      }
      audio.start();
    } else {
      isPlaying = false;
      audio.stop();
    }
  }

  p.mousePressed = () => {
    if (
      p.mouseX > xstart &&
      p.mouseX < xstart + showtimebtn.width &&
      p.mouseY > 0 &&
      p.mouseY < showtimebtn.height
    ) {
      state.time = !state.time;
    }

    if (
      p.mouseX > xstart &&
      p.mouseX < xstart + showtimebtn.width &&
      p.mouseY > showtimebtn.height &&
      p.mouseY < 2 * showtimebtn.height
    ) {
      state.pitch = !state.pitch;
    }
  };

  function pickButton() {
    if (!state.time) {
      p.image(
        showtimebtn,
        xstart,
        0,
        100,
        (showtimebtn.height * 100) / showtimebtn.width
      );
    }
    if (state.time) {
      p.image(
        actshowtimebtn,
        xstart,
        0,
        100,
        (showpitchbtn.height * 100) / showpitchbtn.width
      );
    }
    if (!state.pitch) {
      p.image(
        showpitchbtn,
        xstart,
        showtimebtn.height,
        100,
        (showpitchbtn.height * 100) / showpitchbtn.width
      );
    }
    if (state.pitch) {
      p.image(
        actshowpitchbtn,
        xstart,
        showtimebtn.height,
        100,
        (showpitchbtn.height * 100) / showpitchbtn.width
      );
    }
  }
  function pickImage() {
    let yPos = 2 * showtimebtn.height + 70;
    if (state.time && state.pitch) {
      p.image(
        timepitchgrid,
        xstart,
        yPos,
        p.width - xstart,
        (graph.height * (p.width - xstart)) / graph.width
      );
    }
    if (!state.time && !state.pitch) {
      p.image(
        graph,
        xstart,
        yPos,
        p.width - xstart,
        (graph.height * (p.width - xstart)) / graph.width
      );
    }
    if (state.time && !state.pitch) {
      p.image(
        timegrid,
        xstart,
        yPos,
        p.width - xstart,
        (graph.height * (p.width - xstart)) / graph.width
      );
      //p.image(measure, xstart, graph.height-75, p.width, measure.height*(p.width-xstart)/measure.width);
    }
    if (!state.time && state.pitch) {
      p.image(
        pitchgrid,
        xstart,
        yPos,
        p.width - xstart,
        (graph.height * (p.width - xstart)) / graph.width
      );
    }
  }
});
