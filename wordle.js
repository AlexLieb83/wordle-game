//TO DO
//find bigger word list, or free dictionary api

const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

const wordleList = ["SUPER", "LOVER", "WATCH", "BOSSY", "MISTY"];

const wordle = wordleList[Math.floor(Math.random() * wordleList.length)];

//keys for our on-screen keyboard
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "DELETE",
];

//create the guess rows
const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

//
guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElem = document.createElement("div");
  rowElem.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElem = document.createElement("div");
    tileElem.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElem.classList.add("tile");
    rowElem.append(tileElem);
  });
  tileDisplay.append(rowElem);
});

//create on-screen keyboard
keys.forEach((key) => {
  const buttonElem = document.createElement("button");
  buttonElem.textContent = key;
  buttonElem.setAttribute("id", key);
  buttonElem.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElem);
});

//clicks on-screen keyboard
const handleClick = (key) => {
  console.log(`clicked`, key);
  if (key === "DELETE") {
    deleteLetter();
    return;
  }
  if (key === "ENTER") {
    checkRow();
    return;
  }
  addLetter(key);
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");
  flipTile();

  if (currentTile > 4) {
    if (wordle == guess) {
      showMessage("You got it!");
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage("Game Over");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageElem = document.createElement("p");
  messageElem.textContent = message;
  messageDisplay.append(messageElem);
  setTimeout(() => messageDisplay.removeChild(messageElem), 2000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  //get all children (letters) of row -
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  //check each letter in word of day vs guess letter
  //add color to correct letters
  //also add flip to each letter - which will add flip animation
  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  //check for correct letter
  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  //check for letter in wrong space
  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute("data");

    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
