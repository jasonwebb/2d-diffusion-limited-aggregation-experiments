export default {
  CircleDiameter: 5,

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 10000,

  // Confine sketch to frame (900x900px by default)
  UseFrame: false,

  // Move all walkers towards center to increase collision rate
  BiasTowards: 'Center',

  WalkerSource: 'Random',

  EdgeMargin: 200,

  ReplenishWalkers: false,

  ReplenishmentSource: 'Edges',

  UseFrame: false
};