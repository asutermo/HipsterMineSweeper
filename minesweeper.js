	

var gameBoard = {
		rows: 10,
		cols: 10,
		width: 50,
		height: 50,
		fps: 30
};

var canvas;
var canvasDrawContext;
var mouseXPos;
var mouseYPos;
var gridUnit;

function init() {
	canvas = document.getElementById("game_canvas");
	canvasDrawContext = canvas.getContext("2d"); 

	gridUnit = new Image();
	gridUnit.src = "images/starbucks_cup.png";


	drawGrid();
}

function drawGrid() {
	canvasDrawContext.clearRect(0, 0, 400, 400);
	for (var current_row = 0; current_row < gameBoard.rows; current_row++) {
		for (var current_col = 0; current_col < gameBoard.cols; current_col++) {
			var y_position = current_row * gameBoard.height;
			var x_position = current_col * gameBoard.width;
			canvasDrawContext.drawImage(gridUnit, x_position, y_position);
		}
	}
}	