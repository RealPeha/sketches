import { vec2 } from "../Vec2.js";

// let meat = null;

// const img = new Image();
// img.src = "https://i.ibb.co/8sRP8nh/hotpng-com.png";
// img.onload = () => {
//   meat = img;
// };

class Particle {
  constructor(pos, velocity = vec2(0, 0), acceleration = vec2(0, 0)) {
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.opacity = 1;
    this.angle = 0;
    this.dir = Math.random() - 0.5;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);

    // this.opacity -= 0.02;

    this.angle += this.dir / 10;
  }

  draw(ctx) {
    ctx.translate(this.pos.x + 10, this.pos.y + 10);
    ctx.rotate(this.angle);

    ctx.strokeRect(0, 0, 20, 20);
    ctx.fillRect(0, 0, 20, 20);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default Particle;
