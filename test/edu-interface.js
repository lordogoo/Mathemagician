globalThis.nextMenu = "";
globalThis.nextNavigate = "";
globalThis.menuState = 0;
globalThis.processed = true;

globalThis.MultiplayerGameMode = '';
globalThis.ReturnMenu = '';

globalThis.connecting = false;
globalThis.connectingTimer = 0;
globalThis.connectingEndTime = 200;

globalThis.ready = false;
globalThis.readyTimer = 0;
globalThis.readyEndTime = 200;
globalThis.playerready = false;
globalThis.opponentready = false;


globalThis.game = false;
globalThis.gameTimer = 0;
globalThis.gameEndTime = 30000;

class timer{
	constructor(menuname,endtime){
		this.MenuName = menuname;
		this.Timer = 0;
		this.EndTime=endtime;
	}
}


function setInnerHtml(elementname,value){
	let readylist = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #'+elementname);
	for(let i = 0; i < readylist.length;i++){
		readylist[i].innerHTML = value;
	}
}

function clearSelection(elementname){
	let selectlist = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #'+elementname);
	for(let i = 0; i < readylist.length;i++){
		readylist[i].setAttribute('value', '0');
	}
}


function DisableButtons(boolean){
	let ButtonList = document.querySelectorAll('#'+globalThis.currentActiveMenu+' button');
	for(var i = 0; i < ButtonList.length;i++){
		if(!ButtonList[i].classList.contains("startdisabled")){
			ButtonList[i].disabled = boolean;
		}else{
			ButtonList[i].disabled = true;
		}
	}
}

function DisableInputs(boolean){
	var ButtonList = document.getElementsByTagName('input');
	for(var i = 0; i < ButtonList.length;i++){
		ButtonList[i].disabled = boolean;
	}
}

function HandleButtonClick(target){
	var Panel = document.getElementByClassName("buttonList");
	DisableButtons();

	Panel.addEventListener('transitionend', function() {
  		window.location= target+".htm"
	});
	Panel.classList.add('verticalTranslateEnd');
}

function QuestionButtonClick(equation){
	var Panel = document.getElementByClassName("buttonList");
	DisableButtons();

	Panel.addEventListener('transitionend', function() {
		var url = "edu-balanced.htm";
		if(equation !== null){
			url += "?equation="+encodeURIComponent(equation);
		}
  		window.location= url;
	});
	Panel.classList.add('verticalTranslateEnd');
}

function HandleOnLoad(){
	var Panel = document.getElementByClassName("buttonList");
	Panel.classList.add('verticalTranslateStart');
}

function HandleTransition(location){
	DisableButtons(true);
	globalThis.menuState = 1;
	globalThis.nextMenu = location;
}

function HandleNavigate(location){
	DisableButtons(true);
	globalThis.menuState = 1;
	globalThis.nextNavigate = location;
}

function HandleConnection(){
	globalThis.connectingTimer = 0;
	globalThis.connecting = true;
}

function HandleReady(){
	globalThis.readyTimer = 0;
	globalThis.ready = true;
	globalThis.playerready = false;
	globalThis.opponentready = false;
	setInnerHtml('playerready','Not Ready');
	setInnerHtml('opponentready','Not Ready');
}

function animateMenu(functionOnEnd){
	var active = document.getElementById(globalThis.currentActiveMenu);
	var num = parseInt(active.style.marginTop);
	//animate menus
	if((globalThis.menuState ==0 && num < 0)||(globalThis.menuState == 1 && num < 50)){
		active.style.marginTop = (num+5) + '%';
		processed = false;
	}

	if((!globalThis.processed)&&(num == 0)&&(globalThis.menuState == 0)){
                DisableButtons(false);
		if(functionOnEnd !== undefined){
				functionOnEnd(globalThis.currentActiveMenu);
		}
		processed = true
	}
	if((!globalThis.processed)&&(num == 50)){
		if(globalThis.nextNavigate != ""){
			window.location = globalThis.nextNavigate;
			globalThis.nextNavigate = "";
			globalThis.processed = true

		}
		if(globalThis.nextMenu != ""){
			active.style.marginTop = "-50%";
			globalThis.currentActiveMenu = globalThis.nextMenu;
			globalThis.nextMenu = "";
			globalThis.menuState = 0;
			globalThis.processed = true
		}
	}
}

