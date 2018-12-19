This repo contains a series of visual experiments built with JavaScript that explore the topic of __diffusion-limited aggregation__ (DLA) as a method for generating interesting 2D forms.

I am particularly interested in the application of such techniques in the context of digital fabrication, so these experiments will be more focused on schematic representations (colorless, vector-based, SVG/STL exports) over purely visual effects.

## About diffusion-limited aggregation

_Diffusion-limited aggregation (DLA)_ is a process in which randomly-moving particles _diffuse_ through a medium and clump together (_aggregate_) over time to form long, fractal, branch-like chains (sometimes called [Brownian trees](https://en.wikipedia.org/wiki/Brownian_tree)). It closely models various interesting phenomena seen in nature at different scales and in different mediums.

A classic example is that of the formation of [copper sulfate crystals](https://upload.wikimedia.org/wikipedia/commons/b/b8/DLA_Cluster.JPG) in the presence of an electrodeposition cell. When electricity is applied, individual copper atoms are stripped from the system's anode and randomly float (_diffuse_) through the liquid medium until they come in contact with other copper atoms that have accumulated on the system's cathode where they form a strong molecular bond and aggregate over time.

Another example can be seen in the rather more violent phenomena of [Lichtenberg figures](https://en.wikipedia.org/wiki/Lichtenberg_figure), wherein an electrical discharge of very high voltage travels through an insulator like wood, burning a curious fractal branching structure in it's wake. In this example, it would seem that the electrical discharge itself _diffuses_ through the wood, _limited_ by the insulating nature of the wood, forming an _"aggregate"_ of burnt wood as it progresses. 

### A note on lattices and parameterization
In classical implementations this algorithm acts upon a regular 2D grid of pixels wherein each "particle" can have up to 8 neighbors. Though simplistic, this so-called "on-lattice" approach can run at blistering speeds because no expensive distance calculations, spatial indexing, or collision detection is required - just array lookups. 

However, this approach results in an inherently low fidelity raster image that has a pretty characteristic aesthetic style and limited usefulness in modern digital fabrication workflows. In the world of digital fabrication vector-based graphics are preferred because they can be easily transformed into machine toolpaths and manipulated in interesting ways in CAD software.

To achieve vector-based results from the DLA process one must move away from pixels and towards _particles_, which also affords one the ability for more parameterization that can be fun to explore creatively. For example, one could vary the size, shape, and movement behaviors of these particles to achieve interesting effects.

## Keyboard commands

| Key     | Result                        |
|---      |---                            |
| `w`     | Show/hide walkers             |
| `c`     | Show/hide clustered particles |
| `r`     | Restart simulation            |
| `f`     | Toggle frame                  |
| `Space` | Pause/unpause simulation      |

## Packages used
* [p5.js](https://www.npmjs.com/package/p5) for canvas drawing and miscellaneous helper functions (like `lerp` and `map`).
* [Webpack](https://webpack.js.org/) for modern JS (ES6) syntax, code modularization, and local bundling and serving.
* [collisions](https://www.npmjs.com/package/collisions) for robust, lightweight collision detection without the use of a full physics package.

## Running locally

1. Run `npm install` in both the `./build` and `./core` folders.
2. Run `npm run serve` in the `./build` folder to start a local development server and launch it in a browser.

To statically _build_ the code in this repo, run `npm run build` in the `./build` folder.

## References

* [DLA - Diffusion Limited Aggregation](http://paulbourke.net/fractals/dla/) by Paul Bourke
* [Diffusion-limited aggregation](https://en.wikipedia.org/wiki/Diffusion-limited_aggregation) on Wikipedia
* [Coding Challenge #34: Diffusion-Limited Aggregation](https://www.youtube.com/watch?v=Cl_Gjj80gPE) by Dan Shiffman ([Github repo](https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_034_DLA/P5))
* [simutils-0001: Diffusion limited aggregation](http://toxiclibs.org/2010/02/new-package-simutils/) by Karsten Schmidt (toxiclibs)
* [Diffusion Limited Aggregation](https://www.astro.rug.nl/~offringa/Diffusion%20Limited%20Aggregation.pdf) (PDF) by André Offringa
* [Simulate: Diffusion-Limited Aggregation](http://formandcode.com/code-examples/simulate-dla) from FORM+CODE book examples
* [Diffusion-Limited Aggregation](https://softologyblog.wordpress.com/tag/diffusion-limited-aggregation/) by Softology
* [Diffusion-limited aggregation: A kinetic critical phenomenon?](http://www.thp.uni-koeln.de/krug/teaching-Dateien/SS2012/Sander2000.pdf) (PDF) by Leonard M. Sander
* [Dendron](http://www.flong.com/projects/dendron/) Processing sketch by Golan Levin

## Samples

![Basic DLA](01-basic-dla/images/social-media-preview.png)
![Directional bias](02-directional-bias/images/social-media-preview.png)
![Different sizes](03-different-sizes/images/social-media-preview.png)
![Different shapes](04-different-shapes/images/social-media-preview.png)