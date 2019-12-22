const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.scale(10, 10);

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BIT_SIZE = 1;
const DELAY = 1000;

const DIRECTIONS = {
  UP: [0, -1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [-1, 0],
};

const baseBits = [
  [10, 10],
  [10, 11],
  [10, 12],
];

let direction = DIRECTIONS.RIGHT;

function drawBit([x, y]) {
  ctx.fillRect(x, y, BIT_SIZE, BIT_SIZE);
}

function drawBits(bits) {
  bits.forEach(drawBit);
}

function animateBits(bits) {
  setTimeout(() => {
    bits.shift();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const nextBits = [
      ...bits,
      [
        bits[bits.length - 1][0] + direction[0],
        bits[bits.length - 1][1] + direction[1],
      ],
    ];

    drawBits(nextBits);
    animateBits(nextBits);
  }, DELAY);
}

function extractDirection(key) {
  const rx = /Up|Down|Left|Right/;
  return rx.exec(key);
}

function updateDirection(dir) {
  direction = DIRECTIONS[dir.toUpperCase()];

  const activeBtn = document.querySelector('.arrow--active');
  const dirBtn = document.querySelector(`.arrow.arrow--${dir.toLowerCase()}`);

  if (activeBtn) {
    activeBtn.classList.remove('arrow--active');
  }

  dirBtn.classList.add('arrow--active');
}

function onKeyUp({ key }) {
  const matchs = extractDirection(key);

  if (matchs) {
    updateDirection(matchs[0]);
  }
}

function start() {
  updateDirection('right');
  drawBits(baseBits);
  animateBits(baseBits);
}

document.addEventListener('keyup', onKeyUp);

document.querySelectorAll('.arrow').forEach(e => {
  e.addEventListener('click', () => updateDirection(e.dataset.dir));
});

start();
