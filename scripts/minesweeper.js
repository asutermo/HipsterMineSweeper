//Fisher-Yates shuffle algorithm
Array.prototype.shuffle = function () {
    var i = this.length, floor, holder;
    while (--i) {
        floor = Math.floor(Math.random() * (i - 1));
        holder = this[i];
        this[i] = this[floor];
        this[floor] = holder;
    }
};

//UI elements
var canvas;
var canvasContext;
var mouse;

//board elements
var rows;
var cols;
var blocks;
var blockWidth;
var blockHeight;
var boardWidth;
var boardHeight;
var gamePlayable;
var minesOnBoard;
var flags;
var flagHeight;
var flagWidth;

//game elements
var difficulty = 1;
var notAMine = 0;

//image elements
var unknown;
var mine;
var flag;
var invalid;
var zero;
var one;
var two;
var three;
var four;
var five;
var six;
var seven;
var eight;
var nine;

//start the game when images load. and when page loads
initImages();
window.onload = init;

function init() {
    canvas = document.getElementById("game_canvas");
    canvasContext = canvas.getContext("2d");
    addDifficultyButtons();
    addFlagCounter();
    //initImages();
    initLegend();
    initBoard();
    canvas.onmouseup = update;
}

function addDifficultyButtons() {
    document.getElementById('difficulty').innerHTML += "<input type='button' name='reset' value='Reset' onclick='initBoard()'/>";
    document.getElementById('difficulty').innerHTML += "<input type='button' name='easy' value='Easy' onclick='setDifficulty(1)'/>";
    document.getElementById('difficulty').innerHTML += "<input type='button' name='medium' value='Medium' onclick='setDifficulty(2)'/>";
    document.getElementById('difficulty').innerHTML += "<input type='button' name='hard' value='Hard' onclick='setDifficulty(3)'/>";
}

function addFlagCounter() {
    document.getElementById('flagDiv').innerHTML += "<span id='flagText'>Flags Used: </span>";
    document.getElementById('flagDiv').innerHTML += "<span id='flags'></span> /";
    document.getElementById('flagDiv').innerHTML += "<span id='mines'></span>";
    document.getElementById('flagDiv').innerHTML += "<br />";
    document.getElementById('flagDiv').innerHTML += "<br />";
}

function initImages() {
    unknown = new Image();
    unknown.src = "./images/pbr.png";
    mine = new Image();
    mine.src = "./images/radio_tower.png";
    invalid = new Image();
    invalid.src = "./images/starbucks_cup.png";
    flag = new Image();
    flag.src = "./images/starbucks_tower.png";
    zero = new Image();
    zero.src = "./images/0.png";
    one  = new Image();
    one.src = "./images/1.png";
    two = new Image();
    two.src = "./images/2.png";
    three = new Image();
    three.src = "./images/3.png";
    four = new Image();
    four.src = "./images/4.png";
    five = new Image();
    five.src = "./images/5.png";
    six = new Image();
    six.src = "./images/6.png";
    seven = new Image();
    seven.src = "./images/7.png";
    eight = new Image();
    eight.src = "./images/8.png";
    nine = new Image();
    nine.src = "./images/9.png";
}

function initLegend() {
    document.getElementById('legend').innerHTML += "<span>Unknown: </span><img src='./images/pbr.png'/>";
    document.getElementById('legend').innerHTML += "<span>Flag: </span><img src='./images/starbucks_tower.png'/>";
    document.getElementById('legend').innerHTML += "<span>Mine: </span><img src='./images/radio_tower.png'/>";
    document.getElementById('legend').innerHTML += "<span>Unveiled: </span><img src='./images/starbucks_cup.png'/>";
}

function initBoard() {
    blocks = [];
    mouse = {
        x: 0,
        y: 0
    };
    gamePlayable = true;
    flags = 0;
    buildBoardLayout();
    buildBoard();
    draw();
}

//allow user to pick a difficulty
function setDifficulty(e) {
    difficulty = e;
    initBoard();
}

//using Windows Minesweeper Rules
function buildBoardLayout() {
    if (difficulty == 1) {
        rows = cols = 10;
        minesOnBoard = 10;
    }
    else if (difficulty == 2) {
        rows = cols = 16;
        minesOnBoard = 40;
    }
    else if (difficulty == 3) {
        rows = 16;
        cols = 30;
        minesOnBoard = 99;
    }
    else {
        rows = cols = 10;
        minesOnBoard = 10;
    }
}

