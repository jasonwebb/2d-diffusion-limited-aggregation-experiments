import Settings from './Settings';
import Particle from '../../core/Particle';
import World from '../../core/World';

let world,
    maxNodes = 5000;
 

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
    world.cluster = [
      new Particle(p5, window.innerWidth/2, window.innerHeight/2, 10)
    ];
  }

  // Draw ---------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();

    // Keep replenishing the walkers
    if(world.walkers.length < maxNodes) {
      let edge = Math.round(p5.random(1,4)),
          particle = new Particle(p5, 0, 0, 10);

      switch(edge) {
        case 1:   // top
          particle.x = p5.random(window.innerWidth);
          particle.y = 0;
          break;

        case 2:   // right
          particle.x = window.innerWidth;
          particle.y = p5.random(window.innerHeight);
          break;

        case 3:   // bottom
          particle.x = p5.random(window.innerWidth);
          particle.y = window.innerHeight;
          break;

        case 4:   // left
          particle.x = 0;
          particle.y = p5.random(window.innerHeight);
          break;
      }

      world.addWalker(particle);
    }
  }


  /*
  =============================================================================
    Key handler
  =============================================================================
  */
  p5.keyReleased = function() {
    switch (p5.key) {
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);