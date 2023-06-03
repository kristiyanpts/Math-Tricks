let width = null;
let height = null;
let container = document.getElementsByClassName("game-container")[0];
let containerParameters = container.getBoundingClientRect();
let squares = [];
let playerOneUsername,
  playerTwoUsername,
  playerOneWon = 0,
  playerTwoWon = 0,
  playerOneScore = 0,
  playerTwoScore = 0,
  playerOnePosition = null,
  playerTwoPosition = null;
let gameLimit = 0;
let gameMode = null;
let currentTurn = null;
let currentTime = 0;
let operators = ["", "-", "x", "/"];
let gameIsover = false;

function AddSquares() {
  container.innerHTML = "";
  squares = [];
  for (let i = 1; i <= height; i++) {
    let containerRow = [];
    for (let j = 1; j <= width; j++) {
      let child = document.createElement("div");
      child.setAttribute("class", "squares");
      child.setAttribute("data-used", false);
      containerRow.push(child);
      container.appendChild(child);
    }
    squares.push(containerRow);
  }

  squares[0][0].setAttribute("data-used", "true");
  squares[height - 1][width - 1].setAttribute("data-used", "true");

  if (width >= height) {
    container.style.width = "600px";
    containerParameters = container.getBoundingClientRect();

    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        let newSize = containerParameters.width / width;
        squares[i][j].style.width = newSize + "px";
        squares[i][j].style["font-size"] = newSize / 2 + "px";
      }
    }
  } else {
    container.style.height = "600px";
    containerParameters = container.getBoundingClientRect();

    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        let newSize = containerParameters.height / height;
        squares[i][j].style.height = newSize + "px";
        squares[i][j].style["font-size"] = newSize / 2 + "px";
      }
    }
  }

  container.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${height}, 1fr)`;

  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      squares[i][j].addEventListener("click", Move);
    }
  }
}

function Move(e) {
  let cellValue = 0;
  let cellOperator = "";
  if (e.target.textContent.length > 1) {
    cellValue = Number(e.target.textContent.slice(1));
    cellOperator = e.target.textContent[0];
  } else {
    cellValue = Number(e.target.textContent);
    cellOperator = "+";
  }

  if (currentTurn == playerOneUsername) {
    switch (cellOperator) {
      case "+":
        playerOneScore += cellValue;
        break;
      case "-":
        playerOneScore -= cellValue;
        break;
      case "x":
        playerOneScore *= cellValue;
        break;
      case "/":
        playerOneScore /= cellValue;
        break;

      default:
        break;
    }
  } else {
    switch (cellOperator) {
      case "+":
        playerTwoScore += cellValue;
        break;
      case "-":
        playerTwoScore -= cellValue;
        break;
      case "x":
        playerTwoScore *= cellValue;
        break;
      case "/":
        playerTwoScore /= cellValue;
        break;

      default:
        break;
    }
  }

  if (
    e.target.getAttribute("data-can-move") == "true" &&
    e.target.getAttribute("data-used") == "false"
  ) {
    if (gameMode == "multi") {
      RemoveMoveData();
      e.target.setAttribute("data-used", "true");
      e.target.setAttribute("data-can-move", "false");
      if (currentTurn == playerOneUsername) {
        currentTurn = playerTwoUsername;
        playerOnePosition = e.target;
        e.target.classList.add("p1-color");
        LegalMoves(playerTwoPosition);
      } else {
        currentTurn = playerOneUsername;
        playerTwoPosition = e.target;
        e.target.classList.add("p2-color");
        LegalMoves(playerOnePosition);
      }
    } else {
      RemoveMoveData();
      e.target.setAttribute("data-used", "true");
      e.target.setAttribute("data-can-move", "false");
      playerOnePosition = e.target;
      e.target.classList.add("p1-color");
      SinglePlayer();
    }

    if (HasMoves(e.target).length == 0 && gameIsover === false) {
      GameOver();
    } else {
      gameIsover = false;
    }

    updateStats();
  }
}

function SinglePlayer() {
  let bot = BestMove(LegalMoves(playerTwoPosition, true));

  //   RemoveMoveData();
  bot.setAttribute("data-used", "true");
  bot.setAttribute("data-can-move", "false");

  //   currentTurn = playerOneUsername;
  playerTwoPosition = bot;
  console.log(bot);

  bot.classList.add("p2-color");
  LegalMoves(playerOnePosition);
}

function CalcScore(move) {
  let result = playerTwoScore;
  let cellValue = 0;
  let cellOperator = "";

  if (move.textContent.length > 1) {
    cellValue = Number(move.textContent.slice(1));
    cellOperator = move.textContent[0];
  } else {
    cellValue = Number(move.textContent);
    cellOperator = "+";
  }

  switch (cellOperator) {
    case "+":
      result += cellValue;
      break;
    case "-":
      result -= cellValue;
      break;
    case "x":
      result *= cellValue;
      break;
    case "/":
      result /= cellValue;
      break;

    default:
      break;
  }

  return result;
}

function BestMove(moves) {
  moves = moves.filter((e) => e != undefined);
  let max = CalcScore(moves[0]);
  let index = 0;
  for (let i = 0; i < moves.length; i++) {
    if (max < CalcScore(moves[i])) {
      max = CalcScore(moves[i]);
      index = i;
    }
  }
  playerTwoScore = max;
  return moves[index];
}

function HasMoves(player) {
  let row;
  let col;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].includes(player)) {
      row = i;
      col = squares[i].indexOf(player);
    }
  }

  let bottom =
    squares[row + 1] != undefined ? squares[row + 1][col] : undefined;
  let bottomRight =
    squares[row + 1] != undefined ? squares[row + 1][col + 1] : undefined;
  let right = squares[row] != undefined ? squares[row][col + 1] : undefined;
  let bottomLeft =
    squares[row + 1] != undefined ? squares[row + 1][col - 1] : undefined;
  let topRight =
    squares[row - 1] != undefined ? squares[row - 1][col + 1] : undefined;
  let topLeft =
    squares[row - 1] != undefined ? squares[row - 1][col - 1] : undefined;
  let left = squares[row] != undefined ? squares[row][col - 1] : undefined;
  let top = squares[row - 1] != undefined ? squares[row - 1][col] : undefined;

  let moves = [
    bottom,
    bottomLeft,
    bottomRight,
    top,
    topLeft,
    topRight,
    left,
    right,
  ];

  moves = moves.filter((m) => m != undefined);
  moves = moves.filter((m) => m.getAttribute("data-used") == "false");

  return moves;
}

function LegalMoves(player, single) {
  let moves = HasMoves(player);
  if (moves.length === 0 && gameIsover === false) {
    GameOver();
  } else {
    gameIsover = false;
  }
  if (single) return moves;

  let moveClass =
    currentTurn == playerOneUsername ? "p1-color-move" : "p2-color-move";
  let playerClass = currentTurn == playerOneUsername ? "p1-color" : "p2-color";
  player.classList.add(playerClass);
  moves.forEach((m) => {
    m.classList.add(moveClass);
    m.setAttribute("data-can-move", true);
  });
}

function GameOver() {
  let winner = "";
  if (gameLimit > 0) {
    if (playerOneWon === gameLimit || playerTwoWon === gameLimit) {
      winner =
        playerOneWon > playerTwoWon ? playerOneUsername : playerTwoUsername;
      document.querySelector("#winner").textContent = winner;
      document.querySelector(".end-screen").style.display = "flex";
    } else {
      winner =
        playerOneScore > playerTwoScore ? playerOneUsername : playerTwoUsername;
      Rematch();
    }
  } else {
    winner =
      playerOneScore > playerTwoScore ? playerOneUsername : playerTwoUsername;
    document.querySelector("#winner").textContent = winner;
    document.querySelector(".end-screen").style.display = "flex";
  }

  if (winner === playerOneUsername) {
    playerOneWon++;
  } else {
    playerTwoWon++;
  }

  updateStats();
  gameIsover = true;
}

function RemoveMoveData() {
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (squares[i][j].getAttribute("data-can-move") == "true") {
        squares[i][j].classList.remove("p1-color-move");
        squares[i][j].classList.remove("p2-color-move");
        squares[i][j].removeAttribute("data-can-move");
      }
    }
  }
}

let radioButtons = Array.from(document.querySelectorAll("input[type=radio]"));
radioButtons.forEach((r) => r.addEventListener("change", RadioCheck));
function RadioCheck() {
  let radio = document.getElementById("option-4");
  let gameSize = document.getElementById("game-size");
  if (radio.checked) {
    gameSize.style.display = "flex";
  } else {
    gameSize.style.display = "none";
  }

  let radioBot = document.getElementById("option-6");
  let playerTwoField = document.getElementById("player-two-show");
  let playerTwoLabel = document.getElementById("player-two-label");
  if (radioBot.checked) {
    playerTwoField.style.display = "none";
    playerTwoLabel.style.display = "none";
  } else {
    playerTwoField.style.display = "block";
    playerTwoLabel.style.display = "block";
  }
}

function GenerateNumbers() {
  // for (let i = 0; i < squares.length; i++) {
  //   for (let j = 0; j < squares[i].length; j++) {
  //     squares[i][j].className = "squares";
  //   }
  // }
  let boardSize = width + height;
  if (boardSize <= 12) {
    AppendNumber(5);
    GenerateSpecialCells(5);
  } else if (boardSize <= 18) {
    AppendNumber(10);
    GenerateSpecialCells(10);
  } else {
    AppendNumber(15);
    GenerateSpecialCells(15);
  }
}

function AppendNumber(n) {
  for (let i = 0; i < squares.length / 2; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      let number = Math.floor(Math.random() * n);
      let operatorIndex = Math.floor(Math.random() * 4);
      squares[i][j].textContent =
        number > 0 || operators[operatorIndex] == "x"
          ? operators[operatorIndex] + number
          : number;
      squares[height - i - 1][width - j - 1].textContent =
        squares[i][j].textContent;
    }
  }
  squares[0][0].textContent = "0";
  squares[height - 1][width - 1].textContent = "0";
}

function GenerateSpecialCells(n) {
  let specialCases = {
    0: (row, col, number) => (squares[row][col].textContent = number),
    1: (row, col, number) => (squares[row][col].textContent = "-" + number),
    2: (row, col) => (squares[row][col].textContent = "x0"),
    3: (row, col) => (squares[row][col].textContent = "x2"),
    4: (row, col) => (squares[row][col].textContent = "/2"),
  };
  for (let i = 0; i < 5; i++) {
    let row = Math.floor(Math.random() * height);
    let col = Math.floor(Math.random() * width);

    let number = Math.floor(Math.random() * (n - 1)) + 1;

    specialCases[i](row, col, number);
  }
}

let gameForm = document.querySelector(".game-settings");
gameForm.addEventListener("submit", startGame);

let sizeOptions = {
  "option-1": [6, 6],
  "option-2": [9, 9],
  "option-3": [12, 12],
};

let seriesOptions = {
  "option-7": 0,
  "option-8": 1,
  "option-9": 2,
};

let modeOptions = {
  "option-5": "multi",
  "option-6": "single",
};

function startGame(e) {
  e.preventDefault();

  let formData = new FormData(e.target);
  let {
    ["player-one"]: playerOne,
    ["player-two"]: playerTwo,
    ["size-x"]: sizeX,
    ["size-y"]: sizeY,
  } = Object.fromEntries(formData.entries());

  let size = document.querySelector("input[name=select-size]:checked");
  let gameType = document.querySelector("input[name=select-mode]:checked");
  let series = document.querySelector("input[name=select-series]:checked");
  if (size.id != "option-4") {
    //Custom option
    [sizeX, sizeY] = sizeOptions[size.id];
  } else {
    if (sizeX == "" || sizeY == "")
      return Notify("Please fill in the width and height.", "red");
    if (sizeX < 4 || sizeY < 4)
      return Notify("Board must be at least 4x4 dimensions.", "red");
  }
  width = sizeX;
  height = sizeY;
  gameLimit = seriesOptions[series.id];
  gameMode = modeOptions[gameType.id];
  playerOneUsername = playerOne;
  if (playerOne == "") return Notify("Please fill the player name", "red");
  if (gameMode === "multi") {
    playerTwoUsername = playerTwo;
    if (playerTwo == "") return Notify("Please fill the players names", "red");
    if (playerOne == playerTwo)
      return Notify("Players cannot have the same name", "red");
  } else {
    playerTwoUsername = "Bot Ivanka";
  }
  document.querySelector(".start-menu").style.display = "none";
  document.querySelector(".game-container").style.display = "grid";
  document.querySelector(".game-stats").style.display = "flex";
  currentTurn = playerOneUsername;
  AddSquares();
  playerOnePosition = squares[0][0];
  playerTwoPosition = squares[height - 1][width - 1];
  playerTwoPosition.classList.add("p2-color");
  updateStats();
  GenerateNumbers();
  LegalMoves(playerOnePosition);
}

function updateStats() {
  document
    .querySelectorAll(".player-one-stat")
    .forEach((p) => (p.textContent = playerOneUsername));
  document
    .querySelectorAll(".player-two-stat")
    .forEach((p) => (p.textContent = playerTwoUsername));
  document.querySelector("#player-one-games").textContent = playerOneWon;
  document.querySelector("#player-two-games").textContent = playerTwoWon;
  document.querySelector("#player-one-points").textContent =
    playerOneScore.toFixed(2);
  document.querySelector("#player-two-points").textContent =
    playerTwoScore.toFixed(2);
  document.querySelector("#players-turn").textContent = currentTurn;
}

function resetGame() {
  document.querySelector(".start-menu").style.display = "flex";
  document.querySelector(".game-container").innerHTML = "";
  document.querySelector(".game-container").style.display = "none";
  document.querySelector(".game-stats").style.display = "none";
  document.querySelector(".end-screen").style.display = "none";
  playerOneWon = 0;
  playerTwoWon = 0;
  playerOneScore = 0;
  playerTwoScore = 0;
  gameIsover = false;
}

document.getElementById("rematch").addEventListener("click", () => {
  document.querySelector(".game-container").innerHTML = "";
  document.querySelector(".end-screen").style.display = "none";
  Rematch();
});

function Rematch(params) {
  AddSquares();
  playerOnePosition = squares[0][0];
  playerTwoPosition = squares[height - 1][width - 1];
  playerTwoPosition.classList.add("p2-color");
  GenerateNumbers();
  LegalMoves(playerOnePosition);
  playerOneScore = 0;
  playerTwoScore = 0;

  gameIsover = false;
  if (playerOneWon == gameLimit + 1 || playerTwoWon == gameLimit + 1) {
    playerOneWon = 0;
    playerTwoWon = 0;
  }
  updateStats();
}

document.getElementById("menu").addEventListener("click", resetGame);

function Notify(text, bgColor) {
  let notifElem = document.getElementsByClassName("notification")[0];
  notifElem.style.display = "flex";
  notifElem.style.backgroundColor = bgColor;
  document.getElementById("notification-text").textContent = text;
  setTimeout(() => {
    notifElem.style.display = "none";
  }, 3500);
}