function setBlocksOnBoard() {
    var dim = rows * cols;
    for (var i = 0; i < dim; i++) {
        var block = {};
        if (i >= minesOnBoard) {
            block.blockType = notAMine;
            block.isMine = false;
        }
        else {
            block.blockType = notAMine;
            block.isMine = true;
        }
        block.isFlag = false;
        block.isClickable = true;
        blocks.push(block);
    }
}
function setBoardDetails() {
    blockWidth = Math.floor(canvas.width / cols);
    blockHeight = Math.floor(canvas.height / rows);
    flagWidth = blockWidth / 4;
    flagHeight = blockHeight / 4;
    boardWidth = blockWidth * cols;
    boardHeight = blockHeight * rows;
}

function setPositions() {
    var xPosition = 0;
    var yPosition = 0;
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].x = xPosition;
        blocks[i].y = yPosition;
        xPosition += blockWidth;
        if (xPosition >= canvas.boardWidth) {
            xPosition = 0;
            yPosition += blockHeight;
        }
    }
}
function buildBoard() {
    setBoardDetails();
    updateMinesLabel();
    setBlocksOnBoard();
    blocks.shuffle();
    setPositions();
}

function updateMinesLabel() {
    var html;
    if (minesOnBoard >= 10) {
        var firstDigit = Math.floor(minesOnBoard / 10)  ;
        var secondDigit = minesOnBoard % 10;
        html = "<img src='./images/"+firstDigit+".png'width='"+flagWidth+"' height='"+flagHeight+"'/><img src='./images/"+secondDigit+".png'width='"+flagWidth+"' height='"+flagHeight+"'/>";
    }
    else {
        html = "<img src='./images/"+minesOnBoard+".png' width='"+flagWidth+"' height='"+flagHeight+"'/>";
    }

    document.getElementById("mines").innerHTML = html;
}

function updateDrawPosition(xPosition, yPosition) {
    xPosition += blockWidth;
    if (xPosition >= boardWidth) {
        xPosition = 0;
        yPosition += blockHeight;
    }
    return {xPosition:xPosition, yPosition:yPosition};
}
function draw() {
    updateFlagsLabel();
    canvasContext.clearRect(0, 0, boardWidth, boardHeight);
    var xPosition = 0;
    var yPosition = 0;
    for(var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        checkCellValidity(block, xPosition, yPosition);
        var __ret = updateDrawPosition(xPosition, yPosition);
        xPosition = __ret.xPosition;
        yPosition = __ret.yPosition;
    }
}

function updateFlagsLabel() {
    document.getElementById("flags").innerHTML = "<img src='./images/" + flags + ".png' width='" + flagWidth + "' height='" + flagHeight + "'/>";
}

function checkCellValidity(e, x, y) {
    if(e.isClickable) {
        cellIsValid(e, x, y);
    }
    else {
        cellIsInvalid(e, x, y);
    }
}

function cellIsValid(e, x, y) {
    if(e.isFlag) {
        canvasContext.drawImage(flag, x, y, blockWidth, blockHeight);
    }
    else {
        canvasContext.drawImage(unknown, x, y, blockWidth, blockHeight);
    }
}

function cellIsInvalid(e, x, y) {
    if(e.isMine) {
        canvasContext.drawImage(mine, x, y, blockWidth, blockHeight);
    }
    else {
        canvasContext.drawImage(invalid, x, y, blockWidth, blockHeight);

        if (e.blockType != notAMine) {
            var imageToDraw = new Image();
            switch (e.blockType) {
                case 0:
                    imageToDraw = zero;
                    break;
                case 1:
                    imageToDraw = one;
                    break;
                case 2:
                    imageToDraw = two;
                    break;
                case 3:
                    imageToDraw = three;
                    break;
                case 4:
                    imageToDraw = four;
                    break;
                case 5:
                    imageToDraw = five;
                    break;
                case 6:
                    imageToDraw = six;
                    break;
                case 7:
                    imageToDraw = seven;
                    break;
                case 8:
                    imageToDraw = eight;
                    break;
                case 9:
                    imageToDraw = nine;
                    break;

            }
            canvasContext.drawImage(imageToDraw, x, y, blockWidth, blockHeight);
        }
    }
}

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = Math.floor(e.clientX - rect.left - root.scrollLeft);
    mouse.y =  Math.floor(e.clientY - rect.top - root.scrollTop);
}


