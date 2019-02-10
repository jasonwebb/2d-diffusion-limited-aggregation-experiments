import Settings from './Settings';
import World from '../../core/World';

let world, imageLayers = [], stackedImage, imageReady = false, numLayers = 2;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);

    // Use default walkers and clusters
    world.createDefaultWalkers();
    world.createDefaultClusters('Point');
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    if(imageReady) {
      p5.background(255);
      
      for(let [index, image] of imageLayers.entries()) {
        p5.image(image, index * 20, 0);
      }

      p5.noLoop();
    } else {
      world.iterate();
      world.draw();
    }
  }

  function resetWorld() {
    world.removeAll();
    world.createDefaultWalkers();
    world.createDefaultClusters(Settings.InitialClusterType);
  }

  // Key handler ---------------------------------------------------------
  p5.keyReleased = function () {
    switch (p5.key) {
      case ' ':
        world.togglePause();
        break;

      case 'w':
        world.toggleShowWalkers();
        break;

      case 'c':
        world.toggleShowClusters();
        break;

      case 'r':
        resetWorld();
        break;

      case 'f':
        world.toggleUseFrame();
        resetWorld();
        break;

      case 'l':
        world.toggleLineRenderingMode();
        break;

      case 'e':
        world.export();
        break;
        
      case 'd':
        world.showWalkers = false;
        world.useFrame = false;
        world.draw();

        createImageStack();
        break;

      case '1':
        currentImageNum = 0;
        break;

      case '2':
        currentImageNum = 1;
        break;
    }
  }

  function createImageStack() {
    p5.loadPixels();

    for(let i = 0; i < numLayers; i++) {
      imageLayers[i] = p5.createImage(window.innerWidth, window.innerHeight);
      imageLayers[i].loadPixels();

      // Copy all pixels from the canvas to the image layer
      for(let x = 0; x < imageLayers[i].width; x++) {
        for(let y = 0; y < imageLayers[i].height; y++) {
          imageLayers[i].set(x, y, p5.get(x, y));
        }
      }

      imageLayers[i].updatePixels();
  
      imageLayers[i].filter(p5.BLUR, 10 + i);
      imageLayers[i].filter(p5.THRESHOLD, .9);
      p5.loop();

      imageLayers[i].loadPixels();

      // Make all white pixels transparent
      for(let x = 0; x < imageLayers[i].width; x++) {
        for(let y = 0; y < imageLayers[i].height; y++) {
          let c = imageLayers[i].get(x, y);
          
          if(c[0] == 255 && c[1] == 255 && c[2] == 255 && c[3] == 255) {
            imageLayers[i].set(x, y, p5.color(0,0,0,0));
          }
        }
      }

      imageLayers[i].updatePixels();
    }

    imageReady = true;
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);