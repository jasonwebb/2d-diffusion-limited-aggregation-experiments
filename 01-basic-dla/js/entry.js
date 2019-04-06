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
    dla = new DLA(p5);
    reset();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    dla.iterate();
    dla.draw();
    drawText();
  }

  // Reset - remove all particle and generate new ones
  function reset() {
    dla.removeAll();
    dla.createDefaultWalkers();
    dla.createDefaultClusters();
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('01 - basic DLA', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text('Simplest possible configuration', 20, 70);
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

      case 't':
        showText = !showText;
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);