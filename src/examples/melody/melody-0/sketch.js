window.registerP5Sketch((p) => {
  const sketchHeight = 60;

  let assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  let player = new Tone.Player(
    `${assetsUrl}/sound/kill_bill_whistle_short.mp3`
  );

  player.toDestination();

  function togglePlay() {
    if (player.state == 'started') {
      player.stop();
    } else {
      player.start();
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, sketchHeight);

    const pad = 10;
    const playBtn = p.createButton('');
    playBtn.class('play-button');
    playBtn.mouseReleased(togglePlay);
    playBtn.position(pad, 8);

    p.background(255);

    /* Custom load handler */
    if (p.onLoaded) {
      p.onLoaded();
    }
  };

  p.draw = () => {
    p.background(255);
    p.noLoop();
  };
});
