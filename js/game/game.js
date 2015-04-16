//javascript
// TODO: create separate game state structure [boot,preload,game,win,gameover]
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
var version = "V1.0 -[Summer is coming] - Demo Game - Ulrich.Saukel - 15/04/2015";
var gameContainer;
var style;
var text;
var soundtrack;
// initial values -----------------------------------
var betAmount = 0.05;
var maxBet = 2;
var jackpotAmount = 500;
var bankAmount = 100;
var wonAmount =0;
// data --------------------------------------
var jsonData;

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


var playBtn;
var betPlusBtn;
var betMinusBtn;
var maxBetBtn;

var betAudio;
var clink;
var reelSpinAudio;
var payOffAudio;

function preload() {
	//bitmap atlas definition
	game.load.atlasJSONHash('atlas','/game/assets/images/sprites.png','/game/assets/images/sprites.json');
	game.load.atlas('buttons','/game/assets/images/buttons.png','/game/assets/images/buttons.json');
	game.load.bitmapFont('Kcap','/game/assets/fonts/Kcap.png','/game/assets/fonts/Kcap.fnt');

	//TODO: json data file [sound atlas]
	game.load.audio('summer',['/game/assets/sounds/Feel the Summer.mp3','/game/assets/sounds/Feel the Summer.ogg']);
	game.load.audio('betSnd',['/game/assets/sounds/bet.mp3','/game/assets/sounds/bet.ogg']);
	game.load.audio('payOff',['/game/assets/sounds/payoff.mp3','/game/assets/sounds/payoff.ogg']);
	game.load.audio('clink',['/game/assets/sounds/reel_stop.mp3','/game/assets/sounds/reel_stop.ogg']);
	game.load.audio('spin',['/game/assets/sounds/spin_01.mp3','/game/assets/sounds/spin_01.ogg']);

	// game data
	game.load.text('data','/game/data/data.json');
 

}

function create() {

	// Check for Data load
	jsonData = JSON.parse(game.cache.getText('data'));
	game.cache._text['data'] = JSON.parse(game.cache.getText('data'));

	var sy = game.cache.getText('data').symbols.symbol;

	console.log("[create] :: jsonData parsing :: symbols >> "+sy.length+" \n"+sy[0].id+" \n"+sy[0].text);

	// background music ----------------------------------
	soundtrack = game.add.audio('summer');
	soundtrack.volume = 0.2;
	soundtrack.loop = true;
	soundtrack.play();
	// interface audio creation -------------------------
	betAudio = game.add.audio('betSnd');
	betAudio.volume = 0.3;
	clink = game.add.audio('clink');
	clink.volume = 0.5;


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
	playBtn = game.add.button(675,455,'buttons',actionPlay, this,'play_up','play_up','play_down','play_up');
	maxBetBtn = game.add.button(555,455,'buttons',actionMaxBet, this,'maxBet_up','maxBet_up','maxBet_down','maxBet_up');
	betPlusBtn = game.add.button(330,450,'buttons',incrBet,this,'betIncr_up','betIncr_up','betIncr_down','betIncr_up');
	betMinusBtn = game.add.button(330,480,'buttons',decrBet,this,'betDecr_up','betDecr_up','betDecr_down','betDecr_up');
	// Create dynamic bitmap text --------------------------------------------------

	jackpotTxt = game.add.bitmapText(70,70,'Kcap',accounting.formatMoney(jackpotAmount),35);
	betTxt = game.add.bitmapText(420,465,'Kcap',accounting.formatMoney(betAmount),32);
	wintxt = game.add.bitmapText(420,532,'Kcap',accounting.formatMoney(wonAmount),32);
	banktxt = game.add.bitmapText(580,533,'Kcap',accounting.formatMoney(bankAmount),32);


	style = { font: "14px Arial", fill: "#cccccc", align: "right" };
    text = game.add.text(game.world.centerY, 580, version, style);

    console.log("[created]");

   // start pseudo "progressive jackpot"
    setTimeout(jackpotIncrement,1500);
}

//actions ------------------------------------------------------------

function actionPlay(){
	console.log("[Play button]");
	clink.play();
};
function actionMaxBet(){
	console.log("[actionMaxBet button]");
	betAudio.play();
};
function incrBet(){
	console.log("[bet increase button]");
	betAudio.play();
};

function decrBet(){
	console.log("[bet decrease button]");
	betAudio.play();
};

function jackpotIncrement(){
	console.log("[jackpotIncrement] :: bitmap text update on timer")
	jackpotAmount = jackpotAmount+0.01;
	jackpotTxt.setText(accounting.formatMoney(jackpotAmount));
	setTimeout(jackpotIncrement,1500);
};
//----------------------------------------------
