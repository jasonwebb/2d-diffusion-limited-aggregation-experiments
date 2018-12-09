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
    this.showClusters = this.settings.ShowClusters;

    // Number of active walkers
    this.numWalkers = 0;

    // Outer edges of active sketch area (screen or confined "frame")
    this.edges = {}

    if (this.settings.UseFrame) {
      this.edges.left = window.innerWidth / 2 - 900 / 2;
      this.edges.right = window.innerWidth / 2 + 900 / 2;
      this.edges.top = window.innerHeight / 2 - 900 / 2;
      this.edges.bottom = window.innerHeight / 2 + 900 / 2;
    } else {
      this.edges.left = 0;
      this.edges.right = window.innerWidth;
      this.edges.top = 0;
      this.edges.bottom = window.innerHeight;
    }

    // Collision system
    this.system = new Collisions();
    this.bodies = [];

    // Spawn initial walkers
    this.createInitialWalkers();
  }


  //======================
  //  Run one iteration
  //======================
  iterate() {
    // Skip this iteration when the world is paused
    if (this.paused) {
      return;
    }

    // Replenish any walkers that stuck to the cluster(s) in the last iteration
    if (this.settings.ReplenishWalkers && this.numWalkers < this.settings.MaxWalkers) {
      this.createWalkers(this.settings.MaxWalkers - this.numWalkers);
    }

    // Move all the walkers
    this.moveWalkers();

    // Update the collision system
    this.system.update();

    // Check for collisions and convert walkers to cluster particles as needed
    this.handleCollisions();
  }


  //======================
  //  Drawing methods
  //======================
  // TODO: implement "show clusters"
  draw() {
    this.p5.background(255);
    this.p5.noStroke();

    // Draw all particles (both walkers and clustered particles)
    for (let body of this.bodies) {
      if (body.stuck) {
        this.p5.fill(0, 0, 120);
      } else {
        this.p5.fill(0, 0, 230);
      }

      if ((!body.stuck && this.showWalkers) || (body.stuck && this.showClusters)) {
        this.p5.ellipse(body.x, body.y, this.settings.CircleDiameter);
      }
    }

    // Draw a square around the active area, if set
    if (this.settings.UseFrame) {
      this.drawFrame();
    }
  }

  drawFrame() {
    this.p5.noFill();
    this.p5.stroke(0);
    this.p5.rect(window.innerWidth / 2 - 900 / 2, window.innerHeight / 2 - 900 / 2, 900, 900);
  }


  //======================
  //  Move all walkers
  //======================
  moveWalkers() {
    if (this.bodies.length > 0) {
      for (let body of this.bodies) {

        // TODO: prune walkers (remove walkers that have gotten too 'old')

        if (!body.stuck) {
          // Start with a randomized movement (Brownian motion)
          let deltaX = this.p5.random(-2, 2),
            deltaY = this.p5.random(-2, 2);

          // Add in a bias towards a specific direction, if set
          switch (this.settings.BiasTowards) {
            case 'Top':
              deltaY -= this.settings.BiasForce;
              break;

            case 'Bottom':
              deltaY += this.settings.BiasForce;
              break;

            case 'Left':
              deltaX -= this.settings.BiasForce;
              break;

            case 'Right':
              deltaX += this.settings.BiasForce;
              break;

            case 'Center':
              // 1. Get angle between body and screen center
              // 2. Move particle along this angle using BiasForce
              break;
          }

          // Apply deltas unless doing so would move the walker outside the sketch bounds
          if (body.x + deltaX > this.edges.left && body.x + deltaX < this.edges.right) {
            body.x += deltaX;
          }

          if (body.y + deltaY > this.edges.top && body.y + deltaY < this.edges.bottom) {
            body.y += deltaY;
          }

          // Increment age of the walker
          body.age++;
        }
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
          this.numWalkers--;

          // TODO: create a line between the two bodies for line rendering mode
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
    body.age = 0;

    this.bodies.push(body);
  }

  createWalker(x, y) {
    this.createParticle(x, y);
    this.numWalkers++;
  }

  createWalkers(count) {
    for (let i = 0; i < count; i++) {
      let x, y;

      switch (this.settings.WalkerSource) {
        // Edges = spawn walkers at screen edges
        case 'Edges':
          let edge = Math.round(p5.random(1, 4));

          switch (edge) {
            case 1: // top
              x = p5.random(window.innerWidth);
              y = 0;
              break;

            case 2: // right
              x = window.innerWidth;
              y = p5.random(window.innerHeight);
              break;

            case 3: // bottom
              x = p5.random(window.innerWidth);
              y = window.innerHeight;
              break;

            case 4: // left
              x = 0;
              y = p5.random(window.innerHeight);
              break;
          }

          break;

          // Circle = spawn walkers in a circle around the center of the screen
        case 'Circle':
          let radius = 50,
            angle = this.p5.random(360);

          x = window.innerWidth / 2 + radius * Math.cos(angle * Math.PI / 180);
          y = window.innerHeight / 2 + radius * Math.sin(angle * Math.PI / 180);
          break;

          // Random = spawn walkers randomly throughout the entire screen
        case 'Random':
          if (this.settings.UseFrame) {
            x = this.p5.random(window.innerWidth / 2 - 900 / 2, window.innerWidth / 2 + 900 / 2);
            y = this.p5.random(window.innerHeight / 2 - 900 / 2, window.innerHeight / 2 + 900 / 2);
          } else {
            x = this.p5.random(window.innerWidth);
            y = this.p5.random(window.innerHeight);
          }

          break;

          // Center = spawn all walkers at screen center
        case 'Center':
          x = window.innerWidth / 2;
          y = window.innerHeight / 2;
          break;
      }

      // Create a walker with the coordinates
      this.createWalker(x, y);
    }
  }

  createInitialWalkers() {
    this.createWalkers(this.settings.MaxWalkers);
  }

  createClusterFromCoords(coordList) {
    if (coordList.length > 0) {
      for (let coords of coordList) {
        this.createParticle(coords.x, coords.y, true);
      }
    }
  }


  //==============
  //  Removers
  //==============
  removeAll() {
    for (let body of this.bodies) {
      this.system.remove(body);
    }

    this.bodies = [];
    this.numWalkers = 0;
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

  toggleShowClusters() {
    this.showClusters = !this.showClusters;
  }

}

export default World;