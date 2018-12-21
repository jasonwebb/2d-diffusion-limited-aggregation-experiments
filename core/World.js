import Defaults from './Defaults';
import Collisions from 'collisions';

/*
=============================================================================
  World class
=============================================================================
*/

export default class World {
  constructor(p5, settings) {
    this.p5 = p5;
    this.settings = Object.assign({}, Defaults, settings);

    // State flags
    this.paused = false;
    this.showWalkers = this.settings.ShowWalkers;
    this.showClusters = this.settings.ShowClusters;
    this.useFrame = this.settings.UseFrame;

    // Number of active walkers
    this.numWalkers = 0;

    this.edgeMargin = this.settings.hasOwnProperty('EdgeMargin') ? this.settings.EdgeMargin : 0;

    // Outer edges of active sketch area (screen or confined "frame")
    this.edges = {};
    this.frame = {};

    if (typeof this.settings.FrameSize == 'number') {
      this.frame.left = window.innerWidth / 2 - this.settings.FrameSize / 2;
      this.frame.right = window.innerWidth / 2 + this.settings.FrameSize / 2;
      this.frame.top = window.innerHeight / 2 - this.settings.FrameSize / 2;
      this.frame.bottom = window.innerHeight / 2 + this.settings.FrameSize / 2;
    } else if (typeof this.settings.FrameSize == 'object') {
      this.frame.left = window.innerWidth / 2 - this.settings.FrameSize[0] / 2;
      this.frame.right = window.innerWidth / 2 + this.settings.FrameSize[0] / 2;
      this.frame.top = window.innerHeight / 2 - this.settings.FrameSize[1] / 2;
      this.frame.bottom = window.innerHeight / 2 + this.settings.FrameSize[1] / 2;
    }

    this.resetEdges();

    // Precalculate the largest possible distance of any particle to center for use in distance-based effects later
    this.maxDistance = this.p5.dist(this.edges.left, this.edges.top, window.innerWidth / 2, window.innerHeight / 2);

    // Collision system
    this.system = new Collisions();
    this.bodies = [];
    this.shapes = [];
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
      this.createDefaultWalkers(this.settings.MaxWalkers - this.numWalkers, this.settings.ReplenishmentSource);
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
  draw() {
    this.p5.background(255);

    // Draw all custom shapes
    for (let shape of this.shapes) {
      this.p5.noFill();
      this.p5.stroke(100);

      this.p5.beginShape();

        for (let i = 0; i < shape._coords.length; i += 2) {
          this.p5.vertex(shape._coords[i], shape._coords[i + 1]);
        }

      this.p5.endShape();
    }

    // Draw all walkers and clustered particles
    for (let body of this.bodies) {
      // Points
      if (body._point) {
        this.p5.noFill();

        if (body.stuck && this.showClusters) {
          this.p5.noStroke();
          this.p5.fill(200);
          this.p5.ellipse(body.x, body.y, 5);
          this.p5.stroke(0);
        } else if (!body.stuck && this.showWalkers) {
          this.p5.stroke(0);
        } else {
          this.p5.noStroke();
        }

        this.p5.point(body.x, body.y);

      // Circles
      } else if (body._circle) {
        this.p5.noStroke();

        if (body.stuck && this.showClusters) {
          this.p5.fill(120);
        } else if (!body.stuck && this.showWalkers) {
          this.p5.fill(230);
        } else {
          this.p5.noFill();
        }

        this.p5.ellipse(body.x, body.y, body.radius * 2);

      // Polygons
      } else if (body._polygon) {
        this.p5.noStroke();

        if (body.stuck && this.showClusters) {
          this.p5.fill(120);
        } else if (!body.stuck && this.showWalkers) {
          this.p5.fill(230);
        } else {
          this.p5.noFill();
        }

        this.p5.beginShape();

        for (let i = 0; i < body._coords.length - 1; i += 2) {
          this.p5.vertex(body._coords[i], body._coords[i + 1]);
        }

        this.p5.endShape();
      }
    }

    // Draw a square around the active area, if set
    if (this.useFrame) {
      this.drawFrame();
    }
  }

  drawFrame() {
    this.p5.noFill();
    this.p5.stroke(0);

    if (typeof this.settings.FrameSize == 'number') {
      this.p5.rect(
        window.innerWidth / 2 - this.settings.FrameSize / 2 - 1,
        window.innerHeight / 2 - this.settings.FrameSize / 2 - 1,
        this.settings.FrameSize + 2,
        this.settings.FrameSize + 2
      );
    } else if (typeof this.settings.FrameSize == 'object') {
      this.p5.rect(
        window.innerWidth / 2 - this.settings.FrameSize[0] / 2 - 1,
        window.innerHeight / 2 - this.settings.FrameSize[1] / 2 - 1,
        this.settings.FrameSize[0] + 2,
        this.settings.FrameSize[1] + 2
      )
    }
  }

  resetEdges() {
    this.edges.left = this.useFrame ? this.frame.left : 0;
    this.edges.right = this.useFrame ? this.frame.right : window.innerWidth;
    this.edges.top = this.useFrame ? this.frame.top : 0;
    this.edges.bottom = this.useFrame ? this.frame.bottom : window.innerHeight;
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
          let deltaX = this.p5.random(-1, 1),
            deltaY = this.p5.random(-1, 1),
            deltas;

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
              deltas = this.getDeltasTowards(body.x, body.y, window.innerWidth / 2, window.innerHeight / 2);
              deltaX += deltas.x;
              deltaY += deltas.y;
              break;

            case 'Edges':
              deltas = this.getDeltasTowards(body.x, body.y, window.innerWidth / 2, window.innerHeight / 2);
              deltaX -= deltas.x;
              deltaY -= deltas.y;
              break;

            case 'Equator':
              if (body.y < window.innerHeight / 2) {
                deltaY += this.settings.BiasForce;
              } else {
                deltaY -= this.settings.BiasForce;
              }

              break;

            case 'Meridian':
              if (body.x < window.innerWidth / 2) {
                deltaX += this.settings.BiasForce;
              } else {
                deltaX -= this.settings.BiasForce;
              }

              break;

          }

          // Ensure only whole numbers for single-pixel particles so they are always "on lattice"
          if (body._point) {
            deltaX = Math.round(deltaX);
            deltaY = Math.round(deltaY);
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

  getDeltasTowards(bodyX, bodyY, targetX, targetY) {
    let angle = Math.atan2(targetY - bodyY, targetX - bodyX);

    return {
      x: Math.cos(angle) * this.settings.BiasForce,
      y: Math.sin(angle) * this.settings.BiasForce
    }
  }


  //=====================================================
  //  Look for collisions between walkers and clusters
  //=====================================================

  // TODO: flip the logic so that we only check _clustered particles_ against potential collisions, not _all particles_ for potentials?
  handleCollisions() {
    // Look for collisions between walkers and custom shapes
    for (let shape of this.shapes) {
      const potentials = shape.potentials();

      for (let secondBody of potentials) {
        if (shape.collides(secondBody)) {
          secondBody.stuck = true;
          this.numWalkers--;
        }
      }
    }

    // Look for collisions between walkers and clustered particles
    for (let body of this.bodies) {
      // Cut down on duplicate computations by only looking for collisions on walkers
      if (body.stuck) {
        continue;
      }

      // Look for broadphase collisions
      const potentials = body.potentials();

      for (let secondBody of potentials) {

        // Points should be checked for adjacency to a stuck particle 
        if (body._point) {
          if (secondBody.stuck) {
            body.stuck = true;
            this.numWalkers--;
          }

          // Circles and polygons should be checked for collision (overlap) with potentials
        } else {
          if (secondBody.stuck && body.collides(secondBody)) {
            body.stuck = true;
            this.numWalkers--;

            // TODO: create a line between the two bodies for line rendering mode
          }
        }
      }
    }
  }


  //====================
  //  Create methods
  //====================
  createParticle(params) {
    if (typeof params == 'undefined' || typeof params != 'object') {
      return;
    }

    let body;

    if (params.hasOwnProperty('type')) {
      switch (params.type) {
        case 'Point':
          body = this.system.createPoint(Math.round(params.x), Math.round(params.y));
          body._point = true;
          break;

        case 'Circle':
        default:
          body = this.system.createCircle(params.x, params.y, params.diameter / 2);
          body._circle = true;
          break;

        case 'Polygon':
          body = this.system.createPolygon(params.x, params.y, params.polygon, params.hasOwnProperty('rotation') ? this.p5.radians(params.rotation) : 0);
          body._polygon = true;
          break;
      }
    } else {
      const defaultDiameter = this.settings.hasOwnProperty('CircleDiameter') ? this.settings.CircleDiameter : this.settings.DefaultCircleDiameter;
      const diameter = params.hasOwnProperty('diameter') ? params.diameter : defaultDiameter;
      body = this.system.createCircle(params.x, params.y, diameter / 2);
      body._circle = true;
    }

    body.stuck = params.hasOwnProperty('stuck') ? params.stuck : false;
    body.age = 0;

    this.bodies.push(body);
  }

  createWalker(params) {
    this.createParticle(params);
    this.numWalkers++;
  }

  createDefaultWalkers(count = this.settings.MaxWalkers, source = this.settings.WalkerSource) {
    for (let i = 0; i < count; i++) {
      let params = {};

      switch (source) {
        // Edges = spawn walkers at screen edges
        case 'Edges':
          let edge = Math.round(this.p5.random(1, 4));

          switch (edge) {
            case 1: // top
              params.x = this.p5.random(this.edges.left, this.edges.right);
              params.y = this.p5.random(this.edges.top, this.edges.top + this.edgeMargin);
              break;

            case 3: // bottom
              params.x = this.p5.random(this.edges.left, this.edges.right);
              params.y = this.p5.random(this.edges.bottom - this.edgeMargin, this.edges.bottom);
              break;

            case 4: // left
              params.x = this.p5.random(this.edges.left, this.edges.left + this.edgeMargin);
              params.y = this.p5.random(this.edges.top + this.edgeMargin, this.edges.bottom - this.edgeMargin);
              break;

            case 2: // right
              params.x = this.p5.random(this.edges.right - this.edgeMargin, this.edges.right);
              params.y = this.p5.random(this.edges.top + this.edgeMargin, this.edges.bottom - this.edgeMargin);
              break;
          }

          break;

        // Circle = spawn walkers in a circle around the center of the screen
        case 'Circle':
          let radius = 50,
            angle = this.p5.random(360);

          params.x = window.innerWidth / 2 + radius * Math.cos(angle * Math.PI / 180);
          params.y = window.innerHeight / 2 + radius * Math.sin(angle * Math.PI / 180);
          break;

        // Random = spawn walkers randomly throughout the entire screen
        case 'Random':
          params.x = this.p5.random(this.edges.left, this.edges.right);
          params.y = this.p5.random(this.edges.top, this.edges.bottom);
          break;

        case 'Random-Circle':
          let a = this.p5.random(360),
            r = this.p5.random(5, 900 / 2 - 20);

          params.x = window.innerWidth / 2 + r * Math.cos(a * Math.PI / 180);
          params.y = window.innerHeight / 2 + r * Math.sin(a * Math.PI / 180);
          break;

        // Center = spawn all walkers at screen center
        case 'Center':
          params.x = window.innerWidth / 2;
          params.y = window.innerHeight / 2;
          break;
      }

      // Vary diameter based on distance, if enabled
      if (this.settings.VaryDiameterByDistance) {
        let dist = this.p5.dist(params.x, params.y, window.innerWidth / 2, window.innerHeight / 2);
        params.diameter = this.p5.map(dist, 0, this.maxDistance, this.settings.CircleDiameterRange[0], this.settings.CircleDiameterRange[1]);
      }

      // Create a walker with the coordinates
      this.createWalker(params);
    }
  }

  createDefaultClusters(clusterType = this.settings.DefaultInitialClusterType) {
    let paramsList = [];

    switch (clusterType) {
      // Single particle in center of screen
      case 'Point':
        paramsList.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          diameter: this.settings.DefaultCircleDiameter
        });

        break;

      // Series of particles evenly spaced in a circle around center of screen
      case 'Ring':
        let radius = 100,
          numParticles = 20;

        for (let i = 0; i < numParticles; i++) {
          paramsList.push({
            x: window.innerWidth / 2 + radius * Math.cos((360 / numParticles) * i * Math.PI / 180),
            y: window.innerHeight / 2 + radius * Math.sin((360 / numParticles) * i * Math.PI / 180),
            diameter: this.settings.DefaultCircleDiameter
          });
        }

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 5; i++) {
          paramsList.push({
            x: this.p5.random(this.edges.left, this.edges.right),
            y: this.p5.random(this.edges.top, this.edges.bottom),
            diameter: this.settings.DefaultCircleDiameter
          });
        }

        break;

      // Line of particles along an edge of the screen or frame
      case 'Wall':
        switch (this.settings.BiasTowards) {
          case 'Top':
            paramsList = this.createHorizontalClusterWall(this.edges.top);
            break;

          case 'Bottom':
            paramsList = this.createHorizontalClusterWall(this.edges.bottom);
            break;

          case 'Left':
            paramsList = this.createVerticalClusterWall(this.edges.left);
            break;

          case 'Right':
            paramsList = this.createVerticalClusterWall(this.edges.right);
            break;

          case 'Edges':
            paramsList = paramsList.concat(this.createHorizontalClusterWall(this.edges.top));
            paramsList = paramsList.concat(this.createHorizontalClusterWall(this.edges.bottom));
            paramsList = paramsList.concat(this.createVerticalClusterWall(this.edges.left));
            paramsList = paramsList.concat(this.createVerticalClusterWall(this.edges.right));
            break;

          case 'Equator':
            paramsList = paramsList.concat(this.createHorizontalClusterWall(window.innerHeight / 2));
            break;

          case 'Meridian':
            paramsList = paramsList.concat(this.createVerticalClusterWall(window.innerWidth / 2));
            break;
        }

        break;
    }

