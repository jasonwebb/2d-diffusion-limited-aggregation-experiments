import Settings from './Settings';
import World from '../../core/World';

let world,
    currentClusterType = 'Wall';

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    world = new World(p5, Settings);
    world.settings.BiasTowards = 'Bottom';

    world.createDefaultWalkers();
    world.createDefaultClusters(currentClusterType);
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    world.iterate();
    world.draw();
  }

  function resetWorld() {
    world.removeAll();
    world.createDefaultWalkers();
    world.createDefaultClusters(currentClusterType);
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
   
      case 'f':
        world.toggleUseFrame();
        resetWorld();
        break;

      // Use numbers to change bias direction
      case '1':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Bottom';
        resetWorld();
        world.unpause();
        break;

      case '2':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Top';
        resetWorld();
        world.unpause();
        break;

      case '3':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Left';
        resetWorld();
        world.unpause();
        break;

      case '4':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Right';
        resetWorld();
        world.unpause();
        break;

      case '5':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Equator';
        resetWorld();
        world.unpause();
        break;

      case '6':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Meridian';
        resetWorld();
        world.unpause();
        break;

      case '7':
        world.pause();
        currentClusterType = 'Wall';
        world.settings.BiasTowards = 'Edges';
        resetWorld();
        world.unpause();
        break;

      case '8':
        world.pause();
        currentClusterType = 'Point';
        world.settings.BiasTowards = 'Center';
        resetWorld();
        world.unpause();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);