/** @module Defaults */
export default {
  /** 
   * Diameter of all particles 
   * @type {number}
   */ 
  CircleDiameter: 5,

  /**
   * Initial cluster pattern, if none is provided through local Settings
   * @type {string},
   */
  InitialClusterType: 'Random',

  /**
   * Location of new walkers
   * @type {string}
   */
  WalkerSource: 'Random',

  /**
   * Number of walkers allowed in each iteration
   * @type {number}
   */
  MaxWalkers: 5000,

  /**
   * Distance to edges to spawn new walkers within when using 'Edges' for WalkerSource
   * @type {number}
   */
  EdgeMargin: 0,


  //=====================================================================
  //  PRUNING BEHAVIORS
  //=====================================================================

  /**
   * Remove walkers that have been wandering around too much
   * @type {boolean}
   */
  PruneOldWalkers: false,

  /**
   * Maximum walker age before it is removed, if `PruneOldWalkers` is `true`, in numbers of iterations
   * @type {number}
   */
  MaxAge: 30,
  
  /**
   * Spawn new walkers when old ones are converted into clustered particles or pruned
   * @type {boolean}
   */
  ReplenishWalkers: false,

  /**
   * Remove walkers that have strayed too far from their original positions
   * @type {boolean}
   */
  PruneDistantWalkers: false,

  /**
   * Maximum distance before a walker is removed, if `PruneDistantWalkers` is enabled
   * @type {number}
   */
  MaxWanderDistance: 20,

  
  //=====================================================================
  //  VARIABLE DIAMETER EFFECTS
  //=====================================================================
  /**
   * Vary diameters by distance to center
   * @type {boolean}
   */
  VaryDiameterByDistance: false,

  /**
   * Vary diameters randomly
   * @type {boolean}
   */
  VaryDiameterRandomly: false,


  //=====================================================================
  //  VISIBILITY OF OBJECTS
  //=====================================================================

  /**
   * Visibility of clustered particles
   * @type {boolean}
   */
  ShowClusters: true,
  
  /**
   * Visibility of walkers
   * @type {boolean}
   */
  ShowWalkers: true,

  /**
   * Visibility of imported shapes
   * @type {boolean}
   */
  ShowShapes: true,


  //=====================================================================
  //  BIAS EFFECT
  //===================================================================== 

  /**
   * Direction to move all walkers each iteration. Can be Top, Bottom, Left, Right, Center, Edges, Equator, or Meridian. All other values, including nothing, disable bias
   * @type {string}
   */
  BiasTowards: '',

  /**
   * Magnitude of walker bias force. Higher values mean faster movement.
   * @type {number}
   */
  BiasForce: 1,

  /**
   * Enable each walker to have it's own bias towards a point
   * @type {boolean}
   */
  UsePerWalkerBias: true,


  //=====================================================================
  //  FRAME
  //===================================================================== 

  /**
   * Constrain sketch to a box centered on the screen
   * @type {boolean}
   */
  UseFrame: true,

  /**
   * Size of frame. Can be a single number, or an array of two numbers for width and height
   * @type {number}
   */
  FrameSize: 900,


  //=====================================================================
  //  RENDERING EFFECTS
  //===================================================================== 

  /**
   * Enable the generation of lines between newly-clustered particles. Required for "Lines" render mode. Can be disabled for performance if needed.
   * @type {boolean}
   */
  CaptureLines: true,

  /**
   * Drawing method. Can be `Shapes` or `Lines`.
   * @type {string}
   */
  RenderMode: 'Shapes',

  /**
   * Draw stroke around circles/polygons
   * @type {boolean}
   */
  UseStroke: false,


  //=====================================================================
  //  COLORS
  //=====================================================================

  /**
   * Apply the colors defined below. `false` means black and white only.
   * @type {boolean}
   */
  UseColors: false,

  /**
   * Canvas background color
   * @type {object}
   */
  BackgroundColor: {
    h: 230,
    s: 20,
    b: 40
  },

  /**
   * Color of randomly-moving particles (walkers), when visible
   * @type {object}
   */
  WalkerColor: {
    h: 200,
    s: 30,
    b: 44
  },
  
  /**
   * Color of clustered particles, when visible
   * @type {object}
   */
  ClusterColor: {
    h: 30,
    s: 70,
    b: 80  
  },

  /**
   * Color of custom imported SVG shapes, when visible
   * @type {object}
   */
  ShapeColor: {
    h: 100,
    s: 50,
    b: 80
  },

  /**
   * Color of lines when RenderMode is set to 'Lines'
   * @type {object}
   */
  LineColor: {
    h: 10,
    s: 70,
    b: 100
  },

  /**
   * Color of bounding frame, when enabled
   * @type {object}
   */
  FrameColor: {
    h: 0,
    s: 100,
    b: 100
  }
  
};