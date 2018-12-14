export default {
  // Diameter of particles
  CircleDiameterRange: [2, 25],

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 3500,

  // Confine sketch to frame (900x900px by default)
  UseFrame: true,

  // Hide walkers by default
  ShowWalkers: true,

  // Generate walkers in a circular area around center
  WalkerSource: 'Random-Circle',

  // Move all walkers towards center to increase collision rate
  BiasTowards: 'Center',

  // Enable mapping between walker diameter and it's distance to the center
  VaryDiameterByDistance: true
};