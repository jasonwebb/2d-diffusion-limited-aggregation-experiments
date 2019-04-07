import Settings from './Settings';
import DLA from '../../core/DLA';

let dla,
    showText = true;

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
    drawText();
  }

  function reset() {
    dla.removeAll();
    dla.createDefaultWalkers();
    dla.createDefaultClusters('Point');
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('03 - different sizes', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text(`Varying sizes of walker particles

Key commands:
1 - proportional to center
2 - random sizes`, 20, 70);
    }
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

      case '1':
        dla.settings.VaryDiameterByDistance = true;
        dla.settings.VaryDiameterRandomly = false;
        dla.settings.MaxWalkers = 1000;
        reset();
        break;

      case '2':  
        dla.settings.VaryDiameterByDistance = false;
        dla.settings.VaryDiameterRandomly = true;
        dla.settings.MaxWalkers = 700;
        reset();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);