function animateConnection(){
	if(globalThis.connecting){
		var active = document.getElementById(globalThis.currentActiveMenu);
		let loadingList = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #abConnecting');
		
		for(let i = 0; i < loadingList.length; i++){
			let index = Math.floor(globalThis.connectingTimer/50)%3;
			if(index == 0){
				loadingList[i].innerHTML = ".";
			}else if(index == 1){
				loadingList[i].innerHTML = "..";
			}else if(index == 2){
				loadingList[i].innerHTML = "...";
			}
		}
		

		if(globalThis.connectingTimer == globalThis.connectingEndTime){
			globalThis.connecting = false;
			globalThis.connectingTimer = 0;
			//todo find a better way to handle transition to match
			if(active.classList.contains('casual')){
				HandleTransition('CasualMatch');
			}
		}else{
			globalThis.connectingTimer++;
		}
	}
}

function animateReady(){
	if(globalThis.ready){
		var active = document.getElementById(globalThis.currentActiveMenu);
		let loadingList = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #abTimer');
		
		for(let i = 0; i < loadingList.length; i++){
			let timervalue = globalThis.readyEndTime - globalThis.readyTimer;
			loadingList[i].innerHTML = Math.floor(timervalue/10);
		}

		//todo test code
		if(globalThis.readyTimer > globalThis.readyEndTime/2){
			let rList = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #opponentready');
			for(let i = 0; i < rList.length;i++){
				rList[i].innerHTML = "Ready";
			}
		}

		if(globalThis.readyTimer == globalThis.readyEndTime){
			globalThis.ready = false;
			globalThis.readyTimer = 0;
			//todo set up game
			GenerateFromString('CasualGamePlayer','2*(x+6)=12-8');
			GenerateFromString('CasualGameOpponent','x=(5-16)/4');
			globalThis.game = true;
			//todo find a better way to handle transition to match
			if(active.classList.contains('casual')){
				HandleTransition('CasualGame');
			}
		}else{
			globalThis.readyTimer++;
		}
	}
}

function animateGame(){
	if(globalThis.game){
		var active = document.getElementById(globalThis.currentActiveMenu);
		let loadingList = document.querySelectorAll('#'+globalThis.currentActiveMenu+' #abTimer');

		for(let i = 0; i < loadingList.length; i++){
			let timervalue = globalThis.gameEndTime - globalThis.gameTimer;
			loadingList[i].innerHTML = Math.floor(timervalue/10);
		}

		if(globalThis.gameTimer == globalThis.gameEndTime){
			globalThis.game = false;
			globalThis.gameTimer = 0;
			
			//todo find a better way to handle transition to match
			if(active.classList.contains('casual')){
				HandleTransition('CasualConclusion');
			}
		}else{
			globalThis.gameTimer++;
		}
	}
}


/*************************************************
menu handlers
**************************************************/
function MouseOverZPlus(element){
	element.style.zIndex = 2;
}

function MouseOverZMinus(element){
	element.style.zIndex = -2;
}

/*************************************************
button handlers
**************************************************/

function readyClick(){
	setInnerHtml('playerready','Ready');
	globalThis.playerready = true;
}

function ProfileClick(){
	globalThis.ReturnMenu = globalThis.currentActiveMenu;
	HandleTransition("ProfileData");
}

function ProfileBack(){
	HandleTransition(globalThis.ReturnMenu);
}

function MultiplayerCasualClick(){
	globalThis.MultiplayerGameMode = 'casual';
	HandleTransition('MultiPlayerChooseEquation');
}

function MultiplayerRankedClick(){
	globalThis.MultiplayerGameMode = 'ranked';
	HandleTransition('MultiPlayerChooseEquation');
}

function MultiplayerTournimentClick(){
}

function QuestionClick(menu,equation,lesson,test){
	globalThis.currentLesson = lesson;
	globalThis.currentEquation = equation;
	GenerateFromString(menu,equation,test);
	HandleTransition(menu);
	dialogIndex = 0;
	if(!test){
		globalThis.startDialog(lesson);
	}
}

function EquationCreateClick(){
	let eq = 'x=1';
	globalThis.currentEquation = eq;
	GenerateFromString('CreateEdu',eq);
	HandleTransition('CreateEdu');
}

function PlayClick(){
	globalThis.connectingTimer = 0;
	if(globalThis.MultiplayerGameMode == 'casual'){
		HandleTransition('CasualMatching');
	}else if(globalThis.MultiplayerGameMode == 'ranked'){
		HandleTransition('RankedMatching');
	}
}

function ForfitClick(){
	globalThis.game = false;
	globalThis.gameTimer = 0;
	HandleTransition('CasualConclusion');
}

