export default {
  // Diameter of particles
  CircleDiameter: 10,

  // Add enough walkers to create lots of collisions, even without bias
  MaxWalkers: 5000,

  // Method to use to set up initial cluster particles. Can be Point, Ring, or Random
  InitialClusterType: 'Random',

  // Confine sketch to 900x900 area
  UseFrame: true,

  // Disable bias effect
  BiasTowards: 'None'
};