const getArgs = args => {
  const [x, y, z] = args;

  if (x instanceof Vec3) {
    return [x.x, x.y, x.z];
  }

  if (typeof y !== "undefined" && typeof z !== "undefined") {
    return [x, y, z];
  }

  return [x, x, x];
};

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(...args) {
    const [x, y, z] = getArgs(args)

    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  add(...args) {
    const [x, y, z] = getArgs(args)

    this.x += x;
    this.y += y;
    this.z += z;

    return this;
  }

  multiply(...args) {
    const [x, y, z] = getArgs(args)

    this.x *= x;
    this.y *= y;
    this.z *= z;

    return this;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  normalize() {
    const len = this.length;

    this.x /= len;
    this.y /= len;
    this.z /= len;

    return this;
  }

  dist(vec) {
    return Math.sqrt(
      (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2 + (vec.z - this.z) ** 2
    );
  }

  static fromAngle(alpha, beta, len = 1) {
    return new Vec3(
      Math.cos(alpha) * Math.cos(beta) * len,
      Math.sin(alpha) * Math.cos(beta) * len,
      Math.sin(beta)
    );
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}

export const vec3 = (x, y, z) => new Vec3(x, y, z);

export default Vec3;
