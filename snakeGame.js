const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
let gameRunning = false;

// Initialize game variables
let snake = [];
let dx = 10;
let dy = 0;
let food = {};
let score = 0;
let speed = 100; // Initialize speed

function updateScoreDisplay() {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

function resetGameState() {
  snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
  ];
  dx = 10;
  dy = 0;
  food = getRandomFoodPosition();
  score = 0;
  updateScoreDisplay(); // reset score
  clearCanvas();
  drawFood();
  drawSnake();
}

document.addEventListener("keydown", changeDirection);

document.getElementById("startButton").addEventListener("click", function () {
  if (!gameRunning) {
    resetGameState();
    gameRunning = true;
    main();
  }
});

document.getElementById("restartButton").addEventListener("click", function () {
  document.getElementById("gameOverNotification").style.display = "none";
  resetGameState();
  gameRunning = true;
  main();
});

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keys = [LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY];

  if (keys.includes(event.keyCode)) {
    event.preventDefault();

    if (event.keyCode === LEFT_KEY && dx === 0) {
      dx = -10;
      dy = 0;
    } else if (event.keyCode === UP_KEY && dy === 0) {
      dx = 0;
      dy = -10;
    } else if (event.keyCode === RIGHT_KEY && dx === 0) {
      dx = 10;
      dy = 0;
    } else if (event.keyCode === DOWN_KEY && dy === 0) {
      dx = 0;
      dy = 10;
    }
  }
}

function main() {
  if (checkCollision()) {
    gameRunning = false;
    showGameOver();
    return;
  }

  if (gameRunning) {
    setTimeout(function onTick() {
      clearCanvas();
      drawFood();
      moveSnake();
      drawSnake();
      main();
    }, speed);
  }
}

function clearCanvas() {
  ctx.fillStyle = "#A9E000";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ctx.fillStyle = "black";
  ctx.strokeStyle = "darkgray";
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.strokeRect(food.x, food.y, 10, 10);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    score += 10;
    updateScoreDisplay();

    do {
      food = getRandomFoodPosition();
    } while (isFoodOnSnake(food));

    // Increase speed after eating food
    speed = Math.max(20, speed - 2); // Lower limit of 20ms
  } else {
    snake.pop();
  }
}

function isFoodOnSnake(foodPosition) {
  return snake.some(
    (segment) => segment.x === foodPosition.x && segment.y === foodPosition.y
  );
}

function drawSnake() {
  snake.forEach((snakePart) => {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  });
}

function getRandomFoodPosition() {
  let maxPos = canvas.width - 10; // Subtract the size of the food
  let x, y;
  do {
    x = Math.floor((Math.random() * maxPos) / 10) * 10;
    y = Math.floor((Math.random() * maxPos) / 10) * 10;
  } while (isFoodOnSnake({ x, y }) || isFoodOutsideCanvas({ x, y }));
  console.log("Food position:", { x, y }); // Add this line
  return { x, y };
}

function isFoodOutsideCanvas(position) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x > canvas.width - 10 ||
    position.y > canvas.height - 10
  );
}

function checkCollision() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      showGameOver();
      return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    showGameOver();
    return true;
  }
  return false;
}

function showGameOver() {
  document.getElementById("gameOverText").textContent =
    "Game over! Your score was: " + score;
  document.getElementById("gameOverNotification").style.display = "block";
}
