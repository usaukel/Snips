//javascript
// TODO: create separate game state structure [boot,preload,game,win,continue,gameover]
// TODO: Win pattern check - change approach or add logic to check array pattern at key[34] for all strip
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
var version = "V1.0 -[Summer is coming] - Demo Game - Ulrich.Saukel - 15/04/2015";
var gameContainer;
var style;
var text;
var soundtrack;
//timed events --------------------------------------
var progressiveTimer;
// initial values -----------------------------------
var betAmount = 0.05;
var maxBet = 2;
var jackpotAmount = 200;
var bankAmount = 100;
var wonAmount =0;
var gameRatio = 0.15;
var loop = 3;
var currentBet = 0;
var multiplierValue = 0;
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
var mask;
var winframe_0;
var winframe_1;
var winframe_2;
var volumeBarContainer;
var VolumeBarReference = ['volume_max','volume_75','volume_50','volume_25','volume_0'];
var volumeLevel;
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
var volumeBtn;
//symbols -------------------------------------
var Diamond,Seven,Bar,Summertime,Casino,Cherry,Strawberry,Plum,Orange,Melon,Bell,Lemon;
// audio --------------------------------------
var betAudio;
var clink;
var reelSpinAudio;
var payOffAudio;
var symbolWinAudio;
var volumeLevel;
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
var symbolSet =[	["Diamond","diamond.png"],
					["Seven","seven.png"],
					["Bar","bar.png"],
					["Summertime","summerTime.png"],
					["Casino","casino.png"],
					["Cherry","cherry.png"],
					["Strawberry","strawberry.png"],
					["Plum","plum.png"],
					["Orange","orange.png"],
					["Melon","melon.png"],
					["Bell","bell.png"],
					["Lemon","lemon.png"]];
// tween -------------------------------------------------------------
var tween_0;
var tween_1;
var tween_2;
var textTween;
// game flag
var flag;
var value;
var reveseStatus = false;


function preload() {
	// game data
	game.load.text('data','/game/data/data.json');

	//bitmap atlas definition
	game.load.atlasJSONHash('atlas','/game/assets/images/sprites.png','/game/assets/images/sprites.json');
	game.load.spritesheet('win','/game/assets/images/winSparks.png',150,150,44);
	game.load.atlas('volumeLvlBar','/game/assets/images/volumeLvlBar.png','/game/assets/images/volumeLvlBar.json');
	game.load.atlas('buttons','/game/assets/images/buttons.png','/game/assets/images/buttons.json');
	game.load.bitmapFont('Kcap','/game/assets/fonts/Kcap.png','/game/assets/fonts/Kcap.fnt');
	game.load.bitmapFont('Jackpot','/game/assets/fonts/Kcap_Y.png','/game/assets/fonts/Kcap_Y.fnt');

	//TODO: json data file [sound atlas]
	game.load.audio('betSnd',['/game/assets/sounds/bet.mp3','/game/assets/sounds/bet.ogg']);
	game.load.audio('payOff',['/game/assets/sounds/payoff.mp3','/game/assets/sounds/payoff.ogg']);
	game.load.audio('clink',['/game/assets/sounds/reel_stop.mp3','/game/assets/sounds/reel_stop.ogg']);
	game.load.audio('spin',['/game/assets/sounds/spin.mp3','/game/assets/sounds/spin.ogg']);
	game.load.audio('symbolWin',['/game/assets/sounds/SymbolWin.mp3','/game/assets/sounds/SymbolWin.ogg']);


	//preload symbol set
	for(var sym=0; sym<symbolSet.length;sym++){
		var imageName = symbolSet[sym][0];
		var imagePath = '/game/assets/images/symbols/'+symbolSet[sym][1];
		game.load.image(imageName,imagePath);
	}

}