    this.createClusterFromParams(paramsList);
  }

  createHorizontalClusterWall(edge) {
    let coords = [],
      width = this.useFrame ? 900 : window.innerWidth;

    for (let i = 0; i <= width / this.settings.CircleDiameter; i++) {
      coords.push({
        x: this.edges.left + i * this.settings.CircleDiameter,
        y: edge,
        diameter: this.settings.CircleDiameter
      });
    }

    return coords;
  }

  createVerticalClusterWall(edge) {
    let coords = [],
      height = this.useFrame ? 900 : window.innerHeight;

    for (let i = 0; i <= height / this.settings.CircleDiameter; i++) {
      coords.push({
        x: edge,
        y: this.edges.top + i * this.settings.CircleDiameter,
        diameter: this.settings.CircleDiameter
      });
    }

    return coords;
  }

  createClusterFromParams(paramsList) {
    if (paramsList.length > 0) {
      for (let params of paramsList) {
        params.stuck = true;
        this.createParticle(params);
      }
    }
  }

  createShapesFromPaths(paths) {
    if (!paths.hasOwnProperty('points') && paths.length == 0) {
      console.error('Unable to create shapes. Paths must have an array of points [[x,y],...]');
      return;
    }

    for (let path of paths) {
      // Create a single polygon if the shape is marked as "solid"
      if (path.solid) {
        let shape = this.system.createPolygon(path.x, path.y, path.points);
        shape.solid = path.solid;
        shape.closed = path.closed;
        this.shapes.push(shape);

      // Create a series of separate line segments if shape is not "solid", per https://github.com/Sinova/Collisions#anchor-lines
      } else {
        for (let i = 1; i < path.points.length; i++) {
          let line = this.system.createPolygon(path.x, path.y, [[path.points[i - 1][0], path.points[i - 1][1]], [path.points[i][0], path.points[i][1]]]);
          line.solid = false;
          line.closed = false;
          this.shapes.push(line);
        }
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

    for (let shape of this.shapes) {
      this.system.remove(shape);
    }

    this.bodies = [];
    this.shapes = [];
    this.numWalkers = 0;
  }


  //==============
  //  Togglers
  //==============
  togglePause() {
    this.paused = !this.paused;
  }

  toggleShowWalkers() {
    this.showWalkers = !this.showWalkers;
  }

  toggleShowClusters() {
    this.showClusters = !this.showClusters;
  }

  toggleUseFrame() {
    this.useFrame = !this.useFrame;
    this.resetEdges();
  }


  //===================
  //  Pause/unpause
  //===================
  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

}