import Settings from './Settings';
import World from '../../core/World';
import Player from './Player';
import SVGLoader from '../../core/SVGLoader';

let world, player;

const TRAIL = 0,
      FREE = 1,
      RADIAL = 2;
let currentEffectMode = TRAIL;

let particleRadius = 20;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    // world.createDefaultClusters(Settings.InitialClusterType);
    createCustomShapesFromSVG(require('../svg/dla.svg'));

    player = new Player(p5, window.innerWidth/2, window.innerHeight/2);
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    // In trail mode, spawn walkers around the cursor when left mouse button is held
    if(currentEffectMode == TRAIL && p5.mouseIsPressed && p5.mouseButton === p5.LEFT && 
       p5.mouseX >= world.edges.left + particleRadius && 
       p5.mouseX <= world.edges.right - particleRadius && 
       p5.mouseY >= world.edges.top + particleRadius && 
       p5.mouseY <= world.edges.bottom - particleRadius
    ) {
      world.createWalker({
        x: p5.mouseX + p5.random(-particleRadius, particleRadius),
        y: p5.mouseY + p5.random(-particleRadius, particleRadius)
      });
    } else if(currentEffectMode == FREE && p5.keyIsPressed) {
      player.handleKey(p5.key);

      if(p5.key == ' ') {
        world.createWalker({
          x: player.x,
          y: player.y
        });
      }
    }

    world.iterate();
    world.draw();

    if(currentEffectMode == FREE || currentEffectMode == RADIAL) {
      player.move();
      player.draw();
    }
  }

  function resetWorld() {
    world.removeAll();
    world.createDefaultClusters(Settings.InitialClusterType);
    createCustomShapesFromSVG(require('../svg/dla.svg'));
  }

  
  function createCustomShapesFromSVG(file) {
    let paths = SVGLoader.loadFromFileContents(file);
    
    for(let path of paths) {
      path.stuck = true;
      path.solid = false;
      path.x += window.innerWidth / 2 - 900 / 2;
      path.y += window.innerHeight / 2 - 900 / 2;
    }

    world.createShapesFromPaths(paths);
  }
  
  // Key handler ---------------------------------------------------------
  p5.keyReleased = function () {
    switch (p5.key) {
      case ' ':
        if(currentEffectMode == TRAIL) {
          world.togglePause();
        }
        
        break;

      case 'w':
        if(currentEffectMode == TRAIL) {
          world.toggleShowWalkers();
        }

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
        currentEffectMode = TRAIL;
        resetWorld();
        break;

      case '2':
        currentEffectMode = FREE;
        resetWorld();
        break;

      case '3':
        currentEffectMode = RADIAL;
        resetWorld();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);