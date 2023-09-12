var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
const diameter = 20;
var paddleX = 400;

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - PADDLE_WIDTH / 2;
}
function brickReset() {
  for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
    //end of else (rand check)
  } //end of each brick
} //end of brickReset funct

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", updateMousePos);
  brickReset();
};

function updateAll() {
  moveAll();
  drawAll();
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.width / 2;
}

function moveAll() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    //left
    ballSpeedX *= -1;
  }
  if (ballX > canvas.width) {
    //right
    ballSpeedX *= -1;
  }
  if (ballY < 0) {
    //top
    ballSpeedX *= -1;
  }
  if (ballY > canvas.height) {
    //bottom
    ballReset();
    //ballSpeedY *= -1;
  }
  var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
  if (
    ballY > paddleTopEdgeY && //below the top of paddle
    ballY < paddleBottomEdgeY && //above bottom of paddle
    ballX > paddleLeftEdgeX && //right of the left side of the paddle
    ballX < paddleRightEdgeX //left of the left side of the paddle
  ) {
    ballSpeedY *= -1;
    var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
    var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    ballSpeedX = ballDistFromPaddleCenterX * 0.35;
  }
}

function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row;
}
function drawBricks() {
  for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
      if (brickGrid[arrayIndex]) {
        colorRect(
          BRICK_W * eachCol,
          BRICK_H * eachRow,
          BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP,
          "blue"
        );
      } //end of is this brick here
    } //end of for each brick
  }
} //end of drawBricks()

function drawAll() {
  colorRect(0, 0, canvas.clientWidth, canvas.height, "yellow"); //clear screen
  colorCircle(ballX, ballY, diameter, "red"); //draw ball
  colorRect(
    paddleX,
    canvas.height - PADDLE_DIST_FROM_EDGE,
    PADDLE_WIDTH,
    PADDLE_THICKNESS,
    "white"
  );
  drawBricks();
  var mouseBrickCol = Math.floor(mouseX / BRICK_W);
  var mouseBrickRow = Math.floor(mouseY / BRICK_H);
  var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
  colorText(
    mouseBrickCol + "," + mouseBrickRow + ":" + brickIndexUnderMouse,
    mouseX,
    mouseY,
    "white"
  );

  if (
    brickIndexUnderMouse >= 0 &&
    brickIndexUnderMouse < BRICK_COLS * BRICK_ROWS
  ) {
    brickGrid[brickIndexUnderMouse] = false;
  }
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}
function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorText(showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}
