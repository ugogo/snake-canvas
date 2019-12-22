const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.scale(10, 10);

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BIT_SIZE = 1;
const DELAY = 300;

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
let state;
let savedBits;

function drawBit([x, y]) {
  ctx.fillRect(x, y, BIT_SIZE, BIT_SIZE);
}

function drawBits(bits) {
  bits.forEach(drawBit);
}

function animateBits(bits) {
  savedBits = bits;

  setTimeout(() => {
    if (state === STATES.PAUSE) {
      return;
    }

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

function onKeyUp({ key }) {
  const matchs = extractDirection(key);

  if (matchs) {
    updateDirection(matchs[0]);
  }
}

function start() {
  updateDirection('right');
  updateState(STATES.PLAY);

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

document.addEventListener('keyup', onKeyUp);

document.querySelectorAll('.iconBtn--arrow').forEach(e => {
  e.addEventListener('click', () => updateDirection(e.dataset.dir));
});

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);

start();
