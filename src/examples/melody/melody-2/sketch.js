window.registerP5Sketch((p) => {
  const colorPrimary = '#ff3100';
  const colorSecondary = '#176beb';
  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';

  let midiData, audioDuration;

  let showTimeGrid = false;
  let showNoteGrid = false;

  Midi.fromUrl(`${assetsUrl}/sound/kill_bill_whistle_short2.mid`).then(
    (data) => {
      midiData = data;

      const { endOfTrackTicks } = midiData.tracks[0];

      /* Duration of audio sample */
      const sPerTick = 60000 / (111.96 * 96);
      audioDuration = (endOfTrackTicks * sPerTick) / 1000;

      Tone.Transport.loop = true;
      Tone.Transport.loopEnd = audioDuration;

      const audio = new Tone.Player(`${assetsUrl}/sound/whistle_2.mp3`);
      audio.toDestination();
      audio.sync().start(0);
    }
  );

  p.setup = () => {
    c = p.createCanvas(800, 480);
    const playBtn = p.createButton('');
    playBtn.class('play-button mt-1');
    playBtn.mouseReleased(togglePlay);
    p.textSize(12);

    const showTimeGridBtn = p
      .createButton('Show Time Grid')
      .class('btn btn--toggle mt-1')
      .mousePressed(() => {
        showTimeGrid = !showTimeGrid;
      });

    const showNoteGridBtn = p
      .createButton('Show Note Grid')
      .class('btn btn--toggle mt-1')
      .mousePressed(() => {
        showNoteGrid = !showNoteGrid;
      });

    /* Custom load handler */
    if (p.onLoaded) {
      p.onLoaded();
    }
  };

  p.draw = () => {
    if (!midiData) return;

    const { endOfTrackTicks, notes } = midiData.tracks[0];
    const noteHeight = 30;
    const minNote = 84;
    const numLines = 6;

    p.background(255);
    p.stroke(0, 50);

    if (showTimeGrid) {
      for (let i = 0; i < p.width; i += p.width / numLines) {
        p.line(i, 0, i, p.height);
      }
    }

    if (showNoteGrid) {
      for (let i = 0; i < p.height; i += noteHeight) {
        p.line(0, i, p.width, i);
      }
    }

    const currentTime = Tone.Transport.seconds / audioDuration;

    notes.forEach(({ ticks, time, durationTicks, midi }, i) => {
      /* Don't show last note which is used to set the end time */
      if (i === notes.length - 1) return;

      const x = p.map(ticks, 0, endOfTrackTicks, 0, p.width);
      const y = p.height - (midi - minNote) * noteHeight;
      const w = p.map(durationTicks, 0, endOfTrackTicks, 0, p.width);

      var c = p.color(colorPrimary);

      if (currentTime > ticks / endOfTrackTicks) {
        c.setAlpha(255);
      } else {
        c.setAlpha(50);
      }

      p.fill(c);
      p.noStroke();
      p.rect(x, y, w, noteHeight);
    });

    const overlayC = p.color(colorSecondary);
    const rectWidth = p.map(currentTime, 0, 1, 0, p.width);

    overlayC.setAlpha(20);
    p.fill(overlayC);
    p.rect(0, 0, rectWidth, p.height);
    overlayC.setAlpha(100);
    p.fill(overlayC);
    p.rect(rectWidth - 2, 0, 4, p.height);
  };

  function togglePlay() {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
  }
});
