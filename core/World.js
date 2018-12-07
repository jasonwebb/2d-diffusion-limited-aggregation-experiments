import Defaults from './Defaults';
import Collisions from 'collisions';

/*
=============================================================================
  World class
=============================================================================
*/

class World {
  constructor(p5, settings) {
    this.p5 = p5;
    this.settings = Object.assign({}, Defaults, settings);

    // State flags
    this.paused = false;
    this.showWalkers = this.settings.ShowWalkers;

    // Collision system
    this.system = new Collisions();
    this.bodies = [];

  }


  //======================
  //  Run one iteration
  //======================
  iterate() {
    // Skip this iteration when the world is paused
    if (this.paused) {
      return;
    }

    // Move all non-stuck bodies (walkers) randomly
    if (this.bodies.length > 0) {
      for (let body of this.bodies) {
        if (!body.stuck) {
          let deltaX = this.p5.random(-1, 1),
            deltaY = this.p5.random(-1, 1);

          if (body.x + deltaX > 0 && body.x + deltaX < window.innerWidth) {
            body.x += deltaX;
          }

          if (body.y + deltaY > 0 && body.y + deltaY < window.innerHeight) {
            body.y += deltaY;
          }
        }
      }
    }

    // Update the collision system
    this.system.update();

    // Check for collisions and convert walkers to cluster particles as needed
    this.handleCollisions();
  }


  //====================================
  //  Render all walkers and clusters
  //====================================
  draw() {
    this.p5.background(255);
    this.p5.noStroke();

    for (let body of this.bodies) {
      if (body.stuck) {
        this.p5.fill(255, 255, 255);
      } else {
        this.p5.fill(0);
      }

      if (this.showWalkers || body.stuck) {
        this.p5.ellipse(body.x, body.y, this.settings.CircleDiameter);
      }
    }
  }


  //=====================================================
  //  Look for collisions between walkers and clusters
  //=====================================================
  handleCollisions() {
    for (let body of this.bodies) {
      // Cut down on duplicate computations by only looking for collisions on walkers
      if (body.stuck) {
        continue;
      }

      // Look for broadphase collisions
      const potentials = body.potentials();

      for (let secondBody of potentials) {
        // When a walker collides with a clustered particle, attach it to that cluster
        if (secondBody.stuck && body.collides(secondBody)) {
          body.stuck = true;
        }
      }
    }
  }


  //====================
  //  Create methods
  //====================
  createParticle(x, y, stuck = false) {
    let body = this.system.createCircle(x, y, this.settings.CircleDiameter / 2);
    body.stuck = stuck;
    this.bodies.push(body);
  }

  createWalker(x, y) {
    this.createParticle(x, y);
  }

  createClusterFromCoords(coordList) {
    if (coordList.length > 0) {
      for (let coords of coordList) {
        this.createParticle(coords.x, coords.y, true);
      }
    }
  }


  //=================
  //  Togglers
  //=================
  togglePause() {
    this.paused = !this.paused;
  }

  toggleShowWalkers() {
    this.showWalkers = !this.showWalkers;
  }

}

export default World;