function create() {

	

	// background music ----------------------------------
	soundtrack = new buzz.sound( "/game/assets/sounds/Feel_the_Summer", {formats: ["ogg"]});
	soundtrack.setVolume(100);
	soundtrack.loop().play();
	//spin audio
	reelSpinAudio = game.add.audio('spin');
	reelSpinAudio.volume = 0.5;
	//symbolWin
	symbolWinAudio = game.add.audio('symbolWin');
	symbolWinAudio.volume = 0.8;
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
	//volume bar ---------------------------------------
	/*var vol_xpos = 210;
	var vol_ypos = 555;
	volumeBarContainer = game.add.group();
	volumeBarContainer.x = vol_xpos;
	volumeBarContainer.y = vol_ypos;*/

	volumeLevel = game.add.sprite(210,555,'volumeLvlBar',VolumeBarReference[0]);

	// group creation ---------------------------------
	reelContainer = game.add.group();
	strip_0 = game.add.group();
	strip_1 = game.add.group();
	strip_2 = game.add.group();



	var posX = 329;
	var posY = -2425;
	for(var tgt=0; tgt<3; tgt++){
		eval("strip_"+tgt).x = posX;
		eval("strip_"+tgt).y = posY;
		posX = posX+76;
	};

	mask = game.add.graphics(315, 115);
	mask.beginFill(0xffffff);
	mask.drawRect(10,10,230,243);

	reelBackGround = game.add.sprite(315,115,'atlas');
	reelBackGround.frameName ='reel_background.png';

	
	reelContainer.add(reelBackGround);

	reelContainer.add(strip_0);
	reelContainer.add(strip_1);
	reelContainer.add(strip_2);
	

	topReelShadow = game.add.sprite(reelBackGround.x+11,reelBackGround.y+11,'atlas');
	topReelShadow.frameName='reel_topShadows.png';

	// win group --------------------------------------
	winSparksContainer = game.add.group();
	winSparksContainer.x = 287;
	winSparksContainer.y = 176;


	// create buttons --------------------------------------------
	playBtn = game.add.button(675,455,'buttons',actionPlay, this,'play_up','play_up','play_down','play_up');
	maxBetBtn = game.add.button(555,455,'buttons',actionMaxBet, this,'maxBet_up','maxBet_up','maxBet_down','maxBet_up');
	betPlusBtn = game.add.button(330,450,'buttons',incrBet,this,'betIncr_up','betIncr_up','betIncr_down','betIncr_up');
	betMinusBtn = game.add.button(330,480,'buttons',decrBet,this,'betDecr_up','betDecr_up','betDecr_down','betDecr_up');
	volumeBtn = game.add.button(160,545,'buttons',volumeToggle,this,'volume_up','volume_up','volume_down','volume_up');
	// Create dynamic bitmap text --------------------------------------------------

	jackpotTxt = game.add.bitmapText(50,62,'Jackpot',accounting.formatMoney(jackpotAmount),50);
	betTxt = game.add.bitmapText(420,465,'Kcap',accounting.formatMoney(betAmount),32);
	wintxt = game.add.bitmapText(405,532,'Kcap',accounting.formatMoney(wonAmount),32);
	wintxt.alpha = 0;
	banktxt = game.add.bitmapText(580,533,'Kcap',accounting.formatMoney(bankAmount),32);
	betTxt.align = 'center';
	wintxt.align = 'center';

	style = { font: "14px Arial", fill: "#cccccc", align: "right" };
    text = game.add.text(game.world.centerY, 580, version, style);


// Check for Data load --- firsty test of json data load in Phaser
	jsonData = JSON.parse(game.cache.getText('data'));
	game.cache._text['data'] = JSON.parse(game.cache.getText('data'));

	var sy = game.cache.getText('data').symbols.symbol;
	var re = game.cache.getText('data').reels.strip;
	//console.log("[create] :: jsonData parsing :: symbols >> "+sy.length+" \n"+sy[0].id+" \n"+sy[0].text);

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

	// intial reel in
	setStripHead();
	setChance();
	createStrip();



   // start pseudo "progressive jackpot"
    progressiveTimer = setTimeout(jackpotIncrement,1500);

};

//actions ------------------------------------------------------------

