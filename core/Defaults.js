export default {
  // Diameter of all particles
  CircleDiameter: 5,

  // Initial cluster pattern, if none is provided through local Settings
  InitialClusterType: 'Random',

  // Location of new walkers
  WalkerSource: 'Random',

  // Number of walkers allowed in each iteration
  MaxWalkers: 5000,

  // Distance to edges to spawn new walkers within when using 'Edges' for WalkerSource
  EdgeMargin: 0,


  //=====================================================================
  //  PRUNING BEHAVIORS
  //=====================================================================

  // Remove walkers that have been wandering around too much
  PruneOldWalkers: false,

  // Maximum walker age before it is removed, if `PruneOldWalkers` is `true`, in numbers of iterations
  MaxAge: 30,
  
  // Spawn new walkers when old ones are converted into clustered particles or pruned
  ReplenishWalkers: false,

  // Remove walkers that have strayed too far from their original positions
  PruneDistantWalkers: false,

  // Maximum distance before a walker is removed, if `PruneDistantWalkers` is enabled
  MaxWanderDistance: 20,


  //=====================================================================
  //  VISIBILITY OF OBJECTS
  //=====================================================================

  // Visibility of clustered particles
  ShowClusters: true,
  
  // Visibility of walkers
  ShowWalkers: true,

  // Visibility of imported shapes
  ShowShapes: true,


  //=====================================================================
  //  BIAS EFFECT
  //===================================================================== 

  // Direction to move all walkers each iteration. 
  // Can be Top, Bottom, Left, Right, Center, Edges, Equator, or Meridian. All other values, including nothing, disable bias
  BiasTowards: 'Center',

  // Magnitude of walker bias force. Higher values mean faster movement
  BiasForce: 1,


  //=====================================================================
  //  FRAME
  //===================================================================== 

  // Constrain sketch to a box centered on the screen
  UseFrame: true,

  // Size of frame. Can be a single number, or an array of two numbers for width and height
  FrameSize: 900,


  //=====================================================================
  //  RENDERING EFFECTS
  //===================================================================== 

  // Enable the generation of lines between newly-clustered particles. Required for "Lines" render mode. Can be disabled for performance if needed.
  CaptureLines: true,

  // Drawing method. Can be Shapes or Lines.
  RenderMode: 'Shapes',

  // Draw stroke around circles/polygons
  UseStroke: false,


  //=====================================================================
  //  COLORS
  //=====================================================================

  // Apply the colors defined below. `false` means black and white only.
  UseColors: false,

  // Canvas background color
  BackgroundColor: {
    h: 330,
    s: 30,
    b: 40
  },

  // Color of randomly-moving particles (walkers), when visible
  WalkerColor: {
    h: 200,
    s: 30,
    b: 44
  },
  
  // Color of clustered particles, when visible
  ClusterColor: {
    h: 30,
    s: 70,
    b: 80  
  },

  // Color of custom imported SVG shapes, when visible
  ShapeColor: {
    h: 100,
    s: 50,
    b: 80
  },

  // Color of lines when RenderMode is set to 'Lines'
  LineColor: {
    h: 10,
    s: 70,
    b: 100
  },

  // Color of bounding frame, when enabled
  FrameColor: {
    h: 0,
    s: 100,
    b: 100
  }
  
};