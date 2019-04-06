import Settings from './Settings';
import DLA from '../../core/DLA';

let dla,
    currentWalkerShape = Settings.WalkerShape,
    showText = true;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5, Settings);

    // Spawn walkers and clusters
    reset();
  }

  // Draw ----------------------------------------------------------------
  p5.draw = function () {
    dla.iterate();
    dla.draw();
    drawText();
  }

  function reset() {
    dla.removeAll();
    dla.createDefaultClusters('Point');
    createCustomWalkers();
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('04 - different shapes', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text(`Varying shapes of walker particles

Key commands:
1 - triangles
2 - squares
3 - pentagons
4 - hexagons
5 - random shapes`, 20, 70);
    }
  }

  // Create walkers ------------------------------------------------------
  function createCustomWalkers() {
    // Different shapes seem to aggregate better with different walker counts
    if(currentWalkerShape == 'Triangle') {
      Settings.MaxWalkers = 2000;
    } else {
      Settings.MaxWalkers = 1000;
    }

    for(let i = 0; i < Settings.MaxWalkers; i++) {
      let params = {}, numPoints;

      params.x = p5.random(dla.edges.left, dla.edges.right);
      params.y = p5.random(dla.edges.top, dla.edges.bottom);
      params.type = 'Polygon';
      params.polygon = [];
 
      // Convert shape string to number of vertices
      switch(currentWalkerShape) {
        case 'Triangle':
          numPoints = 3;
          break;
        case 'Square':
          numPoints = 4;
          break;
        case 'Pentagon':
          numPoints = 5;
          break;
        case 'Hexagon':
          numPoints = 6;
          break;
        case 'Random':
          numPoints = parseInt(p5.random(3,6));
          break;
      }

      // Rotate the particle a random amount
      params.rotation = p5.random(360);

      // Use a random radius to make things interesting
      const radius = p5.random(5,11);

      // Set up vertices for polygonal walker shape
      for(let j = 0; j < numPoints; j++) {
        params.polygon.push([
          radius * Math.cos( ((360 / numPoints) * j) * Math.PI/180 ),
          radius * Math.sin( ((360 / numPoints) * j) * Math.PI/180 )
        ]);
      }

      // Create a walker with the set polygon shape
      dla.createWalker(params);
    }
  }

  // Key handler ---------------------------------------------------------
  p5.keyReleased = function () {
    switch (p5.key) {
      case ' ':
        dla.togglePause();
        break;

      case 'w':
        dla.toggleShowWalkers();
        break;

      case 'c':
        dla.toggleShowClusters();
        break;

      case 'r':
        reset();
        break;

      case 'f':
        dla.toggleUseFrame();
        reset();
        break;

      case 'l':
        dla.toggleLineRenderingMode();
        break;
        
      case 'e':
        dla.export();
        break;

      case '1':
        currentWalkerShape = 'Triangle';
        reset();
        break;

      case '2':
        currentWalkerShape = 'Square';
        reset();
        break;

      case '3':
        currentWalkerShape = 'Pentagon';
        reset();
        break;

      case '4':
        currentWalkerShape = 'Hexagon';
        reset();
        break;

      case '5':
        currentWalkerShape = 'Random';
        reset();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);