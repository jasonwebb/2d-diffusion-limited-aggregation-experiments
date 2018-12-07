import Settings from './Settings';
import World from '../../core/World';

let world;
 

/*
=============================================================================
  Main sketch
=============================================================================
*/

const sketch = function (p5) {
  // Setup -------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);

    // Put a single Particle in the screen center to seed growth
    world.createClusterFromCoords(
      [
        { 
          x: window.innerWidth/2, 
          y: window.innerHeight/2
        }
      ]
    );
  }

  // Draw ---------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();

    // Keep replenishing the walkers
    if(!world.paused) {
      let edge = Math.round(p5.random(1,4)),
          x = 0,
          y = 0;

      switch(edge) {
        case 1:   // top
          x = p5.random(window.innerWidth);
          y = 500;
          break;

        case 2:   // right
          x = window.innerWidth - 500;
          y = p5.random(window.innerHeight);
          break;

        case 3:   // bottom
          x = p5.random(window.innerWidth);
          y = window.innerHeight - 500;
          break;

        case 4:   // left
          x = 500;
          y = p5.random(window.innerHeight);
          break;
      }

      world.createWalker(x, y);
    }
  }


  /*
  =============================================================================
    Key handler
  =============================================================================
  */
  p5.keyReleased = function() {
    switch (p5.key) {
      case ' ':
        world.togglePause();
        break;

      case 'w':
        world.toggleShowWalkers();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);