// Class 1: UIHandler
// Responsible for form inputs, error messages, and initial static text
class UIHandler {
    constructor() {
        this.startBtn = document.getElementById("start-btn");
        this.promptTxt = document.getElementById("prompt-txt");
        this.errorTxt = document.getElementById("error-txt");
        this.errorBox = document.getElementById("error-box");
        this.gameForm = document.getElementById("game-form");
        this.btnCountInput = document.getElementById("btn-count");

        // Initialize UI text from user.js
        this.promptTxt.textContent = userText.uiText[0];
        this.startBtn.value = userText.uiText[1];
    }

    showError(message) {
        this.errorTxt.textContent = message;
        this.errorBox.style.backgroundColor = "lightpink";
        this.errorBox.style.border = "2px solid red";
        this.errorBox.style.padding = "5px";
        this.errorBox.style.borderRadius = "10px";
    }

    clearError() {
        this.errorTxt.textContent = "";
        this.errorBox.style.backgroundColor = "";
        this.errorBox.style.border = "";
        this.errorBox.style.padding = "";
        this.errorBox.style.borderRadius = "";
    }

    getInputValue() {
        return parseInt(this.btnCountInput.value);
    }
}

// Class 2: GameButton
// Represents a single button component on the screen
class GameButton {
    constructor(color, order, gameInstance) {
        this.order = order;
        this.displayOrder = order + 1;
        this.game = gameInstance; // Reference to game engine to report clicks

        this.element = document.createElement("button");
        this.element.style.backgroundColor = color;
        this.element.style.width = "10em";
        this.element.style.height = "5em";
        this.element.style.position = "static";
        this.element.style.margin = "10px";
        this.element.style.border = "2px solid black";
        this.element.style.fontSize = "2em";
        this.element.innerText = this.displayOrder;

        // Bind click event
        this.element.onclick = () => this.handleClick();
    }

    addToBoard(boardElement) {
        boardElement.appendChild(this.element);
    }

    setLocation(top, left) {
        this.element.style.position = "absolute";
        this.element.style.top = top + "px";
        this.element.style.left = left + "px";
        this.element.style.margin = "0";
    }

    reveal() {
        this.element.innerText = this.displayOrder;
    }

    hideLabel() {
        this.element.innerText = "";
    }

    setZIndex(index) {
        this.element.style.zIndex = index;
    }

    handleClick() {
        // Delegate logic back to the game engine
        this.game.handleButtonClick(this);
    }
}

// Class 3: MemoryGame
// The "Logical Module" that controls game state, shuffling, and rules
class MemoryGame {
    constructor(uiHandler) {
        this.ui = uiHandler;
        this.board = document.getElementById("game-board");
        this.buttons = [];
        this.expectedOrder = 1;
        this.isRunning = false;
        this.timerInterval = null;
        this.waitTimeout = null;
        this.currentZIndex = 10;
        
        this.colors = [
            "CornflowerBlue", "Crimson", "Coral", "DarkSalmon", 
            "DarkSeaGreen", "MediumPurple", "MistyRose", "PaleGreen",
            "PaleVioletRed", "Yellow", "OliveDrab", "Lavender"
        ];
    }

    start(num) {
        this.reset();
        const colorList = this.getColorList(num);

        for (let i = 0; i < num; i++) {
            const btn = new GameButton(colorList[i], i, this);
            this.buttons.push(btn);
            btn.addToBoard(this.board);
        }

        this.waitTimeout = setTimeout(() => {
            this.startShuffle();
        }, num * 1000);
    }

    reset() {
        this.board.innerHTML = "";
        this.buttons = [];
        this.expectedOrder = 1;
        this.currentZIndex = 10;
        this.isRunning = false;
        this.ui.clearError();

        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.waitTimeout) clearTimeout(this.waitTimeout);
    }

    startShuffle() {
        let count = 0;
        const maxShuffles = 3;

        this.timerInterval = setInterval(() => {
            this.shufflePositions();
            count++;

            if (count >= maxShuffles) {
                clearInterval(this.timerInterval);
                this.enablePlay();
            }
        }, 2000);
    }

    shufflePositions() {
        const boardRect = this.board.getBoundingClientRect();
        this.buttons.forEach(btn => {
            const btnElem = btn.element;
            const maxX = boardRect.width - btnElem.offsetWidth;
            const maxY = boardRect.height - btnElem.offsetHeight;

            const randX = Math.floor(Math.random() * maxX);
            const randY = Math.floor(Math.random() * maxY);

            btn.setLocation(randY, randX);
        });
    }

    enablePlay() {
        this.buttons.forEach(btn => btn.hideLabel());
        this.expectedOrder = 1;
        this.isRunning = true;
    }

    handleButtonClick(btnClicked) {
        if (!this.isRunning) return;

        if (btnClicked.displayOrder === this.expectedOrder) {
            btnClicked.reveal();
            this.currentZIndex++;
            btnClicked.setZIndex(this.currentZIndex);
            this.expectedOrder++;

            if (this.expectedOrder > this.buttons.length) {
                this.endGame(true);
            }
        } else {
            this.endGame(false);
        }
    }

    endGame(isWin) {
        this.isRunning = false;
        this.buttons.forEach(btn => btn.reveal());

        const message = document.createElement("div");
        message.className = "game-message";
        message.textContent = isWin ? userText.gameText[0] : userText.gameText[1];
        message.style.color = isWin ? "green" : "red";

        this.board.appendChild(message);
    }

    getColorList(num) {
        const randomColors = [];
        while (randomColors.length < num) {
            let index = Math.floor(Math.random() * this.colors.length);
            let randColor = this.colors[index];
            if (!randomColors.includes(randColor)) {
                randomColors.push(randColor);
            }
        }
        return randomColors;
    }
}

// --- Main Initialization ---

const ui = new UIHandler();
const game = new MemoryGame(ui);

ui.gameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let numButtons = ui.getInputValue();

    if (isNaN(numButtons)) {
        ui.showError(userText.errorHandling[0]);
    } else if (numButtons < 3 || numButtons > 7) {
        ui.showError(userText.errorHandling[1]);
    } else {
        ui.gameForm.reset();
        ui.clearError();
        game.start(numButtons);
    }
});