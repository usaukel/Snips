//javascript
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
var version = "V1.0 -[Summer is coming] - Demo Game - Ulrich.Saukel - 15/04/2015";
var gameContainer;
var style;
var text;

var soundtrack;
var initialBet = 100;
var initJackpot = 1000;

var board;
var background;
var logo;
var bank;
var win;
var bet;
var payTable;
var jackpotField;
var reelBackGround;

var wintxt;
var banktxt;
var betTxt;
var jackpotTxt;


var play;
var betPlus;
var betMinus;
var maxBet;

function preload() {
	game.load.atlasJSONHash('atlas','/game/assets/images/sprites.png','/game/assets/images/sprites.json');
	game.load.atlas('buttons','/game/assets/images/buttons.png','/game/assets/images/buttons.json');
	game.load.bitmapFont('Kcap','/game/assets/fonts/Kcap.png','/game/assets/fonts/Kcap.fnt');
	game.load.audio('summer',['/game/assets/sounds/Feel the Summer.mp3']);
}

function create() {

	soundtrack = game.add.audio('summer');
	soundtrack.volume = 0.1;
	soundtrack.loop = true;
	soundtrack.play();

	// asset definition -------------------------------

	background = game.add.sprite(0,0,'atlas');
	background.frameName ='background.png';

	board = game.add.sprite(0,0,'atlas');
	board.frameName ='board.png';

	logo = game.add.sprite(575,124,'atlas');
	logo.frameName ='logo.png';

	jackpotField = game.add.sprite(0,10,'atlas');
	jackpotField.frameName ='jackpot_field.png';

	bet = game.add.sprite(370,445,'atlas');
	bet.frameName ='bet_field.png';

	win = game.add.sprite(370,515,'atlas');
	win.frameName ='win_field.png';

	bank = game.add.sprite(550,513,'atlas');
	bank.frameName ='bank_field.png';

	payTable = game.add.sprite(15,146,'atlas');
	payTable.frameName ='payTable_description.png';

	reelBackGround = game.add.sprite(315,115,'atlas');
	reelBackGround.frameName ='reel_background.png';
	
	// create buttons --------------------------------------------
	play = game.add.button(675,455,'buttons',actionPlay, this,'play_up','play_up','play_down');
	maxBet = game.add.button(555,455,'buttons',actionMaxBet, this,'maxBet_up','maxBet_up','maxBet_down');
	betPlus = game.add.button(330,450,'buttons',incrBet,this,'betIncr_up','betIncr_up','betIncr_down');
	betMinus = game.add.button(330,480,'buttons',decrBet,this,'betDecr_up','betDecr_up','betDecr_down');
	// Create dynamic bitmap text --------------------------------------------------

	jackpotTxt = game.add.bitmapText(70,70,'Kcap','10000.00',35);
	betTxt = game.add.bitmapText(420,465,'Kcap','0.25',32);
	wintxt = game.add.bitmapText(420,530,'Kcap','0.00',32);
	banktxt = game.add.bitmapText(605,532,'Kcap','0.00',32);

	style = { font: "14px Arial", fill: "#cccccc", align: "right" };
    text = game.add.text(game.world.centerY, 580, version, style);

    console.log("[created]");
}

function actionPlay(){
	console.log("[Play button]");
};
function actionMaxBet(){
	console.log("[actionMaxBet button]");
};
function incrBet(){
	console.log("[bet increase button]");
};

function decrBet(){
	console.log("[bet decrease button]");
};