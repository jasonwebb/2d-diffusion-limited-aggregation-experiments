export default {
  // Shape of walkers
  WalkerShape: 'Triangle',

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 2000,

  // Confine sketch to frame (900x900px by default)
  UseFrame: true,

  // Move all walkers towards center to increase collision rate
  BiasTowards: 'Center'
};