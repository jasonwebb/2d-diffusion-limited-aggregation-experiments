import Particle from './Particle';
import Defaults from './Defaults';

import {Collisions, Circle, Polygon, Point} from 'collisions';

/*
=============================================================================
  World class
=============================================================================
*/

class World {
  constructor(p5, settings) {
    this.p5 = p5;
    this.settings = Object.assign({}, Defaults, settings);

    this.paused = false;

    this.cluster = [];
    this.walkers = [];
  }

  iterate() {
    // Skip this iteration when the world is paused
    if (this.paused) { return; }

    // Move all the walkers
    if(this.walkers.length > 0) {
      for(let walker of this.walkers) {
        walker.iterate();
      }
    }
  }

  draw() {
    this.p5.background(255);

    // Draw all the walkers
    if(this.walkers.length > 0 && this.settings.ShowWalkers) {
      for(let walker of this.walkers) {
        walker.draw();
      }
    }
  }

  addWalker(particle) {
    this.walkers.push(particle);
  }

}

export default World;