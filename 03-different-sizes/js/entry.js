import Settings from './Settings';
import World from '../../core/World';

let world,
    initialClusterType = 'Point';

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.createInitialWalkers();

    // Set up initial (seed) particles for clusters
    createInitialClusters();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    world.createInitialWalkers();
    createInitialClusters();
  }

  function createInitialClusters() {
    let paramsList = [];

    switch (initialClusterType) {
      // Single particle in center of screen
      case 'Point':
        paramsList.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });

        break;

      // Series of particles evenly spaced in a circle around center of screen
      case 'Ring':
        let radius = 100,
          numParticles = 20;

        for (let i = 0; i < numParticles; i++) {
          paramsList.push({
            x: window.innerWidth / 2 + radius * Math.cos((360 / numParticles) * i * Math.PI / 180),
            y: window.innerHeight / 2 + radius * Math.sin((360 / numParticles) * i * Math.PI / 180)
          });
        }

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 5; i++) {
          paramsList.push({
            x: p5.random(world.edges.left, world.edges.right),
            y: p5.random(world.edges.top, world.edges.bottom)
          });
        }

        break;

      // Line of particles along an edge of the screen or frame
      case 'Wall':
        switch(world.settings.BiasTowards) {
          case 'Top':
            paramsList = createHorizontalClusterWall(world.edges.top);
            break;

          case 'Bottom':
            paramsList = createHorizontalClusterWall(world.edges.bottom);
            break;

          case 'Left':
            paramsList = createVerticalClusterWall(world.edges.left);
            break;

          case 'Right':
            paramsList = createVerticalClusterWall(world.edges.right);
            break;

          case 'Edges':
            paramsList = paramsList.concat(createHorizontalClusterWall(world.edges.top));
            paramsList = paramsList.concat(createHorizontalClusterWall(world.edges.bottom));
            paramsList = paramsList.concat(createVerticalClusterWall(world.edges.left));
            paramsList = paramsList.concat(createVerticalClusterWall(world.edges.right));
            break;
        }

        break;
    }

    world.createClusterFromParams(paramsList);
  }

  function createHorizontalClusterWall(edge) {
    let coords = [],
        width = Settings.UseFrame ? 900 : window.innerWidth;

    for(let i = 0; i <= width/5; i++) {
      coords.push({
        x: world.edges.left + i*5,
        y: edge
      });
    }

    return coords;
  }

  function createVerticalClusterWall(edge) {
    let coords = [],
        height = Settings.UseFrame ? 900 : window.innerHeight;

    for(let i = 0; i <= height/5; i++) {
      coords.push({
        x: edge,
        y: world.edges.top + i*5
      });
    }

    return coords;
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
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);