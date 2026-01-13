const startBtn = document.getElementById("start-btn");
const gameBoard = document.getElementById("game-board");
const promptTxt = document.getElementById("prompt-txt");

promptTxt.textContent = userText.uiText[0];

/* Note: this code snippet is gvingn you some tips to start
you cannot simply copy this code.
Also your code has to be more modular and create more functions
*/
let arrayButtons = [];
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
    /* we call this method to set original
    top, left during creation of object */
    this.setLocation(top, left);

}

arrayButtons.push(new Button("Red", "100px", "100px", "0px", "0px", 0));
arrayButtons.push(new Button("Blue", "200px", "100px", "200px", "200px", 0));
// In execution, these need to be randomized, not hard coded

// this has to be in a separate function, e.g. moveRandom ... or something
setInterval(function () {
    arrayButtons[0].setLocation(
        Math.floor(Math.random() * 100) + "px",
        Math.floor(Math.random() * 100) + "px");
}, 500);

// ------------- Form handling -------------- //
const gameForm = document.getElementById("game-form");
let numButtons = 0;

gameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    numButtons = parseInt(document.getElementById("btn-count").value);

    // I might have to replace these with a div above the form with text from user.js?
    if (isNaN(numButtons)) {
        alert("Please enter a valid number.");
    } else if (numButtons < 3 || numButtons > 7) {
        alert("Number must be between 3 and 7.");
    }

})