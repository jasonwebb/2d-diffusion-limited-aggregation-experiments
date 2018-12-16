import Settings from './Settings';
import World from '../../core/World';

let world,
    currentClusterType = 'Point',
    currentWalkerShape = Settings.WalkerShape;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);

    // Set up initial (seed) particles for clusters
    createInitialClusters();

    // Create initial walkers through custom function for more control over shape
    createInitialWalkers();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    createInitialWalkers();
    createInitialClusters();
  }

  function createInitialClusters() {
    let paramsList = [];

    switch (currentClusterType) {
      // Single particle in center of screen
      case 'Point':
        paramsList.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });

        break;

      // Individual particles randomly distributed across entire screen
      case 'Random':
        for (let i = 0; i < 50; i++) {
          paramsList.push({
            x: p5.random(world.edges.left, world.edges.right),
            y: p5.random(world.edges.top, world.edges.bottom)
          });
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

  // Create walkers ------------------------------------------------------
  function createInitialWalkers() {
    switch(currentWalkerShape) {
      case 'Triangle':
        Settings.MaxWalkers = 2000;
        break;
      default:
        Settings.MaxWalkers = 1000;
        break;
    }

    for(let i = 0; i < Settings.MaxWalkers; i++) {
      let params = {}, numPoints;

      params.x = p5.random(world.edges.left, world.edges.right);
      params.y = p5.random(world.edges.top, world.edges.bottom);
      params.type = 'Polygon';
      params.polygon = [];
 
      switch(currentWalkerShape) {
        case 'Triangle':
          numPoints = 3;
          params.rotation = 30;
          break;
        case 'Square':
          numPoints = 4;
          params.rotation = 45;
          break;
        case 'Pentagon':
          numPoints = 5;
          break;
        case 'Hexagon':
          numPoints = 6;
          break;
      }

      const radius = p5.random(5,11);

      for(let j = 0; j < numPoints; j++) {
        params.polygon.push([
          radius * Math.cos( ((360 / numPoints) * j) * Math.PI/180 ),
          radius * Math.sin( ((360 / numPoints) * j) * Math.PI/180 )
        ]);
      }

      world.createWalker(params);
    }
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

      case '1':
        currentWalkerShape = 'Triangle';
        resetWorld();
        break;

      case '2':
        currentWalkerShape = 'Square';
        resetWorld();
        break;

      case '3':
        currentWalkerShape = 'Pentagon';
        resetWorld();
        break;

      case '4':
        currentWalkerShape = 'Hexagon';
        resetWorld();
        break;

    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);