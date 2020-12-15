import { vec2 } from "../Vec2.js";
import { clamp } from "../helpers.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const width = document.body.clientWidth;
const height = document.body.clientHeight;

canvas.width = width;
canvas.height = height;

const center = vec2(width / 2, height / 2);
const graphWidth = clamp(width * 0.5, 400, width);
const graphHeight = height * 0.8;
const graphCenter = vec2(center.x - graphWidth / 2, center.y);

const secondMinutesInterval = graphHeight / 2 / 60;
const hoursInterval = graphHeight / 2 / 24;

const seconds = {
  pos: vec2(graphWidth - 50, 0),
  color: "#F44336",
  value: 0
};

const minutes = {
  pos: vec2((graphWidth - 50) / 2, 0),
  color: "#009688",
  value: 0
};

const hours = {
  pos: vec2(50, 0),
  color: "#FFC107",
  value: 0
};

const drawPoint = point => {
  ctx.fillStyle = point.color || "#000";

  ctx.beginPath();
  ctx.arc(
    graphCenter.x + point.pos.x,
    graphCenter.y + point.pos.y,
    15,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 19px sans-serif";
  const text = `${Math.round(point.value)}`;
  const { width } = ctx.measureText(text);
  ctx.fillText(
    text,
    graphCenter.x + point.pos.x - width / 2,
    graphCenter.y + point.pos.y + 6
  );
};

const update = () => {
  const date = new Date();

  seconds.value = date.getSeconds();
  minutes.value = date.getMinutes();
  hours.value = date.getHours();

  seconds.pos.y = (seconds.value * (graphHeight / 2)) / 60;
  minutes.pos.y = (minutes.value * (graphHeight / 2)) / 60;
  hours.pos.y = -(hours.value * (graphHeight / 2)) / 24;
};

const render = () => {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(graphCenter.x, graphCenter.y);
  ctx.lineTo(graphCenter.x + graphWidth, graphCenter.y);
  ctx.moveTo(graphCenter.x, graphCenter.y - graphHeight / 2 - 50);
  ctx.lineTo(graphCenter.x, graphCenter.y + graphHeight / 2 + 50);
  for (let i = 0; i <= 60; i++) {
    ctx.moveTo(graphCenter.x - 7, graphCenter.y + i * secondMinutesInterval);
    ctx.lineTo(graphCenter.x + 7, graphCenter.y + i * secondMinutesInterval);
  }
  for (let i = 0; i <= 24; i++) {
    ctx.moveTo(graphCenter.x - 7, graphCenter.y - i * hoursInterval);
    ctx.lineTo(graphCenter.x + 7, graphCenter.y - i * hoursInterval);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(graphCenter.x + 7, graphCenter.y + seconds.pos.y);
  ctx.lineTo(graphCenter.x + seconds.pos.x, graphCenter.y + seconds.pos.y);
  ctx.moveTo(graphCenter.x + 7, graphCenter.y + hours.pos.y);
  ctx.lineTo(graphCenter.x + hours.pos.x, graphCenter.y + hours.pos.y);
  ctx.moveTo(graphCenter.x + 7, graphCenter.y + minutes.pos.y);
  ctx.lineTo(graphCenter.x + minutes.pos.x, graphCenter.y + minutes.pos.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(seconds.pos.x, 0);
  ctx.lineTo(seconds.pos.x, seconds.pos.y);
  ctx.fill();

  drawPoint(seconds);
  drawPoint(hours);
  drawPoint(minutes);
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
