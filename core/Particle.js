/*
=============================================================================
  Particle class 
=============================================================================
*/

class Particle {
  constructor(p5, x, y, diameter) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.diameter = diameter;

    this.age = 0;
    this.collisionCount = 0;
  }

  iterate() {
    this.moveRandom();
    this.age++;
  }

  moveTowards(x, y) {
    let deltaX = x - this.x,
        deltaY = y - this.y;

    // move towards [x,y] in defined increment
  }

  moveRandom() {
    let deltaX = this.p5.random(-1,1),
        deltaY = this.p5.random(-1,1);
        
    if(this.x + deltaX > 0 && this.x + deltaX < window.innerWidth) {
      this.x += deltaX;
    }

    if(this.y + deltaY > 0 && this.y + deltaY < window.innerHeight) {
      this.y += deltaY;
    }
  }

  touches(otherParticle) {
    // Check if this particle is touching the passed particle
    // Choose between different algorithms - on grid and off grid
  }

  dist(otherParticle) {
    // return distance between particles
  }

  draw() {
    this.p5.noStroke();
    this.p5.fill(0);
    this.p5.ellipse(this.x, this.y, this.diameter/2);
  }
}

export default Particle;