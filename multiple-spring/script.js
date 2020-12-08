import { vec2 } from "../Vec2.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = document.body.clientWidth;
const height = document.body.clientHeight;
canvas.width = width;
canvas.height = height;

const mouse = vec2(0, 0);
const spring = 0.01;
const friction = 0.95;

let drag = false;

canvas.addEventListener("mousemove", e => mouse.set(e.clientX, e.clientY));
canvas.addEventListener("mouseup", () => (drag = false));
canvas.addEventListener("mousedown", () => (drag = true));

const circle = {
  pos: vec2(0, 200),
  velocity: vec2(0, 0),
  r: 20
};

const points = [vec2(200, 200), vec2(400, 150), vec2(300, 300)];

const update = () => {
  points.forEach(point => {
    const dir = point.clone().substract(circle.pos);

    const acceleration = dir.multiply(spring);

    circle.velocity.add(acceleration);
    circle.velocity.multiply(friction);
    circle.pos.add(circle.velocity);
  });

  if (drag) {
    circle.pos.set(mouse);
  }
};

const render = () => {
  ctx.beginPath();

  points.forEach(point => {
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(circle.pos.x, circle.pos.y);
  });

  ctx.moveTo(circle.pos.x + circle.r, circle.pos.y);
  ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI);

  ctx.stroke();
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
