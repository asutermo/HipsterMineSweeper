//Fisher-Yates shuffle algorithm
Array.prototype.shuffle = function()
{
	var i = this.length, j, temp;
	while ( --i )
	{
		j = Math.floor( Math.random() * (i - 1) );
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
}

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

//game elements
var difficulty = 1;
var notAMine = 0;

//image elements
var unknown;
var mine;
var flag;
var invalid;

//start the game when page loads
window.onload = init;

function init() {
    canvas = document.getElementById("game_canvas");
    canvasContext = canvas.getContext("2d");
    initImages();
    initGrid();
    canvas.onmouseup = update;
}

function initImages() {
	unknown = new Image();
	unknown.src = "./images/starbucks_tower.png";
	mine = new Image();
	mine.src = "./images/radio_tower.png";
	invalid = new Image();
	invalid.src = "./images/starbucks_cup.png";
	flag = new Image();
	flag.src = "./images/background.png";
}

function initGrid() {
    blocks = [];
    mouse = {
    	x: 0, 
    	y: 0
    };
    gamePlayable = true;
    flags = 0;
    buildGridLayout();
    buildGrid();
    draw();
}

//allow user to pick a difficulty
function setDifficulty(e) {
	difficulty = e;
	initGrid();
}


//using Windows Minesweeper Rules
function buildGridLayout() {
	switch(difficulty) {
        case 1:
            rows = 10;
            cols = 10;
            minesOnBoard = 10;
            break;
        case 2:
            rows = 16;
            cols = 16;
            minesOnBoard = 40;
            break;
        case 3:
            rows = 16;
            cols = 30;
            minesOnBoard = 99;
            break;
    }	
}

function buildGrid() {
    
    blockWidth = Math.floor(canvas.width / cols);
    blockHeight = Math.floor(canvas.height / rows);
    boardWidth = blockWidth * cols;
    boardHeight = blockHeight * rows;
    document.getElementById("mines").innerHTML = minesOnBoard;

    for(var i = 0; i < rows * cols; i++) {
        var block = {};
        if(i >= minesOnBoard) {
            block.code = notAMine;
            block.isMine = false;
        }
        else {
            block.code = notAMine;
            block.isMine = true;
        }
        block.isFlag = false;            
        block.valid = true;
        blocks.push(block);
    }
    
    //blocks = shuffleArray(blocks);
    blocks.shuffle();

    var xPos = 0;
    var yPos = 0;
    for(var i = 0; i < blocks.length; i++) {
	    blocks[i].x = xPos;
	    blocks[i].y = yPos;
	    xPos += blockWidth;
	    if(xPos >= canvas.boardWidth) {
            xPos = 0;
            yPos += blockHeight;
	    }
    }
}

function draw() {
    document.getElementById("flags").innerHTML = flags;
    canvasContext.clearRect(0, 0, boardWidth, boardHeight);
    var xPos = 0;
    var yPos = 0;
    for(var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        checkCellValidity(block, xPos, yPos);
       
        xPos += blockWidth;
        if(xPos >= boardWidth) {
                xPos = 0;
                yPos += blockHeight;
        }
    }
}



function checkCellValidity(e, x, y) {
	if(e.valid) {
        if(e.isFlag) {
            canvasContext.drawImage(flag, x, y, blockWidth, blockHeight);
        }
        else {
			canvasContext.drawImage(unknown, x, y, blockWidth, blockHeight);
        }
	}
    else {
        if(e.isMine) {
            canvasContext.drawImage(mine, x, y, blockWidth, blockHeight);
        }
        else {
            canvasContext.drawImage(invalid, x, y, blockWidth, blockHeight);
            console.log(e.code);
            /*if(block.code != notAMine) {
                    //canvasContext.fillStyle = COLORS.numbers[block.code];
                    canvasContext.fillText(block.code, xPos + blockWidth/2 - fontSize/4, yPos + blockHeight/2 + fontSize/4);
            }*/
        }
	}	
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = Math.floor(e.clientX - rect.left - root.scrollLeft);
    mouse.y =  Math.floor(e.clientY - rect.top - root.scrollTop);
}

function update(e) {

    getMousePos(e);
    checkMouseClick(e);
    

    var didUserWin = checkWin();
    if(didUserWin) {
        finishBoard();
    }

    draw();
    
    if(!gamePlayable) {
        alert("Hipster Scum! You lose!");
        initGrid();
    }
    else if(didUserWin) {
        alert("WINNN!");
        initGrid();
    }
}

function checkMouseClick(e) {
	if(e.button == 0) {
    	checkLocation();
    }
    else if(e.button == 2) {
        placeFlag();
    }
    return;	
}

function placeFlag() {
	var blockNum = clickedCell();
	if(blockNum != null) {
        if(blocks[blockNum].valid) {
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
            if(blocks[blockNum].isFlag) {
                    return;
            }
            else {
                    blocks[blockNum].valid = false;
                    if(!blocks[blockNum].isMine) {
                            var neighbours = getNeighbours(blockNum);
                            blocks[blockNum].code = findRemainingMines(neighbours);
                            if(blocks[blockNum].code == notAMine) {
                                    expand(neighbours);
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

function checkWin() {
    var win = true;
    for(var i = 0; i < blocks.length; i++) {
            if(blocks[i].valid && !blocks[i].isMine) {
                    win = false;
                    break;
            }
    }
    
    return win;
}

function finishBoard() {
    flags = minesOnBoard;
    for(var i = 0; i < blocks.length; i++) {
            if(blocks[i].isMine) {
                    blocks[i].isFlag = true;
            }
    }
}

function getNeighbours(index) {
    var neighbours = [];
    var newIndex = index - cols - 1;
    if(index % cols != 0 && newIndex >= 0) {
            neighbours.push(newIndex);
    }
    newIndex = index - cols;
    if(newIndex >= 0) {
            neighbours.push(newIndex);
    }
    newIndex = index - cols + 1;
    if(index % cols != cols - 1 && newIndex >= 0) {
            neighbours.push(newIndex);
    }
    
    newIndex = index - 1;
    if(index % cols != 0 && newIndex >= 0) {
            neighbours.push(newIndex);
    }
    newIndex = index + 1;
    if(index % cols != cols - 1 && newIndex < blocks.length) {
            neighbours.push(newIndex);
    }
    
    newIndex = index + cols - 1;
    if(index % cols != 0 && newIndex < blocks.length) {
            neighbours.push(newIndex);
    }
    newIndex = index + cols;
    if(newIndex < blocks.length) {
            neighbours.push(newIndex);
    }
    newIndex = index + cols + 1;
    if(index % cols != cols - 1 && newIndex < blocks.length) {
            neighbours.push(newIndex);
    }

    return neighbours;
}

function findRemainingMines(arr) {
        var numMines = 0;
        for(var i = 0; i < arr.length; i++) {
                if(blocks[arr[i]].isMine) {
                        numMines++;
                }
        }
        return numMines;
}

function expand(arr) {
    for(var i = 0; i < arr.length; i++) {
        var neighbours = getNeighbours(arr[i]);
        if(blocks[arr[i]].valid && findRemainingMines(neighbours) == notAMine) {
                blocks[arr[i]].valid = false;
                expand(neighbours);
        }
        else {
                blocks[arr[i]].valid = false;
                blocks[arr[i]].code = findRemainingMines(neighbours);
        }
    }
}

