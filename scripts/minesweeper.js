var rows;
var cols;
var minesOnBoard;

var difficulty = 1;
var notAMine = 0;

var canvas;
var canvasContext;
var mouse;

var cells;
var cellWidth;
var cellHeight;
var gridWidth;
var gridHeight;
var gridValid;

var flags;

var unknown;
var mine;
var flag;
var invalid;
window.onload = init;

function init() {
    canvas = document.getElementById("game_canvas");
    canvasContext = canvas.getContext("2d");
    initImages();
    initGrid();
    canvas.onmouseup = updateGrid;
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
    cells = [];
    mouse = {
    	x: 0, 
    	y: 0
    };
    gridValid = true;
    flags = 0;
    buildGridLayout();
    buildGrid();
    draw();
}

function setDifficulty(e) {
	difficulty = e;
	initGrid();
}

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
    
    cellWidth = Math.floor(canvas.width / cols);
    cellHeight = Math.floor(canvas.height / rows);
    gridWidth = cellWidth * cols;
    gridHeight = cellHeight * rows;
    document.getElementById("mines").innerHTML = minesOnBoard;

    for(var i = 0; i < rows * cols; i++) {
        var cell = {};
        if(i >= minesOnBoard) {
            cell.code = notAMine;
            cell.isMine = false;
        }
        else {
            cell.code = notAMine;
            cell.isMine = true;
        }
        cell.isFlag = false;            
        cell.valid = true;
        cells.push(cell);
    }
    
    //cells = shuffleArray(cells);
    cells.shuffle();

    var xPos = 0;
    var yPos = 0;
    for(var i = 0; i < cells.length; i++) {
	    cells[i].x = xPos;
	    cells[i].y = yPos;
	    xPos += cellWidth;
	    if(xPos >= canvas.gridWidth) {
            xPos = 0;
            yPos += cellHeight;
	    }
    }
}

function draw() {
    document.getElementById("flags").innerHTML = flags;
    canvasContext.clearRect(0, 0, gridWidth, gridHeight);
    var xPos = 0;
    var yPos = 0;
    for(var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        checkCellValidity(cell, xPos, yPos);
       
        xPos += cellWidth;
        if(xPos >= gridWidth) {
                xPos = 0;
                yPos += cellHeight;
        }
    }
}



function checkCellValidity(e, x, y) {
	if(e.valid) {
        if(e.isFlag) {
            canvasContext.drawImage(flag, x, y, cellWidth, cellHeight);
        }
        else {
			canvasContext.drawImage(unknown, x, y, cellWidth, cellHeight);
        }
	}
    else {
        if(e.isMine) {
            canvasContext.drawImage(mine, x, y, cellWidth, cellHeight);
        }
        else {
            canvasContext.drawImage(invalid, x, y, cellWidth, cellHeight);
            console.log(e.code);
            /*if(cell.code != notAMine) {
                    //canvasContext.fillStyle = COLORS.numbers[cell.code];
                    canvasContext.fillText(cell.code, xPos + cellWidth/2 - fontSize/4, yPos + cellHeight/2 + fontSize/4);
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

function updateGrid(e) {

    getMousePos(e);
    callMouseAction(e);
    

    var didUserWin = checkWin();
    if(didUserWin) {
        finishBoard();
    }

    draw();
    
    if(!gridValid) {
        alert("Hipster Scum! You lose!");
        initGrid();
    }
    else if(didUserWin) {
        alert("WINNN!");
        initGrid();
    }
}

function callMouseAction(e) {
	if(e.button == 0) {
    	checkLocation();
    }
    else if(e.button == 2) {
        setFlag();
    }
    else {
        return;
    }	
}

function setFlag() {
	var cellNum = clickedCell();
	if(cellNum != null) {
        if(cells[cellNum].valid) {
            cells[cellNum].isFlag = !cells[cellNum].isFlag;
            if(cells[cellNum].isFlag) {
                    flags++;
            }
            else {
                    flags--;
            }
        }
	}
}

function checkLocation() {
        var cellNum = clickedCell();
        if(cellNum != null) {
                if(cells[cellNum].isFlag) {
                        return;
                }
                else {
                        cells[cellNum].valid = false;
                        if(!cells[cellNum].isMine) {
                                var neighbours = getNeighbours(cellNum);
                                cells[cellNum].code = findRemainingMines(neighbours);
                                if(cells[cellNum].code == notAMine) {
                                        expand(neighbours);
                                }
                        }
                        else {
                                gridValid = false;
                        }
                }
        }
}

function clickedCell() {
        var xPos = 0;
        var yPos = 0;

        for(var i = 0; i < cells.length; i++) {
                if(mouse.x < xPos || mouse.x > (xPos + cellWidth) || mouse.y < yPos || mouse.y > (yPos + cellHeight)) {
                }
                else {
                        return i;
                }
                xPos += cellWidth;
                if(xPos >= gridWidth) {
                        xPos = 0;
                        yPos += cellHeight;
                }
        }

        return null;
}

function checkWin() {
        var win = true;
        for(var i = 0; i < cells.length; i++) {
                if(cells[i].valid && !cells[i].isMine) {
                        win = false;
                        break;
                }
        }
        
        return win;
}

function finishBoard() {
        flags = minesOnBoard;
        for(var i = 0; i < cells.length; i++) {
                if(cells[i].isMine) {
                        cells[i].isFlag = true;
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
        if(index % cols != cols - 1 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        
        newIndex = index + cols - 1;
        if(index % cols != 0 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        newIndex = index + cols;
        if(newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        newIndex = index + cols + 1;
        if(index % cols != cols - 1 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }

        return neighbours;
}

function findRemainingMines(arr) {
        var numMines = 0;
        for(var i = 0; i < arr.length; i++) {
                if(cells[arr[i]].isMine) {
                        numMines++;
                }
        }
        return numMines;
}

function expand(arr) {
    for(var i = 0; i < arr.length; i++) {
        var neighbours = getNeighbours(arr[i]);
        if(cells[arr[i]].valid && findRemainingMines(neighbours) == notAMine) {
                cells[arr[i]].valid = false;
                expand(neighbours);
        }
        else {
                cells[arr[i]].valid = false;
                cells[arr[i]].code = findRemainingMines(neighbours);
        }
    }
}

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
