import Settings from './Settings';
import DLA from '../../core/DLA';
import SVGLoader from '../../core/SVGLoader';

let svgFiles = {
  dla: require("../svg/dla.svg"),
  polygons: require('../svg/polygons.svg'),
  supershape: require('../svg/supershape.svg')
}

let dla,
    currentSVGFile = svgFiles.supershape,
    showText = true;

const sketch = function (p5) {
  // Setup ---------------------------------------------------------------
  p5.setup = function () {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.colorMode(p5.HSB, 255);
    p5.ellipseMode(p5.CENTER);

    // Set up the simulation environment
    dla = new DLA(p5, Settings);
    
    // Spawn walkers and create cluster seed shape from SVG
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
    createCustomShapesFromSVG(currentSVGFile);
    dla.createDefaultWalkers();
    dla.createDefaultWalkers(undefined, 'Offscreen');
  }

  // Draw helpful text
  function drawText() {
    if(showText) {
      p5.fill(0);
      p5.noStroke();

      p5.textSize(20);
      p5.textStyle(p5.BOLD);
      p5.text('05 - SVG input', 20, 40);

      p5.textStyle(p5.NORMAL);
      p5.fill(150);
      p5.text(`Growth using shapes from SVG files

Key commands:
1 - SVG text
2 - compound polygon
3 - supershape`, 20, 70);
    }
  }

  // Load paths from an SVG file (embedded in the index.html file) and use them to create shapes in the DLA simulation
  function createCustomShapesFromSVG(file) {
    let paths = SVGLoader.loadFromFileContents(file);
    
    for(let path of paths) {
      path.stuck = true;
      path.solid = false;
      path.x += window.innerWidth / 2 - 900 / 2;
      path.y += window.innerHeight / 2 - 900 / 2;
    }

    dla.createShapesFromPaths(paths);
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

      case 's':
        dla.toggleShowShapes();
        restartWorld();
        break;

      case 'l':
        dla.toggleLineRenderingMode();
        break;
        
      case 'e':
        dla.export();
        break;

      case '1':
        currentSVGFile = svgFiles.dla;
        reset();
        break;

      case '2':
        currentSVGFile = svgFiles.polygons;
        reset();
        break;

      case '3':
        currentSVGFile = svgFiles.supershape;
        reset();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode
new p5(sketch);