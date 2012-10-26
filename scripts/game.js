function playerInit() {
    var playerHealth = 10;
    var playerCredits = 50;
}

function enemyInit() {
    var maxEnemyCount = 25;
    var creditsPerEnemy = [1, 2, 3];
    var healthPerEnemy = [50, 100, 150]; 
    var speedPerEnemy = [5, 10, 15]; 
}

function towerInit() {
    var costOfTower = [2, 5, 15];
    var damageByTower = [10, 20, 70];
    var radiusOfTower = [1, 2, 3];
    var speedOfTowerShots = [1, 2, 3];
}

function mapInit() {

}

function otherInit() {

}

function imagesInit() {
    var background = new Image();
    var normalTower = new Image();
    var aoeTower = new Image();

    background.src = "/images/background.png";  
}

//GAME
function gameInit() {
    playerInit();
    enemyInit();
    towerInit();
    imagesInit();
    gameStart();
}

function gameStart() {
    //if all images have loaded
    if (background.complete)  {

    }  
}

function exit() {

}

function retry() {

}

function gameOver() {

}

function pause() {

}


//PLAYER
function playerHurt()
{
    playerHealth = playerHealth - 1;

    if (playerHealth <= 0)
    {
        gameOver();
    }
}


//ENEMY
function enemyHurt() {


}

function enemyCreate() {

}

//TOWER
function towerCreate() {

}

function towerDelete() {

}



function update() {

}

function draw() {

}