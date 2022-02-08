window.registerP5Sketch((p) => {
  let wavelength = 3;
  let period = 1 / wavelength;
  let amplitude = 15;
  let minDisplacement = 25;
  const gridSize = 10;
  const nMolecules = 2000;
  const moleculeSize = 5;

  const moleculeColor = p.color('#00A17B');
  const sineWaveColor = p.color('#FF3100');

  let timeMult = 1;

  let originPt;
  let showGraph = false;
  let showWaves = false;
  let showMolecules = true;

  let randomPositions;

  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  const player = new Tone.Player(
    `${assetsUrl}/sound/kill_bill_whistle_short.mp3`
  );

  const fft = new Tone.FFT();

  p.setup = () => {
    player.connect(fft);
    player.toDestination();

    c = p
      .createCanvas(900, 400)
      .style('cursor: none; position: relative; z-index: 1');
    // p.pixelDensity(1);
    // mic = new Tone.UserMedia().toDestination();

    p.createImg(`${assetsUrl}/img/com-head1.svg`)
      .position(-120, -50)
      .style('position: absolute; z-index: 1');

    p.createImg(`${assetsUrl}/img/com-head2.svg`).style(
      'position: absolute; z-index: 0; right: 0px; top: 0'
    );

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

    p.createSpan('Wavelength');
    p.createSlider(1, 100).mouseMoved(({ target }) => {
      const val = target.value;
      wavelength = parseFloat(val / 50);
    });
    p.createSpan('Amplitude');
    p.createSlider(0, 1000, 1000).mouseMoved(({ target }) => {
      const scaled = p.map(target.value, 0, 1000, 0, 15);
      amplitude = parseFloat(scaled);
    });
    p.createSpan('Slomo');
    p.createSlider(100, 800).mouseMoved(({ target }) => {
      timeMult = parseFloat(100 / target.value);
    });

    p.createButton('pause').mousePressed(() => {
      p.noLoop();
    });
    p.createButton('play').mousePressed(() => {
      p.loop();
    });
    p.createButton('toggle graph').mousePressed(() => {
      showGraph = !showGraph;
    });
    p.createButton('toggle waves').mousePressed(() => {
      showWaves = !showWaves;
    });
    p.createButton('toggle molecules').mousePressed(() => {
      showMolecules = !showMolecules;
    });

    originPt = p.createVector(300, 252);

    randomPositions = [...new Array(nMolecules)].map((_, i) =>
      p.createVector(p.random() * p.width, p.random() * p.height)
    );

    randomPositions.push(p.createVector(originPt.x, originPt.y - 1));

    /* Custom load handler */
    if (p.onLoaded) {
      p.onLoaded();
    }
  };

  let lerpTime = 0;

  const getDisplacementNormal = (distToSource, time) => {
    const fq = wavelength;
    // const fqLerp = fq * p.min(lerpTime / distToSource / 2, 1);

    const period = 1 / fq;
    const phaseShift = (0.25 * distToSource) / p.TAU;
    const phase = (100 * time) / period;
    const speedMult = 1;
    const displacement = p.sin(-phase * fq + phaseShift);
    return displacement;
  };

  // const getDisplacementNormal = (distToSource, time) => {
  //   const phaseShift = distToSource / wavelength;
  //   const phase = time / period;
  //   const speedMult = 10;
  //   const displacement = p.sin(-phase * speedMult + phaseShift);
  //   return displacement;
  // };

  // let time = 0;
  p.draw = () => {
    // p.background(255);
    p.clear();

    // if (player.state === 'started') {
    //   let frequencyData = fft.getValue();
    //   let max = -Infinity;
    //   let f;
    //   for (let i = 0; i < frequencyData.length; i++) {
    //     if (frequencyData[i] > max) {
    //       max = frequencyData[i];
    //       f = i;
    //     }
    //   }
    //   p.stroke(0);
    //   p.text(f, 10, 10);
    //   wavelength = p.map(f, 70, 90, 100, 50, true);
    // }

    // const originPt = p.createVector(p.mouseX, p.mouseY);
    const time = (timeMult * p.millis()) / 100000;

    /* Draw Concentric Circles */
    if (showWaves || showGraph) {
      for (let i = 0; i < p.width; i += 1) {
        p.push();
        p.translate(originPt);
        const displacementNormal = getDisplacementNormal(i, time);
        const displacement = minDisplacement + amplitude * displacementNormal;

        if (showWaves && i % 10 === 0) {
          const r = i + displacement;

          p.push();
          p.noFill();
          p.strokeWeight(1);
          moleculeColor.setAlpha(100);
          p.stroke(moleculeColor);
          p.circle(0, 0, r * 2);
          p.pop();
        }

        /* Draw sine wave */
        if (showGraph) {
          p.push();
          sineWaveColor.setAlpha(100);
          p.fill(sineWaveColor);
          p.translate(0, 0);
          p.noStroke();
          p.circle(i, -displacement, 5);
          p.pop();
        }
        p.pop();
      }

      /* Draw Wavelength */
      if (showGraph) {
        p.push();
        p.translate(originPt);
        p.translate(0, -minDisplacement);
        p.strokeWeight(2);
        p.blendMode(p.DIFFERENCE);

        sineWaveColor.setAlpha(255);
        p.stroke(sineWaveColor);
        p.fill(sineWaveColor);
        const yPos = getDisplacementNormal(0, time) * -amplitude;
        const len = wavelength * p.TAU;
        /* Line */
        p.line(0, yPos, len, yPos);
        /* End Points */
        p.noStroke();
        p.circle(0, yPos, 11);
        p.circle(len, yPos, 11);
        // p.line(0, -50, len, -50);
        // p.noStroke();
        // p.text('WAVELENGTH', 0, -50);

        p.pop();
      }
    }

    /* Draw molecules */

    moleculeColor.setAlpha(30);
    p.fill(moleculeColor);
    // p.blendMode(p.DIFFERENCE);
    p.noStroke();
    p.circle(p.mouseX, p.mouseY, 40);
    // p.blendMode(p.BLEND);

    if (showMolecules) {
      randomPositions.forEach((currPt) => {
        p.push();

        const distToCenter = p5.Vector.dist(currPt, originPt);
        const displacementNormal = getDisplacementNormal(distToCenter, time);
        const displacement = minDisplacement + amplitude * displacementNormal;
        const targetAngle = Math.atan2(
          originPt.y - currPt.y,
          originPt.x - currPt.x
        );

        const alpha = p.map(p.abs(targetAngle + p.TAU), 0, p.PI, 0, 255, true);
        p.translate(currPt);
        p.rotate(targetAngle);
        p.noStroke();
        // const a =
        //   (displacementNormal + (displacementNormal * p.TAU) / wavelength) * 50 + 100;
        const isUnderMouse =
          p.dist(p.mouseX - minDisplacement, p.mouseY, currPt.x, currPt.y) < 15;
        // moleculeColor.setAlpha(isUnderMouse ? 255 : 180);
        moleculeColor.setAlpha(alpha);
        // p.fill(isUnderMouse ? sineWaveColor : moleculeColor);
        // if (isUnderMouse) {
        //   p.blendMode(p.DIFFERENCE);
        // }
        p.fill(moleculeColor);
        p.circle(
          -displacement,
          0,
          isUnderMouse ? moleculeSize * 1.8 : moleculeSize
        );

        p.pop();
      });
    }

    lerpTime++;
  };
});
