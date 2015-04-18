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
var gameRatio = 0.25;
var loop = 3;
// data --------------------------------------
var jsonData;
// assets ------------------------------------
var board;
var background;
var logo;
var bank;
var win;
var bet;
var payTable;
var jackpotField;
var reelBackGround;
var topReelShadow;
// container ----------------------------------
var reelContainer;
var strip_0;
var strip_1;
var strip_2;
// text fields --------------------------------
var wintxt;
var banktxt;
var betTxt;
var jackpotTxt;
// buttons-------------------------------------
var playBtn;
var betPlusBtn;
var betMinusBtn;
var maxBetBtn;
// audio --------------------------------------
var betAudio;
var clink;
var reelSpinAudio;
var payOffAudio;
// array structures --------------------------------------------
var tmpArr_0 = [];
var tmpArr_1 = [];
var tmpArr_2 = [];
var stripArr_0 = [];
var stripArr_1 = [];
var stripArr_2  = [];
// math && probabilities ---------------------------------------
var wagerChance;
var winSymbols =["Diamond","Seven","Bar","Summertime","Casino","Cherry","Strawberry"];
var symbolSet =["Diamond","Seven","Bar","Summertime","Casino","Cherry","Strawberry","Plum","Orange","Melon","Bell","Lemon"];



function preload() {
	// game data
	game.load.text('data','/game/data/data.json');

	//bitmap atlas definition
	game.load.atlasJSONHash('atlas','/game/assets/images/sprites.png','/game/assets/images/sprites.json');
	game.load.atlas('buttons','/game/assets/images/buttons.png','/game/assets/images/buttons.json');
	game.load.bitmapFont('Kcap','/game/assets/fonts/Kcap.png','/game/assets/fonts/Kcap.fnt');
	game.load.bitmapFont('Jackpot','/game/assets/fonts/Kcap_Y.png','/game/assets/fonts/Kcap_Y.fnt');

	//TODO: json data file [sound atlas]
	game.load.audio('betSnd',['/game/assets/sounds/bet.mp3','/game/assets/sounds/bet.ogg']);
	game.load.audio('payOff',['/game/assets/sounds/payoff.mp3','/game/assets/sounds/payoff.ogg']);
	game.load.audio('clink',['/game/assets/sounds/reel_stop.mp3','/game/assets/sounds/reel_stop.ogg']);
	game.load.audio('spin',['/game/assets/sounds/spin.mp3','/game/assets/sounds/spin.ogg']);


}

function create() {

	

	// background music ----------------------------------
	soundtrack = new buzz.sound( "/game/assets/sounds/Feel_the_Summer", {formats: ["ogg"]});
	soundtrack.setVolume(0);
	soundtrack.loop().play();
	

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
	//Symbols -----------------------------------------
	// group creation ---------------------------------
	reelContainer = game.add.group();
	strip_0 = game.add.group();
	strip_1 = game.add.group();
	strip_2 = game.add.group();

	reelBackGround = game.add.sprite(315,115,'atlas');
	reelBackGround.frameName ='reel_background.png';
	reelContainer.add(reelBackGround);
	reelContainer.add(strip_0);
	topReelShadow = game.add.sprite(reelBackGround.x+11,reelBackGround.y+11,'atlas');
	topReelShadow.frameName='reel_topShadows.png';
	

	// create buttons --------------------------------------------
	playBtn = game.add.button(675,455,'buttons',actionPlay, this,'play_up','play_up','play_down','play_up');
	maxBetBtn = game.add.button(555,455,'buttons',actionMaxBet, this,'maxBet_up','maxBet_up','maxBet_down','maxBet_up');
	betPlusBtn = game.add.button(330,450,'buttons',incrBet,this,'betIncr_up','betIncr_up','betIncr_down','betIncr_up');
	betMinusBtn = game.add.button(330,480,'buttons',decrBet,this,'betDecr_up','betDecr_up','betDecr_down','betDecr_up');
	// Create dynamic bitmap text --------------------------------------------------

	jackpotTxt = game.add.bitmapText(70,64,'Jackpot',accounting.formatMoney(jackpotAmount),50);
	betTxt = game.add.bitmapText(420,465,'Kcap',accounting.formatMoney(betAmount),32);
	wintxt = game.add.bitmapText(420,532,'Kcap',accounting.formatMoney(wonAmount),32);
	wintxt.alpha = 0;
	banktxt = game.add.bitmapText(580,533,'Kcap',accounting.formatMoney(bankAmount),32);


	style = { font: "14px Arial", fill: "#cccccc", align: "right" };
    text = game.add.text(game.world.centerY, 580, version, style);

    console.log("[created]");

// Check for Data load --- firsty test of json data load in Phaser
	jsonData = JSON.parse(game.cache.getText('data'));
	game.cache._text['data'] = JSON.parse(game.cache.getText('data'));

	var sy = game.cache.getText('data').symbols.symbol;
	var re = game.cache.getText('data').reels.strip;
	console.log("[create] :: jsonData parsing :: symbols >> "+sy.length+" \n"+sy[0].id+" \n"+sy[0].text);

	//Tmp Array---------------------------------------------
	for(var a=0; a<re.length; a++){
		console.log("[create] :: jsonData parsing :: reels >> ["+re[a].symbol+"]\n");
		for(var i=0; i<re[a].symbol.length; i++){
			if(a === 0) tmpArr_0.push(re[a].symbol[i]);
			if(a === 1) tmpArr_1.push(re[a].symbol[i]);
			if(a === 2) tmpArr_2.push(re[a].symbol[i]);
		}
	};



	console.log("[create] check intial array :::: "+tmpArr_0+" | "+tmpArr_1+" | "+tmpArr_2);

   // start pseudo "progressive jackpot"
    setTimeout(jackpotIncrement,1500);

};