function update(e) {

    getMousePosition(e);
    checkMouseClick(e);
    var didUserWin = checkIfUserWon();
    draw();
    checkUserGameTermination(didUserWin);
}

function checkMouseClick(e) {
    //if left or right mouse click
    if(e.button == 0) {
        checkLocation();
    }
    else if(e.button == 2) {
        placeFlag();
    }
}

function placeFlag() {
    var blockNum = clickedCell();
    if(blockNum != null) {
        if(blocks[blockNum].isClickable) {
            blocks[blockNum].isFlag = !blocks[blockNum].isFlag;
            if(blocks[blockNum].isFlag) {
                flags++;
            }
            else {
                flags--;
            }
        }
    }
}

function checkLocation() {
    var blockNum = clickedCell();
    if(blockNum != null) {
        if (!blocks[blockNum].isFlag) {
            blocks[blockNum].isClickable = false;
            if (!blocks[blockNum].isMine) {
                var adjacents = getAdjacents(blockNum);
                blocks[blockNum].blockType = findRemainingMines(adjacents);
                if (blocks[blockNum].blockType == notAMine) {
                    invalidCellExpansion(adjacents);
                }
            }
            else {
                gamePlayable = false;
            }
        }
    }
}

function clickedCell() {
    var xPos = 0;
    var yPos = 0;

    for(var i = 0; i < blocks.length; i++) {
        if(mouse.x < xPos || mouse.x > (xPos + blockWidth) || mouse.y < yPos || mouse.y > (yPos + blockHeight)) {
        }
        else {
            return i;
        }
        xPos += blockWidth;
        if(xPos >= boardWidth) {
            xPos = 0;
            yPos += blockHeight;
        }
    }

    return null;
}

function getAdjacents(index) {
    var adjacents = [];
    var newIndex = index - cols - 1;
    var indexMod = index % cols;
    var leftCheck = cols - 1;
    var rightCheck = cols + 1;

    if(indexMod != 0 && newIndex >= 0) {
        adjacents.push(newIndex);
    }
    newIndex = index - cols;
    if(newIndex >= 0) {
        adjacents.push(newIndex);
    }
    newIndex = index - rightCheck;
    if(indexMod != leftCheck && newIndex >= 0) {
        adjacents.push(newIndex);
    }

    newIndex = index - 1;
    if(indexMod != 0 && newIndex >= 0) {
        adjacents.push(newIndex);
    }
    newIndex = index + 1;
    if(indexMod != leftCheck && newIndex < blocks.length) {
        adjacents.push(newIndex);
    }

    newIndex = index + leftCheck;
    if(indexMod != 0 && newIndex < blocks.length) {
        adjacents.push(newIndex);
    }
    newIndex = index + cols;
    if(newIndex < blocks.length) {
        adjacents.push(newIndex);
    }
    newIndex = index + rightCheck;
    if(indexMod != leftCheck && newIndex < blocks.length) {
        adjacents.push(newIndex);
    }

    return adjacents;
}

function findRemainingMines(e) {
    var numMines = 0;
    for(var i = 0; i < e.length; i++) {
        if(blocks[e[i]].isMine) {
            numMines++;
        }
    }
    return numMines;
}

function invalidCellExpansion(e) {
    for(var i = 0; i < e.length; i++) {
        var adjacents = getAdjacents(e[i]);
        if(blocks[e[i]].isClickable && findRemainingMines(adjacents) == notAMine) {
            blocks[e[i]].isClickable = false;
            invalidCellExpansion(adjacents);
        }
        else {
            blocks[e[i]].isClickable = false;
            blocks[e[i]].blockType = findRemainingMines(adjacents);
        }
    }
}

function checkUserGameTermination(didUserWin) {
    if (!gamePlayable) {
        alert("Hipster Scum! You lose!");
        initBoard();
    }
    else if (didUserWin) {
        alert("WINNN!");
        initBoard();
    }
}
function checkIfUserWon() {
    var didUserWin = checkWin();
    if (didUserWin) {
        terminateBoard();
    }
    return didUserWin;
}

function checkWin() {
    var win = true;
    for(var i = 0; i < blocks.length; i++) {
        if(blocks[i].isClickable && !blocks[i].isMine) {
            win = false;
            break;
        }
    }

    return win;
}

function terminateBoard() {
    flags = minesOnBoard;
    for(var i = 0; i < blocks.length; i++) {
        if(blocks[i].isMine) {
            blocks[i].isFlag = true;
        }
    }
}

