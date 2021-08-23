window.registerP5Sketch((p) => {
    const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
    const player = new Tone.Player(assetsUrl+"/sound/kill_bill_whistle.mp3");
    player.toDestination();

    let fft = new Tone.FFT();
    player.connect(fft);
    const buttonStyle = `
    display: block;
    padding: 20px;
    background-image:url("${assetsUrl}/img/microphone.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 50%;
    background-color: white;
  `;
    p.preload = () =>{
        //font = loadFont('../../../assets/fonts/fg-virgil.ttf');
    }



    p.setup = () => {
        p.createCanvas(620, 200);

        playBtn = p.createButton('');
        playBtn.style(buttonStyle);
        playBtn.mouseReleased(togglePlay);

        //p.textFont(font);
        p.textSize(12);

        // fft = new Tone.FFT(128);
        // player.connect(fft);
    }

    // let fmin = Infinity;
    // let fmax = -Infinity;
    p.draw = () => {
        p.background(255);
        if(player.state == "stopped"){
            console.log('STOP')
            playBtn.style(`background-image:url("${assetsUrl}/img/play.png")`);
        }
        else{
            playBtn.style(`background-image:url("${assetsUrl}/img/pause.png")`);
        }

        // Whole canvas
        // let w = width;
        // let h = height;
        // let x = 0;
        // let y = 0; 
        
        // Rectangle
        let w = 40;
        let h = 120;
        let x = (p.width-w)/2;
        let y = (p.height-h)/2;
        p.fill('white');
        p.stroke('black');
        p.rect(x, y, w, h);

        // Labels
        p.fill('black');
        p.noStroke();
        p.text("high pitch", x + w + 20, y + 20);
        p.text("low pitch", x + w + 20, y + h - 20);

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
            let fHeight = p.map(f, 50, 120, 0, h);
            fHeight = p.constrain(fHeight,0, h);
            p.fill('#fd7e14');
            p.noStroke();
            // Bar
            // rect(x, y+h-fHeight, w, fHeight);
            // Line
            p.rect(x, y+h-fHeight, w, 4);
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
});
  