//javascript
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var version = "V1.0 -[Summer is coming] - Demo Game - Ulrich.Saukel - 15/04/2015";
var gameContainer;
var style;
var text;

var soundtrack;
var initialBet = 100;

function preload() {
	game.load.image('background','/game/assets/images/background.png');
	game.load.image('board','/game/assets/images/board.png');
	game.load.image('logo','/game/assets/images/logo.png');
	game.load.audio('summer',['/game/assets/sounds/Feel the Summer.mp3']);
}

function create() {

	soundtrack = game.add.audio('summer');
	soundtrack.volume = 0.2;
	soundtrack.loop = true;
	soundtrack.play();

	game.add.sprite(0,0,'background');
	game.add.sprite(0,0,'board');
	game.add.sprite(575,124,'logo');

	style = { font: "16px Arial", fill: "#ffffff", align: "right" };
    text = game.add.text(game.world.centerY, 575, version, style);

    console.log("[created]");
}

function update() {}