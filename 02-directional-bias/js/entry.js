import DLA from '../../core/DLA';

let dla,
    currentClusterType = 'Wall',
    showText = true;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5);

    // Start with the walkers biased towards screen bottom
    dla.settings.BiasTowards = 'Bottom';

    // Spawn walkers and clusters
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
    dla.createDefaultClusters(currentClusterType);
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('02 - directional bias', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text(`Making walkers move in particular directions

Key commands:
1 - downward bias
2 - upward bias
3 - left bias
4 - right bias
5 - towards center (Y only)
6 - towards center (X only)
7 - away from center
8 - towards center
      `, 20, 70);
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

      // Use numbers to change bias direction
      case '1':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Bottom';
        reset();
        dla.unpause();
        break;

      case '2':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Top';
        reset();
        dla.unpause();
        break;

      case '3':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Left';
        reset();
        dla.unpause();
        break;

      case '4':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Right';
        reset();
        dla.unpause();
        break;

      case '5':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Equator';
        reset();
        dla.unpause();
        break;

      case '6':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Meridian';
        reset();
        dla.unpause();
        break;

      case '7':
        dla.pause();
        currentClusterType = 'Wall';
        dla.settings.BiasTowards = 'Edges';
        reset();
        dla.unpause();
        break;

      case '8':
        dla.pause();
        currentClusterType = 'Point';
        dla.settings.BiasTowards = 'Center';
        reset();
        dla.unpause();
        break;
  
      case 't':
        showText = !showText;
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);