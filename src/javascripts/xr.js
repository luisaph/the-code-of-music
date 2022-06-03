
function XRSetup() {
  const PATH_MAP = {
    1:'assets/examples/melody/melody-3/sketch.js',
    2:'assets/examples/melody/melody-2/sketch.js',
    3:'assets/examples/melody/melody-1/sketch.js'
  }
  let canvas,gl,scene,renderer,camera,session,p5CanvasTexture,referenceSpace,viewerSpace,hitTestSource,newSketch,activeP5Sketch,poseImg,geometry,sphere
  let lastTracked = -2;
  let loadNew = 1;
  let ratio = 18/10;
  let width = 0.09;
  let height = width/ratio;
  window.sketchVariables = {};

  /*Called on each frame
  gets camera positions 
  checks for detected marker and its position on each frame. 
  */
  const onXRFrame = (time, frame) => {
       
    // Queue up the next draw request.
    session.requestAnimationFrame(onXRFrame);
    if(p5CanvasTexture) {
      p5CanvasTexture.needsUpdate = true;
    }
    

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
        let imagesTrackedThisFrame = {};
        let currentTracked = 0;
        let currentTrackedObj;
        for (const result of frame.getImageTrackingResults()) {
          imagesTrackedThisFrame[result.index] = true;
          if(result.trackingState == "tracked") {
            currentTracked = result.index+1;
            currentTrackedObj = result;
            poseImg = frame.getPose(result.imageSpace, referenceSpace);
            //prev and current tracked check
            if(geometry) {
              /* updates geomerty position if the detected marker does not change but the position updates*/
              geometry.position.x = poseImg.transform.position.x+width;
              geometry.position.y = poseImg.transform.position.y-height;
              geometry.position.z = poseImg.transform.position.z;
            }
          }
        }
        imagesTrackedPreviousFrame = imagesTrackedThisFrame;
        //console.log('imagesTrackedPreviousFrame',imagesTrackedPreviousFrame)
        //add position check too 
        /*if(!currentTracked) {
          lastTracked = -2;
          console.log('REMOVE')
          scene.remove("ARObject")
        }*/
        
        //if(currentTrackedObj && lastTracked != currentTracked) {
        if(currentTracked && loadNew) {
          //loadNew = 1;
          let path = PATH_MAP[currentTracked];
          loadARAssets(path)
        }
        
      }
      marker()
    }
  }
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  /*
    Creates the plane and add it to the scene.
    Adds the p5canvas as texture 
  */
  const setUpSketch = (texture) => {
    newSketch = new p5(texture);
    p5CanvasTexture = new THREE.CanvasTexture(newSketch.P5_CANVAS);
    p5CanvasTexture.needsUpdate = true;
    const materials = new THREE.MeshBasicMaterial({ map: p5CanvasTexture,side: THREE.DoubleSide});
    
    geometry = new THREE.Mesh(new THREE.PlaneGeometry( width, height ),materials);
    geometry.name = 'ARObject'
  
    /**hard coded the positions and rotation for now as  geometry.matrix.fromArray(poseImg.transform.matrix); was not working as intended*/
    geometry.position.x = poseImg.transform.position.x+width;
    geometry.position.y = poseImg.transform.position.y-height;
    geometry.position.z = poseImg.transform.position.z;
    geometry.rotation.y = -3.14;
    //geometry.rotation.x = -1.57;
    scene.add(geometry);
  }

   /*Over rides the default registerp5sketch defined in all sketches so that it does not get imteract with the p5 pulgin for magicbook*/
  const overrideregisterP5Sketch = (p5Sketch) => {
    activeP5Sketch = p5Sketch;
    //add sketch texture
    /*condition added to avoid duplicate loading of a sketch */
    if(loadNew) {
      loadNew = 0;
      setUpSketch(activeP5Sketch);
    }
  }

  /* adds the relevant sketch.js file to the head of the documents so that the sketch can be invoked in instance mode and be ready to be used as a canvas texture*/
  const loadARAssets = (path) => {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    head.appendChild(script);
  }

   /*load all images that are to be used as markers*/
  const getImageArray = async() => {
    let returnArray = []
      let markers = document.getElementsByClassName("ARmarker");
      for(elem of markers) {
        let imgBitmap = await createImageBitmap(elem);
        returnArray.push({
          image:imgBitmap,
          widthInMeters:0.18 /**Can change based on the book dimensions */
        })
      }
      return returnArray
  }
  return {
    activateXR : async () => {
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
      let markerArray = await getImageArray();
      // Initialize a WebXR session using "immersive-ar".
      /*image-tracking for image detection to load different p5 sketches, dom-overlay for loading dom elements to emable interaction with the sketch*/
      let options = {
        requiredFeatures: ['image-tracking','hit-test'],
        optionalFeatures: ['dom-overlay'],
        trackedImages: markerArray,
        domOverlay: {root:document.getElementById('interaction')}
    }
      session = await navigator.xr.requestSession("immersive-ar",options);
      window.addEventListener("resize", onWindowResize, false);
      session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, gl)
      });
      document.body.appendChild(window.ARButton.createButton(renderer,options))
      referenceSpace = await session.requestReferenceSpace('local');
      viewerSpace = await session.requestReferenceSpace('viewer');
      // Perform hit testing using the viewer as origin.
      hitTestSource = await session.requestHitTestSource({ space: viewerSpace }); 
     
      session.requestAnimationFrame(onXRFrame);
      window.registerP5Sketch = overrideregisterP5Sketch;
    },
    overrideP5functions:(p5Instance,p5Canvas) => {
      
      if(window.ENV == "AR") {
        p5Instance.AR_UI = [];
        p5Instance.P5_CANVAS = p5Canvas.elt;

        /*overriding p5 DOM functions to javascript DOM fucntions
        remmoves the dom elements created in the sketch from the sketch and adds them to ar window
        */
        let content = document.getElementById('interaction')
        p5Instance.createButton = (args) => {
          let btn = document.createElement('button');
          btn.innerHTML = args;
          //setting default button type to play
          if(args == '') {
            btn.className = 'play-button'
          }
          btn.setAttribute('type','button');
          content.append(btn)
          return {
            elt:btn
          };
        }
        p5Instance.createSlider = (min,max,val) => {
          let slid = document.createElement('input');
          slid.setAttribute('type','range');
          slid.setAttribute('min',min);
          slid.setAttribute('max',max);
          slid.setAttribute('value',val);
          content.append(slid)
          return {
            elt:slid
          };
        }
        p5Instance.createSpan = (args) => {
          const span = document.createElement('span');
          span.innerHTML = args;
          content.append(span)
          return {
            elt:span
          };
        } 
        return {
          canvas:p5Canvas
        };
      }
    }
  }
  
}
window.XRSetup = new XRSetup();
window.activateXR = XRSetup.activateXR;
window.overrideP5functions = XRSetup.overrideP5functions;