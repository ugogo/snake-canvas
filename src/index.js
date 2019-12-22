const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.scale(10, 10);

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BIT_SIZE = 1;
const DELAY = 1000;

const DIRECTIONS = {
  toTop: [0, -1],
  toRight: [1, 0],
  toBottom: [0, 1],
  toLeft: [-1, 0],
};

const direction = DIRECTIONS.toRight;

const baseBits = [
  [10, 10],
  [10, 11],
  [10, 12],
];

function debug(data) {
  console.log(data);
}

function drawBit([x, y]) {
  ctx.fillRect(x, y, BIT_SIZE, BIT_SIZE);
}

function drawBits(bits) {
  bits.forEach(drawBit);
}

function animateBits(bits) {
  setTimeout(() => {
    bits.shift();

    const nextBits = [
      ...bits,
      [
        bits[bits.length - 1][0] + direction[0],
        bits[bits.length - 1][1] + direction[1],
      ],
    ];

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // debug(bits);
    // debug(nextBits);

    drawBits(nextBits);
    animateBits(nextBits);
  }, DELAY);
}

function start() {
  drawBits(baseBits);
  animateBits(baseBits);
}

start();
