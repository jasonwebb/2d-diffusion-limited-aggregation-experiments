/** @module SVGLoader */

import {SVGPathData} from 'svg-pathdata';
  
/** Utility class to load an external SVG file and extract discrete paths as simple arrays of point coordinates */
export default class SVGLoader {
  constructor() {}

  /**
   * Kick of parsing of an SVG file that has been imported via `require()` as a flat string
   * @param {string} contents Entire contents of an SVG file as a flat string
   * @returns {array} Array of paths produced via `load()`
   */
  static loadFromFileContents(contents) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(contents, 'image/svg+xml');
    return this.load(doc);
  }

  /**
   * Extract an array of simplified paths from an SVG DOM node
   * @param {node} svgNode - SVG DOM node containing the document to parse
   * @returns {array} Array of simple objects containing the starting X and Y coordinates and an array of subsequent points that define the path
   */
  static load(svgNode) {
    let inputPaths = svgNode.querySelectorAll('path'),
        currentPath = {},
        paths = [];

    currentPath.points = []

    // Scrape all points from all points, and record breakpoints
    for(let inputPath of inputPaths) {
      let pathData = new SVGPathData(inputPath.getAttribute('d'));

      let previousCoords = {
        x: 0,
        y: 0
      };

      for(let [index, command] of pathData.commands.entries()) {
        switch(command.type) {
          // Move ('M') and line ('L') commands have both X and Y
          case SVGPathData.MOVE_TO:
          case SVGPathData.LINE_TO:
            currentPath.points.push([
              command.x, 
              command.y
            ]);

            break;

          // Horizontal line ('H') commands only have X, using previous command's Y
          case SVGPathData.HORIZ_LINE_TO:
            currentPath.points.push([
              command.x,
              previousCoords.y
            ]);
            
            break;

          // Vertical line ('V') commands only have Y, using previous command's X
          case SVGPathData.VERT_LINE_TO:
            currentPath.points.push([
              previousCoords.x,
              command.y
            ]);
            
            break;

          // ClosePath ('Z') commands are a naive indication that the current path can be processed and added to the world
          case SVGPathData.CLOSE_PATH:
            currentPath.closed = true;
            paths.push(currentPath);
            currentPath = {};
            currentPath.points = [];
            break;
        }

        // Unclosed paths never have CLOSE_PATH commands, so wrap up the current path when we're at the end of the path and have not found the command
        if(index == pathData.commands.length - 1 && command.type != SVGPathData.CLOSE_PATH) {
          let firstPoint = currentPath.points[0],
              lastPoint = currentPath.points[ currentPath.points.length - 1 ];

          // Automatically close the path if the first and last nodes are effectively the same, even if a CLOSE_PATH command doesn't exist
          if(Math.hypot(lastPoint.x - firstPoint.x, lastPoint.y - firstPoint.y) < .1) {
            currentPath.closed = true;
          } else {
            currentPath.closed = false;
          }

          paths.push(currentPath);
          currentPath = {};
          currentPath.points = [];
        }

        // Capture X coordinate, if there was one
        if(command.hasOwnProperty('x')) {
          previousCoords.x = command.x;
        }

        // Capture Y coordinate, if there was one
        if(command.hasOwnProperty('y')) {
          previousCoords.y = command.y;
        }
      }
    }

    // Make all coordinates relative to the first point
    for(let path of paths) {
      path.x = path.points[0][0];
      path.y = path.points[0][1];

      path.points.push([path.x, path.y]);

      for(let point of path.points) {
        point[0] -= path.x;
        point[1] -= path.y;
      }
    }

    return paths;
  }
}