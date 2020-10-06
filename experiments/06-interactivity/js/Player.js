export default class Player {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.x = x;
    this.y = y;

    this.angle = 0;
    this.pathDiameter = 800;
    this.angularSpeed = 0;
    this.maxAngularSpeed = .05;
    this.angularAcceleration = .001;

    this.velocity = {x: 0, y: 0};
    this.maxVelocity = 5;
    this.acceleration = .5;
    this.friction = .05;

    this.FREE = 0;
    this.RADIAL = 1;
    this.movementMode = this.FREE;

    this.heading = 0;
    this.movementAngle = 0;
    this.rotationSpeed = .1;

    this.isBoosting = false;
    this.isBraking = false;
    this.isRotatingLeft = false;
    this.isRotatingRight = false;
    this.isShooting = false;
    this.isStill = true;
    this.isMovingCounterclockwise = false;
    this.isMovingClockwise = false;
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
    switch(this.movementMode) {
      // In "free" mode, allow player to move anywhere --------------------------------------------
      case this.FREE:
        // Boosting = increase velocity with acceleration, stopping at max
        if(this.isBoosting && !this.isBraking && this.getVelocityMagnitude() < this.maxVelocity) {
          this.velocity.x += Math.cos(this.heading) * this.acceleration;
          this.velocity.y += Math.sin(this.heading) * this.acceleration;
          this.isStill = false;
        }

        // Braking = decrease velocity linearly, stopping at 0
        if(this.isBraking && !this.isBoosting && !this.isStill) {
          if(this.velocity.x > 0) {
            this.velocity.x -= this.acceleration;
          } else {
            this.velocity.x += this.acceleration;
          }

          if(this.velocity.y > 0) {
            this.velocity.y -= this.acceleration;
          } else {
            this.velocity.y += this.acceleration;
          }
        }

        // Drifting = decrease velocity slowly using friction
        if(!this.isBoosting && !this.isBraking && !this.isStill) {
          if(this.velocity.x > 0) {
            this.velocity.x -= this.friction;
          } else {
            this.velocity.x += this.friction;
          }

          if(this.velocity.y > 0) {
            this.velocity.y -= this.friction;
          } else {
            this.velocity.y += this.friction;
          }
        }

        // Clamp velocity to zero when it is very close to (but not exactly) zero
        if(this.getVelocityMagnitude() < .1) {
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.isStill = true;
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        break;


      // In "radial" mode, lock the player to a circular path around the center -------------------
      case this.RADIAL:
        // Move clockwise
        if(this.isMovingClockwise && !this.isMovingCounterclockwise && Math.abs(this.angularSpeed) < this.maxAngularSpeed) {
          this.angularSpeed += this.angularAcceleration;
        }

        // Move counterclockwise
        if(!this.isMovingClockwise && this.isMovingCounterclockwise && Math.abs(this.angularSpeed) < this.maxAngularSpeed) {
          this.angularSpeed -= this.angularAcceleration;
        }

        // Decelerate when not moving
        if(!this.isMovingClockwise && !this.isMovingCounterclockwise) {
          if(this.angularSpeed > 0) {
            this.angularSpeed -= this.angularAcceleration;
          } else if(this.angularSpeed < 0) {
            this.angularSpeed += this.angularAcceleration;
          }
        }

        this.angle += this.angularSpeed;

        this.x = window.innerWidth / 2 + Math.cos(this.angle) * this.pathDiameter / 2;
        this.y = window.innerHeight / 2 + Math.sin(this.angle) * this.pathDiameter / 2;

        break;
    }
    
  }

  getVelocityMagnitude() {
    return Math.abs(Math.sqrt( this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y));
  }
}