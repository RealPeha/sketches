import { vec2 } from "./Vec2.js";
import Point from "./Point.js";
import Constraint from "./Constraint.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = document.body.clientWidth;
const height = document.body.clientHeight;
canvas.width = width;
canvas.height = height;

const gravity = vec2(0, 0.5);

const points = [new Point(100, 100), new Point(200, 100), new Point(200, 200)];
points[0].prevPos.substract(vec2(10, -10));

const constraints = [
  new Constraint(points[0], points[1]),
  new Constraint(points[1], points[2]),
  new Constraint(points[0], points[2])
];

const update = () => {
  points.forEach(point => {
    point.applyForce(gravity);
    point.update();
    point.limit(width, height);
  });

  constraints.forEach(constraint => {
    constraint.update();
  });
};

const render = () => {
  points.forEach(point => point.draw(ctx));
  constraints.forEach(constraint => constraint.draw(ctx));
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
