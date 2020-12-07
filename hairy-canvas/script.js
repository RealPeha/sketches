import { vec2 } from "../Vec2.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const createPoint = pos => {
  return {
    pos,
    offset: vec2(0, 0)
  };
};

const points = [];
const step = 20;
const mousePos = vec2(0, 0);
const drawRadius = [];
let radius = 100;
let clearMode = false;

for (let i = 0; i < width / step; i++) {
  for (let j = 0; j < height / step; j++) {
    points.push(createPoint(vec2(i * step, j * step)));
  }
}

// const lerp = (start, end, t) => start * (1 - t) + end * t;

canvas.addEventListener("mousemove", e => {
  mousePos.set(e.clientX, e.clientY);
  const mouseVelocity = vec2(e.movementX, e.movementY).normalize();

  points.forEach(({ pos, offset }) => {
    const dist = pos.dist(mousePos);

    if (dist <= radius) {
      const dir = mouseVelocity.clone().multiply((radius - dist) / 2);

      // const newOffset = vec2(
      //   lerp(offset.x, offset.x + dir.x, 0.3),
      //   lerp(offset.y, offset.y + dir.y, 0.3)
      // );

      // if (newOffset.length < radius / 2) {
      //   offset.set(newOffset);
      // }

      if (clearMode) {
        offset.set(0);
      } else {
        if (offset.length < radius / 2) {
          offset.add(dir);
        } else {
          offset.divide(2);
        }
      }
    }
  });
});

canvas.addEventListener("mousedown", () => {
  clearMode = true;
});

canvas.addEventListener("mouseup", () => {
  clearMode = false;
});

canvas.addEventListener("wheel", e => {
  drawRadius.push(1);
  setTimeout(() => drawRadius.shift(), 300);

  if (e.deltaY > 0) {
    radius += 10;
  } else {
    radius -= 10;
  }
});

const update = () => {};

const render = () => {
  if (drawRadius.length) {
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.5;

  points.forEach(({ pos, offset }) => {
    if (offset.length === 0) {
      ctx.fillRect(pos.x, pos.y, 1, 1);
    } else {
      ctx.beginPath();

      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + offset.x, pos.y + offset.y);

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
