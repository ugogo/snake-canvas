const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const BIT_SIZE = 1;
const SPEED = 100;
const SCALE = 10;
const LS_SCORE_PATH = '__SNAKE__best-score';

const DIRECTIONS = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
  LEFT: 'left',
};

const DIRECTIONS_AXES = {
  [DIRECTIONS.UP]: [0, -1],
  [DIRECTIONS.RIGHT]: [1, 0],
  [DIRECTIONS.DOWN]: [0, 1],
  [DIRECTIONS.LEFT]: [-1, 0],
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

const bestScoreContainer = document.querySelector('.best-score');
const bestScoreInput = document.querySelector('.best-score-value');
const currentScoreInput = document.querySelector('.current-score-value');

const playBtn = document.querySelector('.iconBtn--play');
const arrowBtns = document.querySelectorAll('.iconBtn--arrow');

const startScreen = document.querySelector('.fs-state--start');
const ohNoScreen = document.querySelector('.fs-state--ohNo');

let direction = DIRECTIONS.RIGHT;
let score = 0;
let candy;
let state;

function getCanvasRandomPoint(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawCandy(
  x = getCanvasRandomPoint(CANVAS_WIDTH / SCALE - 1),
  y = getCanvasRandomPoint(CANVAS_HEIGHT / SCALE - 1),
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

function updateState(nextState) {
  state = nextState;
}

function disableBtn(btn) {
  btn.disabled = true;
}

function pause() {
  updateState(STATES.PAUSE);
}

function updateScore() {
  score += 1;
  currentScoreInput.innerHTML = score;
}

function getBestScore() {
  return window.localStorage.getItem(LS_SCORE_PATH);
}

function saveBestScore() {
  const bestScore = getBestScore();

  if (!bestScore || bestScore < score) {
    window.localStorage.setItem(LS_SCORE_PATH, score);
  }
}

function displayBestScore() {
  const bestScore = getBestScore();

  if (bestScore) {
    bestScoreInput.innerHTML = bestScore;
    bestScoreContainer.classList.remove('is-hidden');
  }
}

function ohNo() {
  pause();
  saveBestScore();

  [...arrowBtns].forEach(disableBtn);
  ohNoScreen.classList.remove('is-hidden');
}

function animateBits(bits) {
  setTimeout(() => {
    if (state === STATES.PAUSE) {
      return;
    }

    const directionAxes = DIRECTIONS_AXES[direction];

    const head = bits[bits.length - 1];
    const tail = bits.shift();

    const nextHead = [head[0] + directionAxes[0], head[1] + directionAxes[1]];
    const nextBits = [...bits, nextHead];

    const catchedCandy = head[0] === candy[0] && head[1] === candy[1];

    const outOfBoundaries =
      nextHead[0] === CANVAS_WIDTH / SCALE ||
      nextHead[0] === -1 ||
      nextHead[1] === CANVAS_HEIGHT / SCALE ||
      nextHead[1] === -1;

    if (catchedCandy) {
      nextBits.unshift(candy);
      updateScore();
      drawCandy();
    }

    if (outOfBoundaries) {
      ohNo();
    }

    clearBit(tail);
    drawBits(nextBits);
    animateBits(nextBits);
  }, SPEED);
}

function extractDirection(key) {
  const rx = /^Arrow(Up|Right|Down|Left)$/;
  return rx.exec(key);
}

function updateDirection(nextDirection) {
  const oppositeDirections = [
    [DIRECTIONS.LEFT, DIRECTIONS.RIGHT],
    [DIRECTIONS.UP, DIRECTIONS.DOWN],
  ];

  const isMatchingOppositeDirections = oppositeDirections.reduce(
    (isMatching, [dirA, dirB]) =>
      isMatching ||
      (dirA === direction && dirB === nextDirection) ||
      (dirB === direction && dirA === nextDirection),
    false,
  );

  if (isMatchingOppositeDirections) {
    return;
  }

  direction = DIRECTIONS[nextDirection.toUpperCase()];

  const activeBtn = document.querySelector('.iconBtn--arrow.is-active');
  const directionBtn = document.querySelector(
    `.iconBtn--arrow-${nextDirection.toLowerCase()}`,
  );

  if (activeBtn) {
    activeBtn.classList.remove('is-active');
  }

  directionBtn.classList.add('is-active');
}

function start() {
  startScreen.classList.add('is-hidden');

  updateDirection(DIRECTIONS.RIGHT);
  updateState(STATES.PLAY);

  drawCandy();
  drawBits(baseBits);
  animateBits(baseBits);
}

function onKeyUp({ code }) {
  const directionMatchs = extractDirection(code);

  if (directionMatchs) {
    updateDirection(directionMatchs[1].toLowerCase());
  }
}

ctx.scale(SCALE, SCALE);

document.addEventListener('keyup', onKeyUp);

arrowBtns.forEach(e => {
  e.addEventListener('click', () => updateDirection(e.dataset.dir));
});

playBtn.addEventListener('click', start);

displayBestScore();
