var ROWS;
var COLS;
var NUM_MINES;

var DIFFICULTY = 1;
var SAFE = 0;

var canvas;
var canvasContext;
var mouse;

var cells;
var cellWidth;
var cellHeight;
var gridWidth;
var gridHeight;
var gridValid;
var fontSize;

var flags;

var unknown = new Image();
unknown.src = "./images/starbucks_tower.png";
var bomb = new Image();
bomb.src = "./images/radio_tower.png";
var invalid = new Image();
invalid.src = "./images/starbucks_cup.png";
var flag = new Image();
flag.src = "./images/background.png";

window.onload = init;

function init() {
        canvas = document.getElementById("game_canvas");
        canvasContext = canvas.getContext("2d");
        initGrid();
        canvas.onmouseup = updateGrid;
}

function initGrid() {
    cells = [];
    mouse = {
    	x: 0, 
    	y: 0
    };
    gridValid = true;
    flags = 0;
    buildGrid();
    draw();
}

function setEasy() {
    DIFFICULTY = 1;
    initGrid();
}

function setMedium() {
    DIFFICULTY = 2;
    initGrid();
}

function setHard() {
    DIFFICULTY = 3;
    initGrid();
}

function buildGrid() {
    switch(DIFFICULTY) {
        case 1:
            ROWS = 10;
            COLS = 10;
            NUM_MINES = 10;
            break;
        case 2:
            ROWS = 16;
            COLS = 16;
            NUM_MINES = 40;
            break;
        case 3:
            ROWS = 16;
            COLS = 30;
            NUM_MINES = 99;
            break;
    }
    cellWidth = Math.floor(canvas.width / COLS);
    cellHeight = Math.floor(canvas.height / ROWS);
    gridWidth = cellWidth * COLS;
    gridHeight = cellHeight * ROWS;
    document.getElementById("mines").innerHTML = NUM_MINES;

    for(var i = 0; i < ROWS * COLS; i++) {
        var cell = {};
        if(i >= NUM_MINES) {
            cell.code = SAFE;
            cell.isBomb = false;
        }
        else {
            cell.code = SAFE;
            cell.isBomb = true;
        }
        cell.isFlag = false;            
        cell.valid = true;
        cells.push(cell);
    }
    
    cells = shuffleArray(cells);

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
        if(e.isBomb) {
            canvasContext.drawImage(bomb, x, y, cellWidth, cellHeight);
        }
        else {
            canvasContext.drawImage(invalid, x, y, cellWidth, cellHeight);
            /*if(cell.code != SAFE) {
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
    

    var win = checkWin();
    if(win) {
        finishBoard();
    }

    draw();
    
    if(!gridValid) {
        alert("You died in a horrible bombing incident.");
        initGrid();
    }
    else if(win) {
        alert("You survived sweeping through a mine field.");
        initGrid();
    }
}

function callMouseAction(e) {
	if(e.button == 0) {
    	excavate();
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

function excavate() {
        var cellNum = clickedCell();
        if(cellNum != null) {
                if(cells[cellNum].isFlag) {
                        return;
                }
                else {
                        cells[cellNum].valid = false;
                        if(!cells[cellNum].isBomb) {
                                var neighbours = getNeighbours(cellNum);
                                cells[cellNum].code = getBombCount(neighbours);
                                if(cells[cellNum].code == SAFE) {
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
                if(cells[i].valid && !cells[i].isBomb) {
                        win = false;
                        break;
                }
        }
        
        return win;
}

function finishBoard() {
        flags = NUM_MINES;
        for(var i = 0; i < cells.length; i++) {
                if(cells[i].isBomb) {
                        cells[i].isFlag = true;
                }
        }
}

function getNeighbours(index) {
        var neighbours = [];
        var newIndex = index - COLS - 1;
        if(index % COLS != 0 && newIndex >= 0) {
                neighbours.push(newIndex);
        }
        newIndex = index - COLS;
        if(newIndex >= 0) {
                neighbours.push(newIndex);
        }
        newIndex = index - COLS + 1;
        if(index % COLS != COLS - 1 && newIndex >= 0) {
                neighbours.push(newIndex);
        }
        
        newIndex = index - 1;
        if(index % COLS != 0 && newIndex >= 0) {
                neighbours.push(newIndex);
        }
        newIndex = index + 1;
        if(index % COLS != COLS - 1 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        
        newIndex = index + COLS - 1;
        if(index % COLS != 0 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        newIndex = index + COLS;
        if(newIndex < cells.length) {
                neighbours.push(newIndex);
        }
        newIndex = index + COLS + 1;
        if(index % COLS != COLS - 1 && newIndex < cells.length) {
                neighbours.push(newIndex);
        }

        return neighbours;
}

function getBombCount(arr) {
        var bombCount = 0;
        for(var i = 0; i < arr.length; i++) {
                if(cells[arr[i]].isBomb) {
                        bombCount++;
                }
        }
        return bombCount;
}

function expand(arr) {
        for(var i = 0; i < arr.length; i++) {
                var neighbours = getNeighbours(arr[i]);
                if(cells[arr[i]].valid && getBombCount(neighbours) == SAFE) {
                        cells[arr[i]].valid = false;
                        expand(neighbours);
                }
                else {
                        cells[arr[i]].valid = false;
                        cells[arr[i]].code = getBombCount(neighbours);
                }
        }
}

function shuffleArray(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
}