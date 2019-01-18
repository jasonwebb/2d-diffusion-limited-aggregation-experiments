export default class Player {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.x = x;
    this.y = y;

    this.velocity = 0;
    this.maxVelocity = 5;
    this.acceleration = .5;
    this.friction = .1;

    this.heading = 0;
    this.movementAngle = 0;
    this.rotationSpeed = .1;

    this.isBoosting = false;
    this.isBraking = false;
    this.isRotatingLeft = false;
    this.isRotatingRight = false;
    this.isShooting = false;
  }

  draw() {
    this.p5.fill(255);
    this.p5.stroke(0);

    this.p5.translate(this.x, this.y);
    this.p5.rotate(this.heading);
    this.p5.beginShape();

      this.p5.vertex(25/2, 0);
      this.p5.vertex(-25/2, -10);
      this.p5.vertex(-25/2, 10);

    this.p5.endShape(this.p5.CLOSE);
  }

  move() {
    // Boosting = increase velocity with acceleration, stopping at max
    if(this.isBoosting && !this.isBraking && this.velocity < this.maxVelocity) {
      this.velocity += this.acceleration;
    }

    // Braking = decrease velocity linearly, stopping at 0
    if(this.isBraking && !this.isBoosting && this.velocity > 0) {
      this.velocity -= this.acceleration;
    }

    // Drifting = decrease velocity slowly using friction
    if(!this.isBoosting && !this.isBraking && this.velocity > 0) {
      this.velocity -= this.friction;
    }

    // Clamp velocity when it dips below 0
    if(this.velocity < 0) {
      this.velocity = 0;
    }

    // Rotate left
    if(this.isRotatingLeft && !this.isRotatingRight) {
      this.heading -= this.rotationSpeed;
    }

    // Rotate right
    if(this.isRotatingRight && !this.isRotatingLeft) {
      this.heading += this.rotationSpeed;
    }

    // Add velocity to position
    this.x += Math.cos(this.heading) * this.velocity;
    this.y += Math.sin(this.heading) * this.velocity;
  }
}