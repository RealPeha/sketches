import { vec2 } from "../Vec2.js";
import { r as random } from "../helpers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const circles = [];
const friction = 1;
const gravity = vec2(0, 1);

const createCircle = (pos, acceleration, radius = 100) => {
  circles.push({
    pos,
    radius,
    velocity: vec2(0, 0),
    acceleration
  });
};

for (let i = 0; i < 10; i++) {
  createCircle(
    vec2(random(0, width), random(0, height)),
    vec2(0, 0),
    random(40, 60)
  );
}

canvas.addEventListener("mousedown", e => {
  createCircle(vec2(e.clientX, e.clientY), vec2(0, 0), random(20, 70));
});

const update = () => {
  const circlesAmount = circles.length;
  for (let i = 0; i < circlesAmount; i++) {
    const c1 = circles[i];

    if (c1.pos.x + c1.radius > width) {
      c1.velocity.reverseX();
      c1.acceleration.x = 0;
      c1.pos.x = width - c1.radius;
    }

    if (c1.pos.x < c1.radius) {
      c1.velocity.reverseX();
      c1.acceleration.x = 0;
      c1.pos.x = c1.radius;
    }

    if (c1.pos.y + c1.radius > height) {
      c1.velocity.reverseY();
      c1.acceleration.y = 0;
      c1.pos.y = height - c1.radius;
    }

    if (c1.pos.y < c1.radius) {
      c1.velocity.reverseY();
      c1.acceleration.y = 0;
      c1.pos.y = c1.radius;
    }

    for (let j = 0; j < circlesAmount; j++) {
      if (j === i) {
        break;
      }

      const c2 = circles[j];

      const dist = Math.sqrt(
        (c1.pos.x - c2.pos.x) ** 2 + (c1.pos.y - c2.pos.y) ** 2
      );

      if (dist < c1.radius + c2.radius) {
        const c1Dir = vec2(
          c1.pos.x - c2.pos.x,
          c1.pos.y - c2.pos.y
        ).normalize();

        const c2Dir = vec2(
          c2.pos.x - c1.pos.x,
          c2.pos.y - c1.pos.y
        ).normalize();

        c1.velocity.set(c1Dir);
        c1.pos.add(c1Dir);

        c2.velocity.set(c2Dir);
        c2.pos.add(c2Dir);
      }
    }

    if (c1.acceleration.length < 1) {
      c1.acceleration.add(gravity);
    }

    c1.velocity.add(c1.acceleration);
    c1.velocity.multiply(friction);

    c1.pos.add(c1.velocity);
  }
};

const render = () => {
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