function actionPlay(){
	console.log("[Play button]");
	//setChance();
	newgame();
	reeltween();
	clink.play();
	buttonsEnabled(false);
	updateBank();
	// reset & hide winTxt
	if(wintxt.alpha != 0) {
		textTween = game.add.tween(wintxt).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
	}
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

function volumeToggle(){
	
	if(soundtrack.getVolume() === 0){
		soundtrack.setVolume(100);
	}else{
		soundtrack.decreaseVolume(25);
	};
	setLevel();
	betAudio.play();
};

function setLevel(){
	console.log("[setLevel] ::: volume "+soundtrack.getVolume())
	switch(soundtrack.getVolume()){
		case 100:
			volumeLevel.frameName = VolumeBarReference[0];
		break;
		case 75:
			volumeLevel.frameName = VolumeBarReference[1];
		break;
		case 50:
			volumeLevel.frameName = VolumeBarReference[2];
		break;
		case 25:
			volumeLevel.frameName = VolumeBarReference[3];
		break;
		case 0:
			volumeLevel.frameName = VolumeBarReference[4];
		break;
	}
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

//game simple maths ----------------------------------
function setChance(){

	wagerChance = Math.round((betAmount/maxBet)*100)*gameRatio;
	var result = chance.bool({likelihood:wagerChance});
	console.log("[setChance] :: trigger random win ::"+result);

	flag = result;
	if(result){
		setWinSymbol();
	}else{
		setRamdomSymbols();
	};

	//setStripHead();
};

function setRamdomSymbols(){
	console.log("[setRamdomSymbols] ::: Creating random symbols");
	setStripBody(33);
};

function setWinSymbol(){
	console.log("[setWinSymbol] ::: Creating win symbol");
	setStripBody(31);
	setWinningStrip();
};

function setStripHead(){
	// filling up strip 0 to 2 with first 3 symbol from previous game | initial load
		resetStripsArray();
		
		for(var x=0; x<3; x++){
			for(var i=0; i<eval("tmpArr_"+x).length; i++){
				eval("stripArr_"+i).push(eval("tmpArr_"+x)[i]);
			};		
		};

	console.log("[setStripHead] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);
};

function setStripBody(len){

console.log("[setStripBody before: head only] before ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);
	for(var x=0; x<3; x++){
		for(var i=0; i<len; i++){
			var m = Math.floor(Math.random() * (11 - 0 + 1)) + 0;
			eval("stripArr_"+x).push(m);
		};		
	};
//console.log("before reverse[setStripBody] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);

reverseArrays();

console.log("[setStripBody] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);

	if(len>31)setCacheTmpArray();
};

function setWinningStrip(){
	multiplierValue =0;

	console.log("[setWinningStrip before: head only] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);

	var m = Math.floor(Math.random() * ((winSymbols.length-1) - 0 + 1)) + 0;
	//console.log("[setWinningStrip] :::: "+winSymbols.length, winSymbols[m]);
	var re = game.cache.getText('data').win;

	console.log("[setWinningStrip] ::::: len "+re[winSymbols[m]].strip.length);
	console.log("[setWinningStrip] ::::: len "+re[winSymbols[m]].strip[0].symbol.length);
	console.log("[setWinningStrip] ::::: symbol "+re[winSymbols[m]].strip[0].symbol[0]);
	console.log("[setWinningStrip] ::::: multiplier "+re[winSymbols[m]].multiplier);

	multiplierValue = re[winSymbols[m]].multiplier;

	for(var x=0; x<re[winSymbols[m]].strip.length; x++){
		for(var i=0; i<re[winSymbols[m]].strip[x].symbol.length; i++){
			eval("stripArr_"+x).push(re[winSymbols[m]].strip[x].symbol[i]);
		};		
	};
	console.log("[setWinningStrip] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);

	reverseArrays();

	setCacheTmpArray();

	console.log("[setWinningStrip] ::::\nStrip 0 :: "+stripArr_0+"\nStrip 1 :: "+stripArr_1+"\nStrip 2 :: "+stripArr_2);
};

function setCacheTmpArray(){
	resetTmpArray();
	for(var x=0; x<3; x++){
		for(var p=0; p<3; p++){			
			eval("tmpArr_"+x).push(eval("stripArr_"+x)[p]);
		}
	};

	console.log("[resetTmpArray] new strip head :::: "+tmpArr_0+" | "+tmpArr_1+" | "+tmpArr_2);
}

function reverseArray(tgtArray){
	eval(tgtArray).reverse();
};

function resetTmpArray(){
	tmpArr_0 = [];
	tmpArr_1 = [];
	tmpArr_2 = [];	
};

function resetStripsArray(){
	stripArr_0 =[];
	stripArr_1 =[];
	stripArr_2 =[];	
}

// reel strip --------------------------------------------------------

function createStrip(){
	var posY;
	var posX;
	for(var i=0; i<3; i++){
		//console.log("[createStrip] **************** strip_"+i);
		var group = eval("strip_"+i);
		//mask.alpha = 0;
		group.mask = mask;
		posY = 0;
		for(var sym=0;sym<eval("stripArr_"+i).length-1; sym++){	
		var index = eval("stripArr_"+i)[sym];				
			group.create(0,posY,symbolSet[index][0]);
			posY = posY+80;


		//console.log("[createStrip] symbol asset::: "+index);
		//console.log("[createStrip] generated strip Array ::: "+symbolSet[index][1]);
		};
	};

	//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+strip_0.height);
};

function clearContainer(){
	for(var i=0; i<3; i++){
		var group = eval("strip_"+i);
			group.removeAll();
	}
}


// reel strips tween--------------------------------------------
function reeltween(){
	for(var tw=0;tw<3;tw++){
		var tmpTw = eval("tween_"+tw);
		tmpTw = game.add.tween(eval("strip_"+tw)).to( { y: 130  }, 6500, Phaser.Easing.Bounce.Out, true,tw*500);
		tmpTw.onStart.add(onStart,this);
		tmpTw.onComplete.add(onComplete, this,tmpTw);
	};
}


function onStart(){
	console.log("[onStart] :: ");
	value = 0;
	if(!reelSpinAudio.isPlaying)reelSpinAudio.play();
};

function onComplete(obj){
	
	value++;
	clink.play();
	console.log("[onComplete] ::: "+value +" || "+flag);
	if(value === 3 && flag === false){
		//setTimeout(newgame,1500);
		buttonsEnabled(true);
	};
	if(value === 3 && flag == true){
		celebration();
	}
}

function resetReel(){
	for(var tw=0;tw<3;tw++){
		eval("strip_"+tw).y = -2425;
	}
}

function newgame(){	
	winSparksContainer.removeAll();
	setStripHead();
	setChance();
	clearContainer();
	resetReel();
	createStrip();
};

function buttonsEnabled(flag){
	playBtn.input.enabled = flag;
	maxBetBtn.input.enabled = flag;
	betMinusBtn.input.enabled = flag;
	betPlusBtn.input.enabled = flag;
};

function updateBank(){
	bankAmount = bankAmount - betAmount;
	banktxt.setText(accounting.formatMoney(bankAmount));

	currentBet = betAmount;
}

function reverseArrays(){
	for(var i=0;i<3;i++){
		reverseArray(eval("stripArr_"+i));
	}
}

// celebration animations --------------------------------------------------------

function celebration(){
	symbolWinAudio.play();
	playFrames();
	setTimeout(clearWinFrame,1500);
	bankUpdate();
};

function bankUpdate(){
	console.log("[bankUpdate] ::: "+currentBet)
	if(multiplierValue != "jackpot"){
		wonAmount = currentBet*multiplierValue;
		bankAmount = bankAmount+wonAmount;
	}else{
		clearTimeout(progressiveTimer);
		wonAmount = jackpotAmount;
		bankAmount = bankAmount+wonAmount;
	};
	wintxt.setText(accounting.formatMoney(wonAmount));
	wintxt.alpha = 1;
};

function playFrames(){
	var _posX = -3;
	for(var a=0;a<3;a++){
		var tmpTgt = eval("winframe_"+a);
			tmpTgt = game.add.sprite(_posX,0,'win');
			tmpTgt.animations.add('win');
			tmpTgt.animations.play('win', 20, true);
			winSparksContainer.add(tmpTgt);
		_posX = _posX+82;
	};
};





function clearWinFrame(){	
	buttonsEnabled(true);
};