// reel strip --------------------------------------------------------

function createStrip(){
	for(var i=0; i<6; i++){
		console.log("[createStrip] ::: "+ sy[0].id)
	}
}

//actions ------------------------------------------------------------

function actionPlay(){
	console.log("[Play button]");
	setChance();
	clink.play();
};
function actionMaxBet(){
	console.log("[actionMaxBet button]");
	if(bankAmount > 2)betAmount = 2;
	updateBetField()
	betAudio.play();
};
function incrBet(){
	console.log("[bet increase button]");
	betlogic(1);
	betAudio.play();
};

function decrBet(){
	console.log("[bet decrease button]");
	betlogic(0);
	betAudio.play();
};

function jackpotIncrement(){
	jackpotAmount = jackpotAmount+0.01;
	jackpotTxt.setText(accounting.formatMoney(jackpotAmount));
	setTimeout(jackpotIncrement,1500);
};

function updateBetField(){
	betTxt.setText(accounting.formatMoney(betAmount));
};

function betlogic(id){
	if(id === 1  && betAmount<2){
		betAmount+=0.05;
	};
	if(id === 0){
		if(betAmount < 0.10){
			betAmount = 0.05;
		}else{
			betAmount-= 0.05;
		}	
	};
	updateBetField();
};

//game math ----------------------------------
function setChance(){

	setStripHead();

	wagerChance = Math.round((betAmount/maxBet)*100)*gameRatio;
	var result = chance.bool({likelihood:wagerChance});
	console.log("[setChance] :: trigger random win ::"+result);

	if(result){
		setWinSymbol();
	}else{
		setRamdomSymbols();
	};
};

function setRamdomSymbols(){
	console.log("[setRamdomSymbols] ::: Creating random symbols");
	setStripBody(9);
};

function setWinSymbol(){
	console.log("[setWinSymbol] ::: Creating win symbol");
	setStripBody(6);
};

function setStripHead(){
	// filling up strip 0 to 2 with first 3 symbol from previous game | initial load
	stripArr_0 =[];
	stripArr_1 =[];
	stripArr_2 =[];
		for(var x=0; x<3; x++){
			for(var i=0; i<eval("tmpArr_"+x).length; i++){
				eval("stripArr_"+i).push(eval("tmpArr_"+x)[i]);
			};		
		};

	console.log("[setStripHead] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);
};

function setStripBody(len){
	for(var x=0; x<3; x++){
		for(var i=0; i<len; i++){
			var m = Math.floor(Math.random() * (12 - 0 + 1)) + 0;
			eval("stripArr_"+x).push(m);
		};		
	};

console.log("[setStripBody] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);

resetTmpArray();
};

function resetTmpArray(){
	tmpArr_0 = [];
	tmpArr_1 = [];
	tmpArr_2 = [];
	for(var x=0; x<3; x++){
		for(var p=9; p<12; p++){			
			eval("tmpArr_"+x).push(eval("stripArr_"+x)[p]);
		}
	};

	console.log("[resetTmpArray] new strip head :::: "+tmpArr_0+" | "+tmpArr_1+" | "+tmpArr_2);
}

