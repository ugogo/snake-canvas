const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BIT_SIZE = 1;
const DELAY = 300;
const SCALE = 10;

const DIRECTIONS = {
  UP: [0, -1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [-1, 0],
};

const STATES = {
  PLAY: 'play',
  PAUSE: 'pause',
};

const baseBits = [
  [1, 1],
  [1, 2],
  [1, 3],
];

const playBtn = document.querySelector('.iconBtn--play');
const pauseBtn = document.querySelector('.iconBtn--pause');

let direction = DIRECTIONS.RIGHT;
let candy;
let state;
let savedBits;

function getCanvasRandomPoint(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawCandy(
  x = getCanvasRandomPoint(CANVAS_WIDTH / SCALE),
  y = getCanvasRandomPoint(CANVAS_HEIGHT / SCALE),
) {
  candy = [x, y];
  ctx.fillStyle = '#e5446d';
  ctx.fillRect(x, y, BIT_SIZE, BIT_SIZE);
}

function drawBit([x, y]) {
  ctx.fillStyle = '#2a2b2a';
  ctx.fillRect(x, y, BIT_SIZE, BIT_SIZE);
}

function drawBits(bits) {
  bits.forEach(drawBit);
}

function clearBit([x, y]) {
  ctx.clearRect(x, y, 1, 1);
}

function animateBits(bits) {
  savedBits = bits;

  setTimeout(() => {
    if (state === STATES.PAUSE) {
      return;
    }

    const head = bits[bits.length - 1];
    const tail = bits.shift();

    const nextHead = [head[0] + direction[0], head[1] + direction[1]];
    const nextBits = [...bits, nextHead];

    const catchedCandy = head[0] === candy[0] && head[1] === candy[1];

    if (catchedCandy) {
      nextBits.unshift(candy);
      drawCandy();
    }

    clearBit(tail);
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

  const activeBtn = document.querySelector('.iconBtn--arrow.is-active');
  const dirBtn = document.querySelector(`.iconBtn--arrow-${dir.toLowerCase()}`);

  if (activeBtn) {
    activeBtn.classList.remove('is-active');
  }

  dirBtn.classList.add('is-active');
}

function updateState(nextState) {
  state = nextState;

  if (state === STATES.PLAY) {
    playBtn.classList.add('is-active');
    pauseBtn.classList.remove('is-active');
  } else {
    playBtn.classList.remove('is-active');
    pauseBtn.classList.add('is-active');
  }
}

function start() {
  updateDirection('right');
  updateState(STATES.PLAY);

  drawCandy();
  drawBits(baseBits);
  animateBits(baseBits);
}

function pause() {
  updateState(STATES.PAUSE);
}

function play() {
  if (state === STATES.PLAY) {
    return;
  }

  updateState(STATES.PLAY);
  animateBits(savedBits);
}

function toggleState() {
  if (state === STATES.PAUSE) {
    play();
  } else {
    pause();
  }
}

function onKeyUp({ code }) {
  const directionMatchs = extractDirection(code);

  if (code === 'Space') {
    toggleState();
  }

  if (directionMatchs) {
    updateDirection(directionMatchs[0]);
  }
}

ctx.scale(SCALE, SCALE);

document.addEventListener('keyup', onKeyUp);

document.querySelectorAll('.iconBtn--arrow').forEach(e => {
  e.addEventListener('click', () => updateDirection(e.dataset.dir));
});

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);

start();
