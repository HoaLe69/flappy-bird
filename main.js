let [audioDie, audioPlay] = document.querySelectorAll("audio");
console.log(audioPlay, audioDie);

// board
let board;
let boardWidth = window.screen.width;
let boardHeight = window.screen.height;
let context;

//bird
let birdWidth = 64;
let birdHeight = 50;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};
//pipes
let pipeArray = [];
let pipeWidth = 100;
let pipeHeight = 700;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// move
let velocityY = 0;
let gravity = 0.4;

// status game and score
let gameover = false;
let score = 0;

window.onload = function (e) {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./Bird-2.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";
  if (score > 10) {
    setInterval(placePipes, 700);
  } else {
    setInterval(placePipes, 1500);
  }
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
};

function update() {
  if (gameover) return;
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  for (let i = 0; i < pipeArray.length; i++) {
    const pipe = pipeArray[i];
    pipe.x -= 5;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
      audioPlay.play();
    }
    if (detectCollision(bird, pipe)) {
      gameover = true;
    }
  }
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeHeight) {
    pipeArray.shift();
  }
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);
  if (bird.y + bird.height > board.height) gameover = true;
  if (gameover) {
    context.fillText("GAME OVER", board.width / 2 - 100, board.height / 2);
    audioDie.play();
  }
}

// location pipes
function placePipes() {
  if (gameover) return;
  let randomPipeY = pipeY - pipeHeight / 8 - Math.random() * (pipeHeight / 2);
  let spaceTwoPipe = [board.height / 4, board.height / 6, board.height / 8];
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y:
      randomPipeY +
      pipeHeight +
      spaceTwoPipe[Math.floor(Math.random() * spaceTwoPipe.length)],
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    velocityY = -6;
    if (gameover) {
      requestAnimationFrame(update);
      bird.y = birdY;
      pipeArray = [];
      gameover = false;
      score = 0;
    }
  } else {
    velocityY = -6;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
