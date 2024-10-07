var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex ,trex_running;
var ground, invisibleGround;
var cloud, cloudGroup, cloudImage;
var obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  ground1 = loadImage("ground2.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadImage("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  cloudImage = loadImage("cloud.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(600,200)
  
  //crie um sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.6;
  
  ground = createSprite(200, 180, 20000, 400);
  ground.addImage("ground", ground1);
  ground.x = ground.width / 2;
  ground.velocityX = -4;
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  obstacleGroup = createGroup();
  cloudGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  // trex.debug = true;

  score = 0;
}

function draw(){
  background(200);
  
  if(gameState === PLAY){

    score = score + Math.round(frameCount/60);
    gameOver.visible = false;
    restart.visible = false;

    if(score>0 && score%1000 === 0){
      checkPointSound.play();
    }

    if (keyDown("space") && trex.y>=100){
      trex.velocityY = -10;
      jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width / 2;
    }

    if(obstacleGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
    else if (gameState === END) {
      ground.velocityX = 0;

      obstacleGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0);
      trex.changeAnimation("collided", trex_collided);
      trex.velocityY = 0;

      gameOver.visible = true;
      restart.visible = true;

      if (mousePressedOver(restart)) {
        reset();
      }
    }

  trex.collide(invisibleGround)


  spawnClouds();
  spawnObstacles();
  drawSprites();
  
  text("Score: " + score, 500, 50);
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(700,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.6;
    cloud.velocityX = -3;

    cloud.lifetime = 250;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudGroup.add(cloud);
  }
}

function spawnObstacles(){
    if (frameCount % 60 === 0){
    var obstacle = createSprite(700,165,10,100);
    obstacle.velocityX = -6;

    obstacle.lifetime = 125;

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }

    obstacle.scale = 0.5;

    obstacleGroup.add(obstacle)
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;
}