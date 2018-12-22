export default {
  // Default size of walkers, if none is provided through local Settings
  DefaultCircleDiameter: 2,

  // Default initial cluster pattern, if none is provided through local Settings
  DefaultInitialClusterType: 'Random',

  // Visibility of clustered particles
  ShowClusters: true,
  
  // Visibility of walkers
  ShowWalkers: true,

  // Visibility of imported shapes
  ShowShapes: true,

  // Maximum number of walkers - lower numbers mean better performance, but fewer hits
  MaxWalkers: 20000,

  // Where new walkers are spawned. Can be Edges, Circle, Center, or Random
  WalkerSource: 'Random',

  // Add new walkers whenever they become stuck to clusters
  ReplenishWalkers: false,

  // Probability that a collision will make a walker stick to cluster
  Stickiness: .9,

  // Direction to move all walkers each iteration. 
  // Can be Top, Bottom, Left, Right, Center, Edges, Equator, or Meridian. All other values, including nothing, disable bias
  BiasTowards: 'Center',

  // Magnitude of walker bias force. Higher values mean faster movement
  BiasForce: 1,

  // Constrain sketch to a box centered on the screen
  UseFrame: true,

  // Size of frame. Can be a single number, or an array of two numbers for width and height
  FrameSize: 900,

  // Enable the generation of lines between newly-clustered particles. Required for "Lines" render mode
  CaptureLines: true,

  // Drawing method. Can be Shapes or Lines.
  RenderMode: 'Shapes'
};