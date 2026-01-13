const startBtn = document.getElementById("start-btn");
const gameBoard = document.getElementById("game-board");
const promptTxt = document.getElementById("prompt-txt");
const errorTxt = document.getElementById("error-txt");
const errorBox = document.getElementById("error-box");

promptTxt.textContent = userText.uiText[0];
startBtn.textContent = userText.uiText[1];



// ------------- Button creation and movement -------------- //
function Button(color, width, height, top, left, order) {
        this.order = order;
        this.btn = document.createElement("button");
        this.btn.style.backgroundColor = color;
        this.btn.style.width = width;
        this.btn.style.height = height;
        this.btn.style.position = "absolute";

        document.body.appendChild(this.btn);
        // A method to set location
        this.setLocation = function (top, left) {
            this.btn.style.top = top;
            this.btn.style.left = left;
        };
        
        this.setLocation(top, left);
}

function moveRandom(btnArray) {
    setInterval(function () {
        for (let i = 0; i < btnArray.length; i++) {
            arrayButtons[i].setLocation(
                Math.floor(Math.random() * 100) + "px",
                Math.floor(Math.random() * 100) + "px");
        }
    }, i * 1000);
}

const colors = [
    "CornflowerBlue", 
    "Crimson", 
    "Coral", 
    "DarkSalmon", 
    "DarkSeaGreen", 
    "MediumPurple", 
    "MistyRose",
    "PaleGreen",
    "PaleVioletRed",
    "Yellow",
    "OliveDrab",
    "Lavender"
];

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

function getColorList(num) {
    const randomColors = [];
    let randColor = "";
    for (let i = 0; i < num; i++) {
        randColor = getRandomColor();
        while (randomColors.includes(randColor)) {
            randColor = getRandomColor();
        }
        randomColors.push(randColor);
    }
    return randomColors;
}

function startGame(num) {
    const colorList = getColorList(num);
    let currentOrder = 1;

    let arrayButtons = [];
    for (let i = 0; i < num; i++) {
        arrayButtons.push(new Button(
            colorList[i], 
            "100px", 
            "100px", 
            Math.floor(Math.random() * 400) + "px", 
            Math.floor(Math.random() * 400) + "px", 
            i
        ));
    }

    moveRandom(arrayButtons);
}

// ------------- Form handling -------------- //
const gameForm = document.getElementById("game-form");
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

    numButtons = parseInt(document.getElementById("btn-count").value);

    // I might have to replace these with a div above the form with text from user.js?
    if (isNaN(numButtons)) {
        showError(userText.errorHandling[0]);
    } else if (numButtons < 3 || numButtons > 7) {
        showError(userText.errorHandling[1]);
    } else {
        gameForm.reset();
        clearError();
        // call the game handler
        // something like startGame(numButtons);
    }

})