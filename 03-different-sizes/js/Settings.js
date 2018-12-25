export default {
  // Diameter of particles
  CircleDiameterRange: [2, 25],

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 1500,

  // Generate walkers in a circular area around center
  WalkerSource: 'Random-Circle',

  // Enable mapping between walker diameter and it's distance to the center
  VaryDiameterByDistance: true
};