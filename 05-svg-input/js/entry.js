import Settings from './Settings';
import World from '../../core/World';
import SVGLoader from '../../core/SVGLoader';

let svgFiles = {
  dla: require("../svg/dla.svg")
}

let world;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.createDefaultWalkers();

    // Load shapes from SVG file
    createCustomShapesFromSVG(svgFiles.dla);
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    createCustomShapesFromSVG(svgFiles.dla);
    world.createDefaultWalkers();
  }

  function createCustomShapesFromSVG(file) {
    let paths = SVGLoader.loadFromFileContents(file);
    
    for(let path of paths) {
      path.stuck = true;
      path.solid = false;
      path.x += window.innerWidth / 2 - 900 / 2 + 50;
      path.y += window.innerHeight / 2 - 900 / 2;
    }

    world.createShapesFromPaths(paths);
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
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);