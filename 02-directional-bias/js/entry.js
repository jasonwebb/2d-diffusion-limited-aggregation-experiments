import Settings from './Settings';
import World from '../../core/World';

let world,
    initialClusterType = 'Wall';

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.settings.BiasTowards = 'Bottom';
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
          y: window.innerHeight / 2,
          diameter: Settings.CircleDiameter
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
            diameter: Settings.CircleDiameter
          });
        }

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 5; i++) {
          paramsList.push({
            x: p5.random(world.edges.left, world.edges.right),
            y: p5.random(world.edges.top, world.edges.bottom),
            diameter: Settings.CircleDiameter
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
          
          case 'Equator':
            paramsList = paramsList.concat(createHorizontalClusterWall(window.innerHeight / 2));
            break;

          case 'Meridian':
            paramsList = paramsList.concat(createVerticalClusterWall(window.innerWidth /2 ));
            break;
        }

        break;
    }

    world.createClusterFromParams(paramsList);
  }

  function createHorizontalClusterWall(edge) {
    let coords = [],
        width = Settings.UseFrame ? 900 : window.innerWidth;

    for(let i = 0; i <= width/Settings.CircleDiameter; i++) {
      coords.push({
        x: world.edges.left + i*Settings.CircleDiameter,
        y: edge,
        diameter: Settings.CircleDiameter
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
        y: world.edges.top + i*Settings.CircleDiameter,
        diameter: Settings.CircleDiameter
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
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Bottom';
        resetWorld();
        world.unpause();
        break;

      case '2':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Top';
        resetWorld();
        world.unpause();
        break;

      case '3':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Left';
        resetWorld();
        world.unpause();
        break;

      case '4':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Right';
        resetWorld();
        world.unpause();
        break;

      case '5':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Equator';
        resetWorld();
        world.unpause();
        break;

      case '6':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Meridian';
        resetWorld();
        world.unpause();
        break;

      case '7':
        world.pause();
        initialClusterType = 'Wall';
        world.settings.BiasTowards = 'Edges';
        resetWorld();
        world.unpause();
        break;

      case '8':
        world.pause();
        initialClusterType = 'Point';
        world.settings.BiasTowards = 'Center';
        resetWorld();
        world.unpause();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);