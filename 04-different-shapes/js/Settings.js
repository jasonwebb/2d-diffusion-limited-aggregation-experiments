export default {
  // Shape of walkers
  WalkerShape: 'Triangle',

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 6000,

  // Confine sketch to frame (900x900px by default)
  UseFrame: false,

  // Hide walkers by default
  ShowWalkers: true,

  // Generate walkers in a circular area around center
  WalkerSource: 'Random',

  // Move all walkers towards center to increase collision rate
  BiasTowards: 'Center'
};