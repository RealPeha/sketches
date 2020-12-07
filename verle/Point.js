import { vec2 } from "../Vec2.js";
import { clamp } from "../helpers.js";

class Point {
  constructor(x, y) {
    this.setPosition(x, y);
  }

  setPosition(x, y) {
    this.pos = vec2(x, y);
    this.prevPos = vec2(x, y);
  }

  applyForce(force) {
    this.pos.add(force);
  }

  limit(x, y) {
    this.pos.x = clamp(this.pos.x, 0, x - 5);
    this.pos.y = clamp(this.pos.y, 0, y - 5);
  }

  update() {
    const velocity = this.pos.clone().substract(this.prevPos);

    this.prevPos = this.pos.clone();
    this.pos.add(velocity);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

export default Point;
