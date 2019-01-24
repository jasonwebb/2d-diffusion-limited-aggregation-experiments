import Settings from './Settings';
import World from '../../core/World';

let world;

const PERLIN = 0,
  SWIRLS = 1,
  CLIFFORD = 2;
let currentMode = PERLIN;

// Clifford attractor params
let a = Math.random() * 4 - 2,
  b = Math.random() * 4 - 2,
  c = Math.random() * 4 - 2,
  d = Math.random() * 4 - 2;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.customMovementFunction = getForceAt;
    resetWorld();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    world.createDefaultWalkers();

    world.createClusterFromParams(world.createVerticalClusterWall(world.edges.left));
    world.createClusterFromParams(world.createVerticalClusterWall(world.edges.right));
    
    world.createClusterFromParams(world.createHorizontalClusterWall(world.edges.top));
    world.createClusterFromParams(world.createHorizontalClusterWall(world.edges.bottom));

    // world.createDefaultClusters('Random');
  }

  function getForceAt(body) {
    let timeScale = .2,
      heading;
    
    switch(currentMode) {
      case PERLIN:
        heading = getPerlinHeading(body);
        break;

      case SWIRLS:
        heading = getSineSwirlHeading(body);
        break;

      case CLIFFORD:
        heading = getCliffordAttractorHeading(body);
        break;
    }
    
    return {
      dx: Math.cos(heading) * timeScale,
      dy: Math.sin(heading) * timeScale
    }
  }

  function getPerlinHeading(body) {
    return p5.noise(body.x * .01, body.y * .01) * Math.PI * 2;
  }

  function getSineSwirlHeading(body) {
    return (Math.sin(body.x * .034) + Math.sin(body.y * .03)) * Math.PI * 2
  }

  function getCliffordAttractorHeading(body) {
    let x1 = (body.x - window.innerWidth / 2) * .005,
      y1 = (body.y - window.innerHeight / 2) * .005,
      x2 = Math.sin(a * y1) + c * Math.cos(a * x1),
      y2 = Math.sin(b * x1) + d * Math.cos(b * y1);

    return Math.atan2(y2 - y1, x2 - x1);
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

      case '1':
        currentMode = PERLIN;
        resetWorld();
        break;

      case '2':
        currentMode = SWIRLS;
        resetWorld();
        break;

      case '3':
        currentMode = CLIFFORD;
        resetWorld();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);