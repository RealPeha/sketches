import { vec2 } from "../Vec2.js";
import Particle from "./Particle.js";
import { r } from "../helpers.js";

class ParticleSquare {
  constructor(pos, width, height) {
    this.pos = pos;
    this.w = width;
    this.h = height;
    this.particles = [];

    this.init();
  }

  init() {
    const centerX = this.pos.x + this.w / 2;
    const centerY = this.pos.y + this.h / 2;

    for (let i = 0; i <= 4; i += 2) {
      for (let j = 0; j <= 4; j += 2) {
        const pos = this.pos.copy();
        pos.x += i * 20;
        pos.y += j * 20;

        const dirX = centerX - pos.x;
        const dirY = centerY - pos.y;

        const dir = -r(50, 70) / Math.pow(dirX ** 2 + dirY ** 2, 1.5);

        const velocity = vec2(dirX * dir, -r(1, 6));
        const acceleration = vec2(0, 0.2);
        const particle = new Particle(pos, velocity, acceleration);

        this.particles.push(particle);
      }
    }
  }

  update() {
    const visibleParticles = [];

    this.particles.forEach(particle => {
      particle.update();

      if (particle.opacity > 0) {
        visibleParticles.push(particle);
      }
    });

    this.particles = visibleParticles;
  }

  draw(ctx) {
    this.particles.forEach(particle => particle.draw(ctx));
  }
}

export default ParticleSquare;
