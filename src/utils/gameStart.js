let sizeOptions = {
  "option-1": [6, 6],
  "option-2": [9, 9],
  "option-3": [12, 12],
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
  let size = document.querySelector("input[name=select]:checked");
  let gameType = document.querySelector("input[name=select2]:checked");
  if (size.id != "option-4") {
    [sizeX, sizeY] = sizeOptions[size.id];
  } else {
    if (sizeX == "" || sizeY == "")
      return alert("Please fill in the width and height.");
    if (sizeX < 4 || sizeY < 4)
      return alert("Board must be at least 4x4 dimensions.");
  }
  width = sizeX;
  height = sizeY;
  playerOneUsername = playerOne;
  playerTwoUsername = playerTwo;
  document.querySelector(".start-menu").style.display = "none";
  document.querySelector(".game-container").style.display = "grid";
  document.querySelector(".game-stats").style.display = "flex";
  currentTurn = playerOneUsername;
  AddSquares();
  updateStats();
  startTimer();
}
