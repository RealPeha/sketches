const getArgs = args => {
  const [x, y] = args;

  if (x instanceof Vec2) {
    return [x.x, x.y];
  }

  if (typeof y !== "undefined") {
    return [x, y];
  }

  return [x, x];
};

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(...args) {
    const [x, y] = getArgs(args);

    this.x = x;
    this.y = y;

    return this;
  }

  add(...args) {
    const [x, y] = getArgs(args);

    this.x += x;
    this.y += y;

    return this;
  }

  substract(...args) {
    const [x, y] = getArgs(args);

    this.x -= x;
    this.y -= y;

    return this;
  }

  multiply(...args) {
    const [x, y] = getArgs(args);

    this.x *= x;
    this.y *= y;

    return this;
  }

  divide(...args) {
    const [x, y] = getArgs(args);

    this.x /= x || 1;
    this.y /= y || 1;

    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  dist(vec) {
    return Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2);
  }

  normalize() {
    const len = this.length;

    if (len === 0) {
      return this;
    }

    this.x /= len;
    this.y /= len;

    return this;
  }

  reverse() {
    return this.reverseX().reverseY();
  }

  reverseX() {
    this.x = -this.x;

    return this;
  }

  reverseY() {
    this.y = -this.y;

    return this;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get angle() {
    return this.angleX;
  }

  get angleX() {
    return Math.atan2(this.y, this.x);
  }

  get angleY() {
    return Math.atan2(this.x, this.y);
  }

  static fromAngle(angle, len = 1) {
    return new Vec2(Math.sin(angle) * len, Math.cos(angle) * len);
  }

  static get ZERO() {
    return new Vec2(0, 0);
  }
}

export const vec2 = (x, y) => new Vec2(x, y);

export default Vec2;
