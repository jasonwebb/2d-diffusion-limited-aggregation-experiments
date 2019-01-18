import Settings from './Settings';
import World from '../../core/World';
import Player from './Player';
import SVGLoader from '../../core/SVGLoader';

let world, player;

const TRAIL = 0,
      GRAVITY =  1,
      ASTEROIDS = 2,
      RADIAL = 3;
let currentEffectMode = ASTEROIDS;

let particleSpreadRadius = 20;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    resetWorld();

    // Set up the interactive player object for ASTEROIDS and RADIAL modes
    player = new Player(p5, window.innerWidth/2, window.innerHeight/2);
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    switch(currentEffectMode) {
      case TRAIL:
        if(
          p5.mouseIsPressed && p5.mouseButton === p5.LEFT && 
          p5.mouseX >= world.edges.left + particleSpreadRadius && 
          p5.mouseX <= world.edges.right - particleSpreadRadius && 
          p5.mouseY >= world.edges.top + particleSpreadRadius && 
          p5.mouseY <= world.edges.bottom - particleSpreadRadius
        ) {
          world.createWalker({
            x: p5.mouseX + p5.random(-particleSpreadRadius, particleSpreadRadius),
            y: p5.mouseY + p5.random(-particleSpreadRadius, particleSpreadRadius)
          });
        }

        break;

      case ASTEROIDS:
      case RADIAL:
        break;

      case GRAVITY:
        break;
    }

    world.iterate();
    world.draw();

    if(currentEffectMode == ASTEROIDS || currentEffectMode == RADIAL) {
      player.move();
      player.draw();

      if(player.isShooting && p5.frameCount % 5 == 0) {
        world.createWalker({
          x: player.x,
          y: player.y,
          BiasTowards: {
            x: Math.cos(player.heading) * 5000,
            y: Math.sin(player.heading) * 5000
          }
        });
      }

      if(player.x < world.edges.left) {
        player.x = world.edges.right;
      }

      if(player.x > world.edges.right) {
        player.x = world.edges.left;
      }

      if(player.y < world.edges.top) {
        player.y = world.edges.bottom;
      }

      if(player.y > world.edges.bottom) {
        player.y = world.edges.top;
      }
    }
  }

  function resetWorld() {
    world.removeAll();

    if(currentEffectMode == TRAIL || currentEffectMode == ASTEROIDS || currentEffectMode == RADIAL) {
      world.showWalkers = true;
      // world.createDefaultClusters('Point');
      createCustomShapesFromSVG(require('../svg/dla.svg'));
    } else if(currentEffectMode == GRAVITY) {
      world.showWalkers = false;
    }
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

  // Key down handler -------------------------------------------------------
  p5.keyPressed = function () {
    switch(p5.key) {
      case 'w':
        player.isBoosting = true;
        player.isBraking = false;
        break;

      case 's':
        player.isBoosting = false;
        player.isBraking = true;
        break;
      
      case 'a':
        player.isRotatingLeft = true;
        player.isRotatingRight = false;
        break;

      case 'd':
        player.isRotatingLeft = false;
        player.isRotatingRight = true;
        break;

      case ' ':
        player.isShooting = true;
        break;
    }
  }
  
  // Key up handler ---------------------------------------------------------
  p5.keyReleased = function () {
    if(currentEffectMode == ASTEROIDS) {
      switch(p5.key) {
        case 'w':
          player.isBoosting = false;
          break;

        case 's':
          player.isBraking = false;
          break;

        case 'a':
          player.isRotatingLeft = false;
          break;

        case 'd':
          player.isRotatingRight = false;
          break;

        case ' ':
          player.isShooting = false;
          break;
      }
    }

    switch (p5.key) {
      case ' ':
        if(currentEffectMode != ASTEROIDS && currentEffectMode != RADIAL) {
         world.togglePause();
        }

        break;

      case 'w':
        if(currentEffectMode != ASTEROIDS && currentEffectMode != RADIAL) {
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
        currentEffectMode = GRAVITY;
        resetWorld();
        break;

      case '2':
        currentEffectMode = TRAIL;
        resetWorld();
        break;

      case '3':
        currentEffectMode = ASTEROIDS;
        resetWorld();
        break;

      case '4':
        currentEffectMode = RADIAL;
        resetWorld();
        break;
    }
  }

  // Mouse down handler ----------------------------------------------------------
  p5.mousePressed = function() {
    if(currentEffectMode == GRAVITY) {
      // Spawn walkers in randomly in a circle around the mouse
      world.settings.CircleCenter = {x: p5.mouseX, y: p5.mouseY};
      world.createDefaultWalkers(3000, 'Circle');

      // Add a single clustered "seed" particle at the mouse position
      world.createClusterFromParams([
        {
          x: p5.mouseX,
          y: p5.mouseY
        }
      ]);

      // Make all walkers move towards the mouse
      for(let body of world.bodies) {
        body.BiasTowards = {
          x: p5.mouseX,
          y: p5.mouseY
        };
      }
    }
  }

  // Mouse up handler -----------------------------------------------------------
  p5.mouseReleased = function() {
    if(currentEffectMode == GRAVITY) {
      resetWorld();
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);