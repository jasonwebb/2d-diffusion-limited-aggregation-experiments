

export default class Player {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.velocity = { x: 0, y: 0 };
    this.maxVelocity = 7;
    this.acceleration = .5;
    this.frictionForce = .001;
    this.angle = 10;
    this.mode = 'Free';
  }

  draw() {
    // draw isosceles triangle with "pointy" end on [x,y]

    this.p5.fill(255);
    this.p5.stroke(0);

    this.p5.beginShape();

      this.p5.vertex(this.x, this.y);
      this.p5.vertex(this.x - 10, this.y + 25);
      this.p5.vertex(this.x + 10, this.y + 25);
      this.p5.vertex(this.x, this.y);

    this.p5.endShape();
  }

  move() {
    if(this.velocity.x != 0 && !this.p5.keyIsPressed) {
      this.velocity.x -= this.frictionForce;
    }

    if(this.velocity.y != 0 && !this.p5.keyIsPressed) {
      this.velocity.y -= this.frictionForce;
    }
  }

  handleKey(key) {
    if(this.mode == 'Free') {
      switch(key) {
        case 'w': // move up
          if(this.velocity.y > 0) {
            this.velocity.y = 0;
          }

          if(this.velocity.y - this.acceleration >= -this.maxVelocity) {
            this.velocity.y -= this.acceleration;
          }

          this.y += this.velocity.y;
          break;
  
        case 's': // move down
          if(this.velocity.y < 0) {
            this.velocity.y = 0;
          }

          if(this.velocity.y + this.acceleration <= this.maxVelocity) {
            this.velocity.y += this.acceleration;
          }

          this.y += this.velocity.y;
          break;
  
        case 'a': // move left
          if(this.velocity.x > 0) {
            this.velocity.x = 0;
          }

          if(this.velocity.x - this.acceleration >= -this.maxVelocity) {
            this.velocity.x -= this.acceleration;
          }

          this.x += this.velocity.x;
          break;

        case 'd': // move right
          if(this.velocity.x < 0) {
            this.velocity.x = 0;
          }

          if(this.velocity.x + this.acceleration <= this.maxVelocity) {
            this.velocity.x += this.acceleration;
          }

          this.x += this.velocity.x;
          break;
      }

    } else if(this.mode == 'Radial') {

    }
  }

  setMode(mode) {
    this.mode = mode;
  }
}