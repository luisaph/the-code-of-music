
function XRSetup() {
    let canvas,gl,scene,renderer,camera,session,p5CanvasTexture,referenceSpace,viewerSpace,hitTestSource,newSketch,activeP5Sketch
    const onXRFrame = (time, frame) => {
         
      // Queue up the next draw request.
      session.requestAnimationFrame(onXRFrame);
      p5CanvasTexture.needsUpdate = true;
  
      // Bind the graphics framebuffer to the baseLayer's framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)
    
      // Retrieve the pose of the device.
      // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
      const pose = frame.getViewerPose(referenceSpace);
      if (pose) {
        // In mobile AR, we only have one view.
        const view = pose.views[0];
        
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height)
  
        // Use the view's transform matrix and projection matrix to configure the THREE.camera.
        camera.matrix.fromArray(view.transform.matrix)
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);
    
        // Render the scene with THREE.WebGLRenderer.
        renderer.render(scene, camera)
        //marker detection 
        const marker = () => {
          //check from library of images 
          //fetch path
          loadARAssets(path);
        }
      }
    }
    const setUpSketch = (texture) => {
      newSketch = new p5(texture);
      p5CanvasTexture = new THREE.CanvasTexture(newSketch.P5_CANVAS);
      const materials = [
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture}),
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture}),
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture}),
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture}),
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture}),
        new THREE.MeshBasicMaterial({ map: p5CanvasTexture})
      ];
       
    
        // Create the cube and add it to the demo scene.
        //create canvas 
        //add the canvas as texture 
        //attach p5 text to the canvas 
        const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(3,1.5, 0.1), materials);
        cube.position.set(0, -1, -3);
        scene.add(cube);
    }
    const setUpUI = () => {
      newSketch.AR_UI.forEach(button => {
          //get button colour/text/position/
          //create the button in threejs
          let btnColour = new THREE.MeshBasicMaterial({color: button.color})
          let btn = new THREE.Mesh(new THREE.SphereGeometry(0.2,15, 15), btnColour);
          btn.position.set(-0.5, -2.3, -3);
          scene.add(btn);
      });
    }
    const overrideregisterP5Sketch = (p5Sketch) => {
      activeP5Sketch = p5Sketch;
    }
    const loadARAssets = (path) => {
        document.write('<script src="js/' + path + '"><\/script>');
        //add sketch texture
        setUpSketch(activeP5Sketch);
        setUpUI();
    }
    return {
      activateXR : async (sketchTexture) => {
        //console.log('sketchTexture',sketchTexture.sk);
        /*Three JS canvas */
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        gl = canvas.getContext("webgl", {xrCompatible: true});
        scene = new THREE.Scene();
  
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: canvas,
            context: gl
        });
        renderer.autoClear = false;
        
        // The API directly updates the camera matrices.
        // Disable matrix auto updates so three.js doesn't attempt
        // to handle the matrices independently.
        camera = new THREE.PerspectiveCamera();
        camera.matrixAutoUpdate = false;
  
        // Initialize a WebXR session using "immersive-ar".
        session = await navigator.xr.requestSession("immersive-ar",{requiredFeatures: ['hit-test']});
        session.updateRenderState({
          baseLayer: new XRWebGLLayer(session, gl)
        });
  
        referenceSpace = await session.requestReferenceSpace('local');
        viewerSpace = await session.requestReferenceSpace('viewer');
        // Perform hit testing using the viewer as origin.
        hitTestSource = await session.requestHitTestSource({ space: viewerSpace }); 
        session.requestAnimationFrame(onXRFrame);
        //setUpSketch(sketchTexture.sk);
        //setUpUI();
        window.registerP5Sketch = overrideregisterP5Sketch;
      },
  
      overrideP5functions:(p5Instance,p5Canvas) => {
        if(window.ENV == "AR") {
          p5Instance.AR_UI = [];
          p5Instance.P5_CANVAS = p5Canvas.elt;
          p5Instance.createButton = (args) => {
            p5Instance.AR_UI.push({
              type:1,
              text:args,
              color:0x176beb
            })
          }
        }
      }
    }
    
  }
  window.XRSetup = new XRSetup();
  window.activateXR = XRSetup.activateXR;
  window.overrideP5functions = XRSetup.overrideP5functions;