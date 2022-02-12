/*
  DECLARATIONS
*/
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let start = false;
let direction = "right";
let speed = 800;
let apple = [5, 5];
let score = 0;
let text;
let textWidth;

const gridElem = 40; //40 => taille de chaque case de notre grille soit 20 cases * 20 case = 800(largeur et hauteur de notre grille)
let snake = [
  [9, 9],
  [8, 9],
  [7, 9],
]; // Position initiale [[x, y], [x, y], [x, y]]

window.addEventListener("keydown", keyboardEvent);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

text = "Appuyez sur ESPACE pour lancer une partie";
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText(text, canvas.width / 2, canvas.height / 2);

/*
  FUNCTIONS
*/
function initGame() {
  direction = "right";
  apple = [5, 5];
  speed = 800;
  score = 0;

  snake = [
    [9, 9],
    [8, 9],
    [7, 9],
  ]; // Position initiale [[x, y], [x, y], [x, y]]
}
function drawMap() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 800);
}
function drawSnake() {
  ctx.fillStyle = "yellow";
  for (let body of snake) {
    ctx.fillRect(body[0] * gridElem, body[1] * gridElem, gridElem - 2, gridElem - 2);
  }
}
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(apple[0] * gridElem, apple[1] * gridElem, gridElem, gridElem);
}
function generateApple() {
  const [x, y] = [Math.trunc(Math.random() * 19), Math.trunc(Math.random() * 19)];

  for (let bodyElem of snake) {
    if (bodyElem[0] === x && bodyElem[1] === y) return generateApple();
  }
  apple = [x, y];
}
function drawScore() {
  text = `Score : ${score}`;
  ctx.fillStyle = "white";
  ctx.font = "30px Verdana";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  textWidth = ctx.measureText(text);

  ctx.fillText(text, canvas.width - textWidth.width, 30);
}

function isGameOver() {
  if (snake[0][0] > 19 || snake[0][0] < 0 || snake[0][1] > 19 || snake[0][1] < 0) return true;
  else {
    const [head, ...body] = snake; // On destructure snake pour récupérer uniquement la tête et le reste de la queue
    for (let bodyElem of body) {
      if (head[0] === bodyElem[0] && head[1] === bodyElem[1]) return true;
    }
  }

  return false;
}
function isEating() {
  if (snake[0][0] === apple[0] && snake[0][1] === apple[1]) {
    generateApple();
    score++;
    if (speed < 930) speed += 5;
    return true;
  }
}

function play() {
  if (start) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(speed);

    updateSnakePosition();

    if (!isGameOver()) {
      drawMap();
      drawSnake();
      drawApple();
      drawScore();

      setTimeout(() => {
        requestAnimationFrame(play);
      }, 1000 - speed);
    } else {
      gameOver();
    }
  }
}
function gameOver() {
  console.log("Game Over");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  text = `Game Over !`;
  ctx.fillStyle = "white";
  ctx.font = "30px Verdana";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  textWidth = ctx.measureText(text);

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  text = `Appuez sur ESPACE pour relancer une partie`;
  ctx.fillStyle = "white";
  ctx.font = "30px Verdana";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  textWidth = ctx.measureText(text);

  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 100);
}

function updateSnakePosition() {
  let head;
  switch (direction) {
    case "right":
      head = [snake[0][0] + 1, snake[0][1]];
      break;
    case "bottom":
      head = [snake[0][0], snake[0][1] + 1];
      break;
    case "left":
      head = [snake[0][0] - 1, snake[0][1]];
      break;
    case "top":
      head = [snake[0][0], snake[0][1] - 1];
      break;

    default:
      break;
  }
  snake.unshift(head); // On ajoute la tête à la place du première élément du notre tableau snake
  if (!isEating()) snake.pop(); // On supprime le dernier élément du notre tableau snake si il ne mange pas de pomme
}

function keyboardEvent(e) {
  e.preventDefault();
  switch (e.code) {
    case "Space":
      if (isGameOver()) {
        console.log("on relance une partie");
        initGame();
        play();
        return;
      } else {
        console.log("new game");
        if (!start) {
          start = true;
          requestAnimationFrame(play);
        } else start = false;
      }
      break;
    case "ArrowUp":
      direction = "top";
      break;
    case "ArrowDown":
      direction = "bottom";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    case "KeyS":
      console.log("spedd++");
      speed += 50;
      break;
    default:
      break;
  }
}

/*
  Par Gabriel Gobin pour la 3WAcademy
*/
