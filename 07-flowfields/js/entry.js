import Settings from './Settings';
import DLA from '../../core/DLA';

let dla, showText = true;

const PERLIN = 0,
  SWIRLS = 1,
  CLIFFORD = 2;
let currentMode = PERLIN;

// Clifford attractor params
let a = Math.random() * 4 - 2,
  b = Math.random() * 4 - 2,
  c = Math.random() * 4 - 2,
  d = Math.random() * 4 - 2;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5, Settings);
    dla.customMovementFunction = getForceAt;
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
    dla.createDefaultWalkers();

    dla.createClusterFromParams(dla.createVerticalClusterWall(dla.edges.left));
    dla.createClusterFromParams(dla.createVerticalClusterWall(dla.edges.right));
  
    dla.createClusterFromParams(dla.createHorizontalClusterWall(dla.edges.top));
    dla.createClusterFromParams(dla.createHorizontalClusterWall(dla.edges.bottom));

    // dla.createDefaultClusters('Random');
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('07 - flowfields', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text(`Movement influenced by flowfield equations

Key commands:
1 - Perlin noise
2 - swirls
3 - Clifford attractor`, 20, 70);
    }
  }

  function getForceAt(body) {
    let timeScale = .2,
      heading;
    
    switch(currentMode) {
      case PERLIN:
        heading = getPerlinHeading(body);
        break;

      case SWIRLS:
        heading = getSineSwirlHeading(body);
        break;

      case CLIFFORD:
        heading = getCliffordAttractorHeading(body);
        break;
    }
    
    return {
      dx: Math.cos(heading) * timeScale,
      dy: Math.sin(heading) * timeScale
    }
  }

  function getPerlinHeading(body) {
    return p5.noise(body.x * .01, body.y * .01) * Math.PI * 2;
  }

  function getSineSwirlHeading(body) {
    return (Math.sin(body.x * .034) + Math.sin(body.y * .03)) * Math.PI * 2
  }

  function getCliffordAttractorHeading(body) {
    let x1 = (body.x - window.innerWidth / 2) * .005,
      y1 = (body.y - window.innerHeight / 2) * .005,
      x2 = Math.sin(a * y1) + c * Math.cos(a * x1),
      y2 = Math.sin(b * x1) + d * Math.cos(b * y1);

    return Math.atan2(y2 - y1, x2 - x1);
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
        currentMode = PERLIN;
        reset();
        break;

      case '2':
        currentMode = SWIRLS;
        reset();
        break;

      case '3':
        currentMode = CLIFFORD;
        reset();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);