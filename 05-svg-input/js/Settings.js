export default {
  CircleDiameter: 4,

  // Limit number of walkers and rely on bias to increase collision rate
  MaxWalkers: 10000,

  ShowWalkers: false,

  // Move all walkers towards center to increase collision rate
  BiasTowards: 'Center',

  WalkerSource: 'Random',

  EdgeMargin: 200,

  ReplenishWalkers: false,

  ReplenishmentSource: 'Edges'
};