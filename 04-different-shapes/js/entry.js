import Settings from './Settings';
import DLA from '../../core/DLA';

let dla,
    currentWalkerShape = Settings.WalkerShape;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5, Settings);
    dla.createDefaultClusters('Point');

    // Use custom method to create particles with different shapes
    createCustomWalkers();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    dla.iterate();
    dla.draw();
  }

  function reset() {
    dla.removeAll();
    dla.createDefaultClusters('Point');
    createCustomWalkers();
  }

  // Create walkers ------------------------------------------------------
  function createCustomWalkers() {
    switch(currentWalkerShape) {
      case 'Triangle':
        Settings.MaxWalkers = 2000;
        break;
      default:
        Settings.MaxWalkers = 1000;
        break;
    }

    for(let i = 0; i < Settings.MaxWalkers; i++) {
      let params = {}, numPoints;

      params.x = p5.random(dla.edges.left, dla.edges.right);
      params.y = p5.random(dla.edges.top, dla.edges.bottom);
      params.type = 'Polygon';
      params.polygon = [];
 
      switch(currentWalkerShape) {
        case 'Triangle':
          numPoints = 3;
          params.rotation = 30;
          break;
        case 'Square':
          numPoints = 4;
          params.rotation = 45;
          break;
        case 'Pentagon':
          numPoints = 5;
          break;
        case 'Hexagon':
          numPoints = 6;
          break;
      }

      const radius = p5.random(5,11);

      for(let j = 0; j < numPoints; j++) {
        params.polygon.push([
          radius * Math.cos( ((360 / numPoints) * j) * Math.PI/180 ),
          radius * Math.sin( ((360 / numPoints) * j) * Math.PI/180 )
        ]);
      }

      dla.createWalker(params);
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
        currentWalkerShape = 'Triangle';
        reset();
        break;

      case '2':
        currentWalkerShape = 'Square';
        reset();
        break;

      case '3':
        currentWalkerShape = 'Pentagon';
        reset();
        break;

      case '4':
        currentWalkerShape = 'Hexagon';
        reset();
        break;

    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);