window.registerP5Sketch((p) => {
  let minDisplacement = 25;

  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';

  const nMolecules = 2000;
  const moleculeSize = 5;

  const moleculeColor = p.color('#00A17B');
  const sineWaveColor = p.color('#FF3100');

  let originPt;
  let showGraph = false;
  let showWaves = true;
  let showMolecules = false;
  let randomPositions;

  const fft = new Tone.FFT();
  const osc = new Tone.Oscillator(220);
  const oscGain = new Tone.Gain(0);

  /* reduce frequency to be visible */
  const getScaledFq = () => osc.frequency.value / 5000;

  p.setup = () => {
    osc.volume.value = -10;
    osc.chain(oscGain, Tone.Destination);

    originPt = p.createVector(301, 262);

    let p5Obj = window.overrideP5functions(p,p.createCanvas(window.innerWidth, 400).style('position: relative; z-index: 0; width: 100%'));
    //c = p5Obj.p5Canvas

    // p.pixelDensity(1);
    // mic = new Tone.UserMedia().toDestination();

    p.createImg(`${assetsUrl}/img/com-head1.svg`).style(`
      height: 400px;
      position: absolute;
      z-index: 1 ;
      pointer-events: none;
      position: absolute;
      left: -60px;
      bottom: 45px;
    `);

    p.createImg(`${assetsUrl}/img/com-head2.svg`).style(
      'height: 400px; position: absolute; z-index: -1; right: -0px; bottom: 45px; pointer-events: none'
    );

    const playBtn = p.createButton('');
    console.log('playBtn',playBtn)
    playBtn.elt.classList.add('play-button');
    playBtn.elt.onclick=(() => {
      console.log('CLICK',osc.start)
      if (osc.state == 'started') {
        oscGain.gain.rampTo(0, 0.6);
        setTimeout(() => {
          osc.stop();
        }, 300);
        playBtn.elt.classList.remove('play-button--stop');
      } else {
        osc.start();
        oscGain.gain.rampTo(1, 0.3);
        playBtn.elt.classList.add('play-button--stop');
      }
    });

    let freqSp = p.createSpan('Freq');
    console.log('FREQ',freqSp.elt)
    let freqSlid = p.createSlider(1, 1000)
    freqSlid.elt.oninput = (() => {
      let val = freqSlid.elt.value;
      const pow = p.map(val, 1, 1000, 7, 9);
      const newFq = p.pow(2, pow);
      osc.frequency.rampTo(newFq, 0.1);
    })

    p.createSpan('Amplitude');
    let ampSlid = p.createSlider(0, 1000, 1000);
    ampSlid.elt.oninput = (() => {
      let val = ampSlid.elt.value;
      const newVol = p.map(val, 0, 1000, 0, 1);
      oscGain.gain.rampTo(newVol, 0.1);
    })

    // p.createButton('toggle graph').mousePressed(() => {
    //   showGraph = !showGraph;
    // });
    let togGph = p.createButton('toggle graph')
    togGph.elt.onclick=(() => {
      showGraph = !showGraph;
    });
    let togWav = p.createButton('toggle waves')
    togWav.elt.onclick=(() => {
     showWaves = !showWaves;
    });
    let togMol = p.createButton('toggle molecules')
    togMol.elt.onclick = (() => {
     showMolecules = !showMolecules;
    });

    randomPositions = [...new Array(nMolecules)].map((_, i) =>
      p.createVector(p.random() * p.width, p.random() * p.height)
    );

    randomPositions.push(p.createVector(originPt.x, originPt.y - 1));

    /* Custom load handler */
    if (p.onLoaded) {
      p.onLoaded();
    }
  };

  const getDisplacementNormal = (distToSource, time) => {
    const fq = getScaledFq();
    const period = 1 / fq;
    const phaseShift = (0.25 * distToSource) / p.TAU;
    const phase = time / period;
    const displacement = p.sin(-phase * fq + phaseShift);
    return displacement;
  };

  p.draw = () => {
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

    const time = p.millis();
    const amplitude =
      osc.state === 'started' ? p.map(oscGain.gain.value, 0, 1, 0, 15) : 0;

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
    }

    /* Draw molecules */
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
        const isUnderMouse =
          p.dist(p.mouseX - minDisplacement, p.mouseY, currPt.x, currPt.y) < 15;
        moleculeColor.setAlpha(alpha);
        p.fill(moleculeColor);
        p.circle(
          -displacement,
          0,
          isUnderMouse ? moleculeSize * 1.8 : moleculeSize
        );

        p.pop();
      });
    }
  };
});
