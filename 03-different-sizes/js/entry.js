import Settings from './Settings';
import DLA from '../../core/DLA';

let dla;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5, Settings);

    // Spawn default walkers and clusters
    reset();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    dla.iterate();
    dla.draw();
  }

  function reset() {
    dla.removeAll();
    dla.createDefaultWalkers();
    dla.createDefaultClusters('Point');
  }

  // Key handler ---------------------------------------------------------
  p5.keyReleased = function () {
    switch (p5.key) {
      case ' ':
        dla.togglePause();
        break;

      case 'w':
        dla.toggleShowWalkers();
        break;

      case 'c':
        dla.toggleShowClusters();
        break;

      case 'r':
        reset();
        break;

      case 'f':
        dla.toggleUseFrame();
        reset();
        break;

      case 'l':
        dla.toggleLineRenderingMode();
        break;
        
      case 'e':
        dla.export();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);