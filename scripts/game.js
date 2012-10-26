function gameSetup() {
    //screen settings
    var GAME_WIDTH = 700;
    var GAME_HEIGHT = 700;
    var GAME_FPS = 60;

    var GAME_STATE = {
        WON = 'won',
        PLAY = 'play',
        LOST = 'lost',
        PAUSE = 'pause'   
    };

    var map = {
        width: GAME_WIDTH,
        height: GAME_HEIGHT;   
    };

    //set up mouse
    var mousePos = {
        x: 0,
        y: 0,
        isDown: false,
    };

    //set up img vars
    

    //set up game vars
    var gameInPlay = false;
    var gamePaused = false;
    var finished = false;
    var towerArray = [];
    var enemyArray = [];
    var player;
    var level;
    var time;

    //button vars
    var startBut;
    var pauseBut;


}

function gameInit() {

}

function exit() {

}

function retry() {

}

function gameOver() {

}

function pause() {

}

function update() {

}

function draw() {

}