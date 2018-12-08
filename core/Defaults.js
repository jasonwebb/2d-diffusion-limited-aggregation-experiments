export default {
  // Visibility of clustered particles
  ShowClusters: true,
  
  // Visibility of walkers
  ShowWalkers: true,

  // Maximum number of nodes - lower numbers mean better performance, but fewer hits
  MaxWalkers: 15000,

  // Where new walkers are spawned. Can be Edges, Circle, or Random
  WalkerSource: 'Random',

  // Add new walkers whenever they become stuck to clusters
  ReplenishWalkers: false
};