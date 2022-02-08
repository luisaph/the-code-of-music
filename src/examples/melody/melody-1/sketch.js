window.registerP5Sketch((p) => {
  const colorPrimary = '#ff3100';
  const sketchHeight = 250;
  const barHeight = 15;

  let assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  let player = new Tone.Player(
    `${assetsUrl}/sound/kill_bill_whistle_short.mp3`
  );

  let fft = new Tone.FFT();

  player.connect(fft);
  player.toDestination();

  p.setup = () => {
    const pad = 10;
    p.createCanvas(p.windowWidth, sketchHeight);

    p.createSpan('high pitch').class('centered').position(0, pad);
    p.createSpan('low pitch')
      .class('centered')
      .position(0, p.height - 20 - pad);

    const playBtn = p.createButton('');
    playBtn.class('play-button');
    playBtn.mouseReleased(() => {
      if (player.state == 'started') {
        player.stop();
        playBtn.removeClass('play-button--stop');
      } else {
        player.start();
        playBtn.addClass('play-button--stop');
      }
    });
    playBtn.position(pad, p.height - 56);

    /* Custom load handler */
    if (p.onLoaded) {
      p.onLoaded();
    }
  };

  p.draw = () => {
    const w = p.width;
    const h = p.height;
    p.background(255);
    p.noStroke();

    if (player.state === 'started') {
      let frequencyData = fft.getValue();
      let max = -Infinity;
      let f;
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > max) {
          max = frequencyData[i];
          f = i;
        }
      }
      let fHeight = p.map(f, 50, 120, 0, h);
      fHeight = p.constrain(fHeight, 0, h);

      p.fill(colorPrimary);
      p.rect(0, h - fHeight - barHeight / 2, w, barHeight);
    }
  };
});
