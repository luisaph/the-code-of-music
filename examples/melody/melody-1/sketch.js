window.registerP5Sketch((p) => {
  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  let c;
    let rc;
    let frame = 0;
    let pitchValues = [];
    let fromcolour = '#f56a07';
    let tocolour = '#c1ff7a'
    let fmin = 0;
    let fmax = 120;
    let w = 800;
    let h = 250;

    let gridLines = 5;
    let ystart = h-30;
    let yend = 0 ;
    let xstart = 30;
    let xend = w-xstart;
    let currentValue = 0;

    //images
    let graph,pitchgrid,timegrid,timepitchgrid,measure;

    let audio;
    let isPlaying = false;

    let state = {
    time:false,
    pitch:false
    }
    let buttonText = {
    time:"Show time grid",
    pitch:"Show pitch grid"
    }

    p.preload = function() {
        //font = p.loadFont('../../../assets/fonts/fg-virgil.ttf');
        console.log('assetsUrl',assetsUrl);
        graph = p.loadImage(assetsUrl+"/img/grid.png");
        pitchgrid = p.loadImage(assetsUrl+"/img/pitchgrid.png");
        timegrid = p.loadImage(assetsUrl+"/img/timegrid.png");
        timepitchgrid = p.loadImage(assetsUrl+"/img/timepitchgrid.png");
        measure = p.loadImage(assetsUrl + "/img/measure.png")
        audio = p.loadSound(assetsUrl+ "/sound/whistle.mp3");
    }



    p.setup = () => {
        c = p.createCanvas(800, 250);
        rc = rough.canvas(c.elt);

        let generator = rc.generator;
        line1 = generator.line(xstart, graph.height-80, xstart+graph.width, graph.height-80, 
                                    { stroke:"black",
                                        roughness: 0.4 });
        line2 = generator.line(xstart, graph.height-70, xstart, 0, 
            { stroke:"black",
            roughness: 0.4 });
        playBtn = p.createButton('');
        playBtn.position(p.width/2-20, p.height-50);
        playBtn.style(`"background-image:url("${assetsUrl}/img/play.png"); background-position: center;background-repeat: no-repeat; background-size: 100%; border-radius: 50%; width:40px; height:40px; background-color:white"`);
        playBtn.mouseReleased(togglePlay);
        //p.textFont(font);
        p.textSize(12);
    }

    p.draw = () => {
        p.background(255);
        p.imageMode(p.CORNER);
        pickImage()

        p.push()
            if(state.time) {
            p.fill("#FB5D04");
            } else {
            p.fill("black");
            }
            p.text(buttonText.time, xstart, graph.height-35);
        p.pop()

        p.push()
            if(state.pitch) {
                p.fill("#FB5D04");
            } else {
                p.fill("black");
            }
            p.text(buttonText.pitch, xstart, graph.height-15);
        p.pop()

        rc.draw(line1);
        p.text("time", graph.width-p.textWidth("time"), graph.height-35);
        rc.draw(line2);
        p.text("pitch", 0, 10);
        if(!audio.isPlaying()) {
            playBtn.style(`"background-image:url("${assetsUrl}/img/play.png")"`);
        } else {
            playBtn.style(`"background-image:url("${assetsUrl}/img/pause.png")"`);
        }

        p.push()
            p.noStroke()
            p.fill('rgba(255,141,1, 0.1)');
            let currentTime = audio.currentTime();
            let rectWidth = p.map(p.round(currentTime,2),0,audio.duration(),0,p.width);
            p.rect(xstart, 0, rectWidth, graph.height-80);
        p.pop()
    }

    function togglePlay(){
        if(!isPlaying) {
            isPlaying = true;
            audio.play();
        } else {
            isPlaying = false;
            audio.pause()
        }
    }

    function mousePressed() {
        if(mouseX > xstart && mouseX < xstart+textWidth(buttonText.time) && mouseY > graph.height-60 && mouseY < graph.height-35) {
            if(state.time) {
            buttonText.time = "Show time grid"
            } else {
            buttonText.time = "Hide time grid"
            }
            state.time = !state.time;
        }

        if(mouseX > xstart && mouseX < xstart+textWidth(buttonText.time) && mouseY > graph.height-34 && mouseY < graph.height-15) {
            if(state.pitch) {
            buttonText.pitch = "Show pitch grid"
            } else {
            buttonText.pitch = "Hide pitch grid"
            }
            state.pitch = !state.pitch;
        }
    }

    function pickImage() {
        if(state.time && state.pitch) {
            p.image(timepitchgrid, xstart, 0, p.width, graph.height*(width-xstart)/graph.width);
        }
        if(!state.time && !state.pitch) {
            p.image(graph, xstart, 0, p.width, graph.height*(p.width-xstart)/graph.width);
        }
        if(state.time && !state.pitch) {
            p.image(timegrid, xstart, 0, p.width, graph.height*(p.width-xstart)/graph.width);
            p.image(measure, xstart, graph.height-75, p.width, measure.height*(width-xstart)/measure.width);
        }
        if(!state.time && state.pitch) {
            p.image(pitchgrid, xstart, 0, p.width, graph.height*(p.width-xstart)/graph.width);
        }
    }
});
