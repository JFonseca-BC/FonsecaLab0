const startBtn = document.getElementById("start-btn");
const gameBoard = document.getElementById("game-board");
const promptTxt = document.getElementById("prompt-txt");
const errorTxt = document.getElementById("error-txt");
const errorBox = document.getElementById("error-box");
const gameForm = document.getElementById("game-form");

promptTxt.textContent = userText.uiText[0];
startBtn.value = userText.uiText[1];

let buttons = [];
let expectedOrder = 0;
let gameRunning = false;
let timerInterval = null;
let waitTimeout = null;


// ------------- Button class -------------- //

function Button(color, order) {
    this.order = order;
    this.displayOrder = order + 1;
    const self = this;

    this.btn = document.createElement("button");
    this.btn.style.backgroundColor = color;
    this.btn.style.width = "10em";
    this.btn.style.height = "5em";
    this.btn.style.position = "static";
    this.btn.style.margin = "10px";
    this.btn.style.border = "2px solid black";

    this.btn.style.fontSize = "2em";
    this.btn.textAlign = "center";

    this.btn.innerText = this.displayOrder;

    gameBoard.appendChild(this.btn);

    this.setLocation = function (top, left) {
        this.btn.style.position = "absolute";
        this.btn.style.top = top + "px";
        this.btn.style.left = left + "px";
        this.btn.style.margin = "0";
    };

    this.reveal = function () {
        this.btn.innerText = this.displayOrder;
    };

    this.handleClick = function () {
        if (!gameRunning) return;

        if (this.displayOrder === expectedOrder) {
            this.reveal();
            expectedOrder++;

            if (expectedOrder > buttons.length) {
                endGame(true);
            }
        } else {
            endGame(false);
        }
    };

    this.btn.onclick = function () {
        self.handleClick();
    };
}

const colors = [
    "CornflowerBlue", "Crimson", "Coral", "DarkSalmon", 
    "DarkSeaGreen", "MediumPurple", "MistyRose", "PaleGreen",
    "PaleVioletRed", "Yellow", "OliveDrab", "Lavender"
];

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

function getColorList(num) {
    const randomColors = [];
    while (randomColors.length < num) {
        let randColor = getRandomColor();
        if (!randomColors.includes(randColor)) {
            randomColors.push(randColor);
        }
    }
    return randomColors;
}


// ------------- Game logic -------------- //

function startGame(num) {
    resetGame();

    const colorList = getColorList(num);

    for (let i = 0; i < num; i++) {
        buttons.push(new Button(colorList[i], i));
    }

    waitTimeout = setTimeout(function () {
        startShuffle();
    }, num * 1000);
}

function startShuffle() {
    let count = 0;
    const maxShuffles = 3;

    const shuffle = function() {
        // get the playable area dimensions and set max
        const boardRect = gameBoard.getBoundingClientRect();
        buttons.forEach(function(btn) {
            const btnElem = btn.btn;
            const maxX = boardRect.width - btnElem.offsetWidth;
            const maxY = boardRect.height - btnElem.offsetHeight;

            const randX = Math.floor(Math.random() * maxX);
            const randY = Math.floor(Math.random() * maxY);

            btn.setLocation(randY, randX);
        });
    };

    timerInterval = setInterval(function() {
        shuffle();
        count++;

        if (count >= maxShuffles) {
            clearInterval(timerInterval);
            enablePlay();
        }
    }, 2000); // every 2 seconds
}

function enablePlay() {
    buttons.forEach(function(btn) {
        btn.btn.innerText = "";
    });
    expectedOrder = 1;
    gameRunning = true;
}

function endGame(isWin) {
    gameRunning = false;

    buttons.forEach(function(btn) {
        btn.reveal();
    });

    const message = document.createElement("div");
    message.className = "game-message";
    message.textContent = isWin ? userText.gameText[0] : userText.gameText[1];

    if (isWin) {
        message.style.color = "green";
    } else {
        message.style.color = "red";
    }

    gameBoard.appendChild(message);
}

function resetGame() {
    gameBoard.innerHTML = ""; // remove buttons from html
    buttons = []; // remove buttons from memory
    expectedOrder = 1;
    gameRunning = false;
    clearError();

    if (timerInterval) clearInterval(timerInterval);
    if (waitTimeout) clearTimeout(waitTimeout);
}

// ------------- Form handling -------------- //
let numButtons = 0;

function showError(message) {
    errorTxt.textContent = message;
    errorBox.style.backgroundColor = "lightpink";
    errorBox.style.border = "2px solid red";
    errorBox.style.padding = "5px";
    errorBox.style.borderRadius = "10px";
}

function clearError() {
    errorTxt.textContent = "";
    errorBox.style.backgroundColor = "";
    errorBox.style.border = "";
    errorBox.style.padding = "";
    errorBox.style.borderRadius = "";
}

gameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let numButtons = parseInt(document.getElementById("btn-count").value);

    if (isNaN(numButtons)) {
        showError(userText.errorHandling[0]);
    } else if (numButtons < 3 || numButtons > 7) {
        showError(userText.errorHandling[1]);
    } else {
        clearError();
        startGame(numButtons);
    }
});