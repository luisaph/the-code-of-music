window.registerP5Sketch((p) => {
    const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
    let lasteventframecount;
    let lastDecay = 0;
    let freqUpdate = false;
    let previousPosition = [];
    let c;
    let rc;
    let circles = 60;
    let amp = 6;
    let divs = 2;
    let x, y, w, h;
    let cy,cx;

    let mic, fft;
    let freq = 10;
    let prevFreq = 10;
    let lastUpdate = 0;
    let minFreq = 100;
    let maxFreq = 2000;
    let notePosX = 0;
    let osc,generator;

    let isRecording = false;

    let mouth,ear;

    let audioContext;
    let pitch;
    fft = new Tone.FFT();

    let buttonStyle = `
    display: block;
    padding: 20px;
    background-image:url("${assetsUrl}/img/microphone.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 50%;
    background-color: white;
  `;

    p.preload = () => {
        mouth = p.loadImage(assetsUrl+"/img/mouth.png");
        ear = p.loadImage(assetsUrl+"/img/ear.png");
    }
    p.setup = () => {
        c = p.createCanvas(800, 300);
        mic = new Tone.UserMedia().toDestination();
        playBtn = p.createButton('');
        playBtn.style(buttonStyle);
        playBtn.mouseReleased(togglePlay);
        //playBtn.position(p.width/2, p.height/2);
        
        // angleMode(DEGREES);
        

        //textFont(font);
        p.textSize(12);
    }
        
    p.draw = () => {
        p.background(255);
        x = 2;
        y = p.height / 2;
        w = p.width - 2 * x;
        cy = p.height/2;
        cx = p.width/4+20;
        p.image(ear, cx+p.width-ear.width-190, p.height/3+10, 50, ear.height*(50)/ear.width);
        p.push()
            p.textSize(12);
            let textString = '';
           
            for(let i=0;i<circles;i++) {
                //draw circle
                let r = (20 + 8*i + amp*(p.sin((p.frameCount)*(2*p.PI*freq*0.003) + (p.PI/4.5*i))))
                p.push()
                    p.noFill();
                    p.strokeWeight(0.6);
                    p.stroke(230,230,230);
                    p.arc(cx, p.height/2,2*r,2*r,p.PI/10,2*p.PI-p.PI/9);
                p.pop()

                //draw molecule
                let phaseDiff = 0;
                /*if(prevFreq != freq) {
                    phaseDiff = Math.abs(freq-prevFreq)*2*PI*frameCount
                }*/
                let div = divs
                if(i < 8) {
                    div = (9-i)*divs
                }
                for(let j=0;j<p.floor(40/div);j++) {
                    let radian = p.radians(j*div);
                    let x,y;
                    x = cx+r*p.sin(radian+p.PI/2.5);
                    y = cy+r*p.cos(radian+p.PI/2.5);
                    p.push()
                        p. fill("#4f7dab");
                        p.ellipse(x, y, 1.5);
                    p.pop()
                }
            }
            if(isRecording) {
                textString = 'Stop recording';
                getPitch();
            } else {
                textString ='Start recording' 
            }
            p.text(textString, 0, p.height-3);
        p.pop();
        p.imageMode(p.CORNER);
        p.image(mouth, cx-75, p.height/3, 100, mouth.height*(100)/mouth.width);
        p.push()
            p.textSize(15);
            p.textStyle(p.BOLD)
            if(freq) {
                p. text("Frequency: " + freq.toFixed(2) + "Hz", 0, p.height-30);
            }
        p.pop()
        
        
    }
    function togglePlay() {
        if(!isRecording) {
            //mic = new p5.AudioIn();
            //mic.start(startPitch);
            startAudio()
        }
        isRecording = !isRecording;
    }

    function startAudio() {
        mic.open().then(function(){
            mic.connect(fft);
            getPitch();
        });
    }
    function getPitch() {
        let frequencyData = fft.getValue();
        let max = -1*p.int(Infinity)
        let min = 0;
        let f;
        for (let i = 0; i < frequencyData.length; i++) {
            console.log('freq',frequencyData[i])
            if(frequencyData[i] > max){
                max = frequencyData[i];
                f = i;
            } 
        }

        let newfreq = p.map(f,1,1024,10,300);
        console.log('math',Math.abs(newfreq-freq))
        if(prevFreq != newfreq && (p.frameCount-lastUpdate) > 10 && Math.abs(newfreq-freq) > 0.99) {
            lastUpdate = p.frameCount
            prevFreq = freq;
            freq = newfreq;
        }
    }
});
  