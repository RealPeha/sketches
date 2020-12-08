import Vec2, { vec2 } from "../Vec2.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const width = document.body.clientWidth;
const height = document.body.clientHeight;

canvas.width = width;
canvas.height = height;

const PI2 = Math.PI * 2;
const rad = deg => deg * (Math.PI / 180);
const center = vec2(width / 2, height / 2);

const axisLength = 400;
const startDate = new Date();

let x = Vec2.fromAngle(rad(-45), axisLength).add(center); // hours
let z = Vec2.fromAngle(rad(-180), axisLength).add(center); // minutes
let y = Vec2.fromAngle(rad(90), axisLength).add(center); // seconds

const seconds = {
  pos: center.clone(),
  value: startDate.getSeconds(),
  max: 60,
  axis: x,
  color: "tomato"
};

const minutes = {
  pos: center.clone(),
  value: startDate.getMinutes(),
  max: 60,
  axis: z,
  color: "khaki"
};

const hours = {
  pos: center.clone(),
  value: startDate.getHours(),
  max: 24,
  axis: y,
  color: "tan"
};

const updatePoint = point => {
  const dir = point.axis
    .clone()
    .substract(center)
    .normalize();

  const value = (point.value * (axisLength - 50)) / point.max;

  point.pos.set(center).add(dir.multiply(value));
};

const update = t => {
  const date = new Date();

  updatePoint(seconds);
  updatePoint(minutes);
  updatePoint(hours);

  seconds.value = date.getSeconds();
  minutes.value = date.getMinutes();
  hours.value = date.getHours();
};

const drawPoint = point => {
  ctx.beginPath();
  ctx.fillStyle = point.color;
  ctx.arc(point.pos.x, point.pos.y, 5, 0, PI2);
  ctx.fill();
};

const drawAxis = axis => {
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(axis.x, axis.y);
};

const drawText = (point, offset = Vec2.ZERO) => {
  ctx.fillText(point.value, point.pos.x + offset.x, point.pos.y + offset.y);
};

const draw = () => {
  ctx.beginPath();

  [x, y, z].forEach(drawAxis);

  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(seconds.pos.x, seconds.pos.y);
  ctx.lineTo(minutes.pos.x, minutes.pos.y);
  ctx.lineTo(hours.pos.x, hours.pos.y);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 0.1;
  ctx.fill();
  ctx.globalAlpha = 1;

  [seconds, minutes, hours].forEach(drawPoint);

  ctx.fillStyle = "#000";
  drawText(seconds, vec2(-18, 0));
  drawText(minutes, vec2(-18, 0));
  drawText(hours, vec2(-6, -10));
};

const loop = t => {
  ctx.clearRect(0, 0, width, height);

  update(t);
  draw();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
