window.p5Examples = window.p5Examples || [];
console.log('test-instance-mode file loaded');
window.p5Examples.push((p) => {
  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';

  console.log('sketch loaded');
  const synth = new Tone.Synth().toDestination();
  const buttonStyle = `
    display: block;
    padding: 20px;
    background-image:url("${assetsUrl}/img/play.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 50%;
    background-color: white;
  `;

  p.setup = () => {
    playBtn = p.createButton('');
    playBtn.style(buttonStyle);
    playBtn.mouseReleased(() => {
      synth.triggerAttackRelease('A3', 1);
    });
    p.createCanvas(200, 200);
    p.background(0);
  };
  p.draw = () => {
    const color = (p.sin(p.frameCount / 10) + 0.5) * 255;
    p.background(color);
  };
});
