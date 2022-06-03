
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
      
      let hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        //console.log('HIT!',hitTestResults)
        const hitPose = hitTestResults[0].getPose(referenceSpace);
        //drawSphere(hitPose)
      }
      // Render the scene with THREE.WebGLRenderer.
      renderer.render(scene, camera)
      //hit-test 
     
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
              console.log('TRACK')
              console.log(poseImg.transform.position)
              //geometry.position.set(poseImg.transform.position.x, poseImg.transform.position.y, poseImg.transform.position.z)
              geometry.position.x = poseImg.transform.position.x+width;
              geometry.position.y = poseImg.transform.position.y-height;
              geometry.position.z = poseImg.transform.position.z;
              //let quaternion = new THREE.Quaternion(poseImg.transform.orientation.x, poseImg.transform.orientation.y, poseImg.transform.orientation.z , poseImg.transform.orientation.w);
              //quaternion.setFromAxisAngle( new THREE.Vector3( poseImg.transform.orientation.x, poseImg.transform.orientation.y, poseImg.transform.orientation.z ), poseImg.transform.orientation.w );
              //geometry.matrix.makeRotationFromQuaternion( quaternion );
              //geometry.matrixWorldNeedsUpdate = true;
              //geometry.updateMatrixWorld(true);
              console.log(geometry)
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
  const setUpSketch = (texture) => {
    newSketch = new p5(texture);
    //loaded = 1;
    p5CanvasTexture = new THREE.CanvasTexture(newSketch.P5_CANVAS);
    p5CanvasTexture.needsUpdate = true;
    //const materials = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const materials = new THREE.MeshBasicMaterial({ map: p5CanvasTexture,side: THREE.DoubleSide});
      // Create the cube and add it to the demo scene.
      //create canvas 
      //add the canvas as texture 
      //attach p5 text to the canvas 
    
    
    geometry = new THREE.Mesh(new THREE.PlaneGeometry( width, height ),materials);
    geometry.name = 'ARObject'
    //geometry.matrix.fromArray(poseImg.transform.matrix);
    //geometry.position.set(poseImg.transform.position.x, poseImg.transform.position.y, poseImg.transform.position.z)
    //geometry.position = new THREE.Vector3().setFromMatrixPosition(poseImg.transform.matrix)
    
    console.log('POSS',poseImg);
    //geometry.matrix.fromArray(poseImg.transform.matrix);
    geometry.position.x = poseImg.transform.position.x+width;
    geometry.position.y = poseImg.transform.position.y-height;
    geometry.position.z = poseImg.transform.position.z;
    //let quaternion = new THREE.Quaternion(poseImg.transform.orientation.x, poseImg.transform.orientation.y, poseImg.transform.orientation.z , poseImg.transform.orientation.w);
    //quaternion.setFromAxisAngle( new THREE.Vector3( poseImg.transform.orientation.x, poseImg.transform.orientation.y, poseImg.transform.orientation.z ), poseImg.transform.orientation.w );
    //geometry.matrix.makeRotationFromQuaternion( quaternion );
    //geometry.matrixWorldNeedsUpdate = true;
    //geometry.updateMatrixWorld(true);
    geometry.rotation.y = -3.14;
    //geometry.rotation.x = -1.57;
    console.log(geometry)
    //drawSphere(poseImg)
    //geometry.app
    //cube.position.set(0, -1, -3);
    scene.add(geometry);
  }
  const drawSphere = (position) => {
    console.log('SPHERE')
    const geometry = new THREE.SphereGeometry( 0.01, 32,16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    sphere = new THREE.Mesh( geometry, material );
    //sphere.position.set(position.transform.position.x, position.transform.position.y, position.transform.position.z);
    sphere.position.x = poseImg.transform.position.x;
    sphere.position.y = poseImg.transform.position.y;
    sphere.position.z = poseImg.transform.position.z;
    scene.add( sphere );
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
    //add sketch texture
    if(loadNew) {
      loadNew = 0;
      setUpSketch(activeP5Sketch);
    }
    //setUpUI();
  }
  const loadARAssets = (path) => {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    head.appendChild(script);
  }
  const getImageScore = async () => {
    const scores = await session.getTrackedImageScores();
    let trackableImages = 0;
    for (let index = 0; index < scores.length; ++index) {
      if (scores[index] == 'untrackable') {
        //MarkImageUntrackable(index);
        console.log('UNTRACKED')
      } else {
        ++trackableImages;
      }
    }
    if (trackableImages == 0) {
      WarnUser("No trackable images");
    }
  }
  const getImageArray = async() => {
      let returnArray = []
      let markers = document.getElementsByClassName("ARmarker");
      for(elem of markers) {
        let imgBitmap = await createImageBitmap(elem);
        returnArray.push({
          image:imgBitmap,
          widthInMeters:0.18
        })
      }
      return returnArray
  }
  return {
    activateXR : async () => {
      
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
      let markerArray = await getImageArray();
      // Initialize a WebXR session using "immersive-ar".
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
      console.log('BUTTON',window.ARButton)
      document.body.appendChild(window.ARButton.createButton(renderer,options))
      referenceSpace = await session.requestReferenceSpace('local');
      viewerSpace = await session.requestReferenceSpace('viewer');
      // Perform hit testing using the viewer as origin.
      hitTestSource = await session.requestHitTestSource({ space: viewerSpace }); 
      session.addEventListener("select", (event) => {
        let targetRayPose = event.frame.getPose(event.inputSource.targetRaySpace,referenceSpace);
        //window.sketchVariables.test = 'NOT POCKET'
      });
      session.requestAnimationFrame(onXRFrame);
      //setUpSketch(sketchTexture.sk);
      //setUpUI();
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
          p5Instance.AR_UI.push({
            type:1,
            text:args,
            color:0x176beb
          })
          content.append(btn)
          return {
            elm:btn
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
            elm:slid
          };
        }
        p5Instance.createSpan = (args) => {
          const span = document.createElement('span');
          span.innerHTML = args;
          content.append(span)
          return {
            elm:span
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