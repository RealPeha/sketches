import { vec2 } from "../Vec2.js";
import Square from "./Square.js";
import ParticleSquare from "./ParticleSquare.js";
import { r } from "../helpers.js";

const canvas = document.querySelector("#canvas");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");
ctx.setTransform(1, 0, 0, 1, 0, 0);

let radius = 150;

const createSquare = speed => {
  const dir = Math.random() > 0.5;
  const w = 200;
  const h = 70;
  const x = dir ? width + w : -w;
  const y = r(-w / 2, height - h / 2);

  return new Square(
    vec2(x, y),
    vec2(dir ? -speed : speed, 0),
    vec2(0, 0),
    w,
    h,
    dir,
    rndFish()
  );
};

let squaresFront = [];
let squaresBack = [];
let brokenSquares = [];

let time = 0;

const mouse = {
  x: 0,
  y: 0
};

const fishes = [];
const rndFish = () => fishes[Math.floor(r(0, fishes.length - 1))];

const frontParallaxSpeed = 70;
const backParallaxSpeed = 35;

let frontOffset = vec2(0, 0);
let backOffset = vec2(0, 0);

canvas.addEventListener("mousewheel", e => {
  if (e.deltaY > 0) {
    radius += 10;
  } else {
    radius -= 10;
  }
});

canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  const offsetX1 =
    (mouse.x * backParallaxSpeed) / width - backParallaxSpeed / 2;
  const offsetY1 =
    (mouse.y * backParallaxSpeed) / height - backParallaxSpeed / 2;

  backOffset = vec2(offsetX1, offsetY1);

  const offsetX2 =
    (mouse.x * frontParallaxSpeed) / width - frontParallaxSpeed / 2;
  const offsetY2 =
    (mouse.y * frontParallaxSpeed) / height - frontParallaxSpeed / 2;

  frontOffset = vec2(offsetX2, offsetY2);
});

canvas.addEventListener("mousedown", () => {
  // const activeSquares = [...squaresFront, ...squaresBack].filter(
  //   ({ active }) => active
  // );
  // activeSquares.forEach(square => {
  //   const { x, y } = square.pos;
  //   const dirX = mouse.x - x;
  //   const dirY = mouse.y - y;
  //   const force = -150 / (dirX ** 2 + dirY ** 2);
  //   square.acceleration = vec2(dirX * force, dirY * force);
  // });

  [...squaresFront, ...squaresBack].forEach(square => {
    if (square.active) {
      const particle = new ParticleSquare(
        square.pos.copy(),
        square.width,
        square.height
      );

      brokenSquares.push(particle);
    }
  });

  squaresFront = squaresFront.filter(({ active }) => !active);
  squaresBack = squaresBack.filter(({ active }) => !active);
});

let amount = 1;

const update = () => {
  time++;

  if (!(time % 50)) {
    for (let i = 0; i < amount; i++) {
      squaresFront.push(createSquare(r(1.5, 2.5)));
    }
  }

  if (!(time % 50)) {
    for (let i = 0; i < amount; i++) {
      squaresBack.push(createSquare(r(0.5, 1)));
    }
  }

  if (!(time % 500)) {
    amount += 1;
  }

  const visibleSquaresFront = [];
  const visibleSquaresBack = [];

  [...squaresFront, ...squaresBack].forEach((square, index) => {
    square.move();

    if (
      square.pos.x > -square.width &&
      square.pos.x < width + square.width &&
      square.pos.y > -square.height / 2 &&
      square.pos.y < height
    ) {
      if (index > squaresFront.length) {
        visibleSquaresBack.push(square);
      } else {
        visibleSquaresFront.push(square);
      }
    }
  });

  brokenSquares.forEach(square => square.update());

  // const activeSquares = [...squaresFront, ...squaresBack].filter(
  //   ({ active }) => active
  // );

  // activeSquares.forEach(square => {
  //   const { x, y } = square.pos;
  //   const dirX = mouse.x - x;
  //   const dirY = mouse.y - y;
  //   const force = 50 / (dirX ** 2 + dirY ** 2);
  //   square.acceleration = vec2(dirX * force, dirY * force);
  // });

  squaresBack = visibleSquaresBack;
  squaresFront = visibleSquaresFront;
};

const format = byte => {
  return `${Math.round(byte / 1024 / 1024)} MB`;
};

const drawSquares = (squares, offset) => {
  ctx.lineWidth = 3;

  squares.forEach(square => {
    const x = square.pos.x + offset.x;
    const y = square.pos.y + offset.y;

    const distance = Math.sqrt((x - mouse.x) ** 2 + (y - mouse.y) ** 2);

    if (distance < radius) {
      square.active = true;
      ctx.fillStyle = "tomato";
    } else {
      square.active = false;
      ctx.fillStyle = "#fff";
    }

    // ctx.strokeRect(x, y, square.width, square.height);
    // ctx.fillRect(x, y, square.width, square.height);
    if (!square.dir) {
      ctx.drawImage(square.img, x, y, square.width, square.height);
    } else {
      ctx.translate(x, y);
      ctx.scale(-1, 1);
      ctx.drawImage(square.img, 0, 0, square.width, square.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  });
};

const render = () => {
  drawSquares(squaresBack, backOffset);
  drawSquares(squaresFront, frontOffset);
  ctx.fillStyle = "tomato";
  brokenSquares.forEach(square => square.draw(ctx));

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 140, 70);
  ctx.fillStyle = "#000";

  const heap = window.performance.memory;

  ctx.fillText(`Squares: ${squaresFront.length + squaresBack.length}`, 10, 15);
  ctx.fillText(`Total Heap Size: ${format(heap.totalJSHeapSize)}`, 10, 30);
  ctx.fillText(`Used Heap Size: ${format(heap.usedJSHeapSize)}`, 10, 45);
  ctx.fillText(`Heap Size Limit: ${format(heap.jsHeapSizeLimit)}`, 10, 60);

  // ctx.drawImage(fish, 100, 100);
};

const loop = () => {
  ctx.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(loop);
};

const fishesLink = [
  "http://pngimg.com/uploads/fish/fish_PNG25131.png",
  "http://pngimg.com/uploads/fish/fish_PNG25158.png",
  "http://pngimg.com/uploads/fish/fish_PNG25138.png",
  "http://pngimg.com/uploads/fish/fish_PNG25120.png",
  "http://pngimg.com/uploads/fish/fish_PNG25172.png"
];

const loadImg = link => {
  return new Promise(resolve => {
    const img = new Image();
    img.src = link;
    img.onload = () => {
      resolve(img);
    };
  });
};

const loader = async () => {
  for (const link of fishesLink) {
    const fish = await loadImg(link);

    fishes.push(fish);
  }
  requestAnimationFrame(loop);
};

loader();
