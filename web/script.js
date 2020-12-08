import Vec2, { vec2 } from "../Vec2.js";
import { r } from "../helpers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = document.body.clientWidth;
const height = document.body.clientHeight;
canvas.width = width;
canvas.height = height;

const points = [];
const mouse = vec2(0, 0);

canvas.addEventListener("mousemove", (e) => {
  mouse.set(e.clientX, e.clientY);
});

const createPoint = (x, y) => {
  points.push({
    basePos: vec2(x, y),
    pos: vec2(x, y),
    velocity: Vec2.ZERO,
    radius: r(2, 8),
    inside: r(1) === 0
  });
};

for (let i = 0; i < 100; i++) {
  createPoint(r(0, width), r(0, height));
}

const getNearestPoints = (point) => {
  return points.filter((p) => p.pos.dist(point.pos) < 100);
};

const update = () => {
  points.forEach((point) => {
    const dist = point.pos.dist(point.basePos);
    const distToMouse = point.pos.dist(mouse);

    const dir = point.basePos.clone().substract(point.pos).normalize();

    const force = dir.multiply(dist * 0.01);

    if (distToMouse < 150) {
      const dirMouse = point.pos.clone().substract(mouse).normalize();

      if (point.inside) {
        const forceMouse = dirMouse
          .reverse()
          .multiply((distToMouse - 40) * 0.01);

        point.velocity.add(forceMouse);
      } else {
        const forceMouse = dirMouse.multiply(distToMouse * 0.02);

        point.velocity.add(forceMouse);
      }
    }

    point.velocity.add(force);
    point.velocity.multiply(0.9);
    point.pos.add(point.velocity);
  });
};

const render = () => {
  points.forEach((point) => {
    const distToMouse = point.pos.dist(mouse);

    if (distToMouse < 150) {
      ctx.beginPath();
      ctx.globalAlpha = 1;
      ctx.arc(point.pos.x, point.pos.y, point.radius, 0, Math.PI * 2);
      ctx.fill();

      const nearestPoints = getNearestPoints(point);

      ctx.beginPath();
      ctx.globalAlpha = 0.3;

      nearestPoints.forEach((p) => {
        ctx.moveTo(point.pos.x, point.pos.y);
        ctx.lineTo(p.pos.x, p.pos.y);
      });

      ctx.stroke();
    }
  });
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
