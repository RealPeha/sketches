class Square {
  constructor(pos, velocity, acceleration, width, height, dir, img) {
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.width = width;
    this.height = height;
    this.active = false;
    this.dir = dir;
    this.img = img;
  }

  move() {
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
  }
}

export default Square;
