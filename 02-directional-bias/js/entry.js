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
    world.settings.BiasTowards = 'Center';

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
    let particleCoords = [];

    switch (initialClusterType) {
      // Single particle in center of screen
      case 'Point':
        particleCoords.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });

        break;

      // Series of particles evenly spaced in a circle around center of screen
      case 'Ring':
        let radius = 100,
          numParticles = 20;

        for (let i = 0; i < numParticles; i++) {
          particleCoords.push({
            x: window.innerWidth / 2 + radius * Math.cos((360 / numParticles) * i * Math.PI / 180),
            y: window.innerHeight / 2 + radius * Math.sin((360 / numParticles) * i * Math.PI / 180)
          });
        }

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 5; i++) {
          particleCoords.push({
            x: p5.random(world.edges.left, world.edges.right),
            y: p5.random(world.edges.top, world.edges.bottom)
          });
        }

        break;

      // Line of particles along an edge of the screen or frame
      case 'Wall':
        switch(world.settings.BiasTowards) {
          case 'Top':
            particleCoords = createHorizontalClusterWall(world.edges.top);
            break;

          case 'Bottom':
            particleCoords = createHorizontalClusterWall(world.edges.bottom);
            break;

          case 'Left':
            particleCoords = createVerticalClusterWall(world.edges.left);
            break;

          case 'Right':
            particleCoords = createVerticalClusterWall(world.edges.right);
            break;
        }

        break;
    }

    world.createClusterFromCoords(particleCoords);
  }

  function createHorizontalClusterWall(edge) {
    let coords = [],
        width = Settings.UseFrame ? 900 : window.innerWidth;

    for(let i = 0; i <= width/Settings.CircleDiameter; i++) {
      coords.push({
        x: world.edges.left + i*Settings.CircleDiameter,
        y: edge
      });
    }

    return coords;
  }

  function createVerticalClusterWall(edge) {
    let coords = [],
        height = Settings.UseFrame ? 900 : window.innerHeight;

    for(let i = 0; i <= height/Settings.CircleDiameter; i++) {
      coords.push({
        x: edge,
        y: world.edges.top + i*Settings.CircleDiameter
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

      // Use numbers to change bias direction
      case '1':
        world.pause();
        initialClusterType = 'Point';
        world.settings.BiasTowards = 'Center';
        resetWorld();
        world.unpause();
        break;

      case '2':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Bottom';
        resetWorld();
        world.unpause();
        break;

      case '3':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Top';
        resetWorld();
        world.unpause();
        break;

      case '4':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Left';
        resetWorld();
        world.unpause();
        break;

      case '5':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Right';
        resetWorld();
        world.unpause();
        break;

    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);