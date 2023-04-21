const jsdom = require("jsdom");
const edu = require('../public/edu.js')

//todo make forfit work
//todo make time out work
//todo make finish game work
//todo clean up queue
//todo deal with disconnects
//todo deal with errors


/************************************************
* helper functions
*************************************************/
function getCookieValue(index,list){
	for(let i = 0; i < list.length; i++){
		if(list[i].trim().startsWith(index+'=')){
			let str = list[i].trim();
			return str.slice(str.indexOf('=') + 1);
		}
	}
	return '';
}

/************************************************
* state classes
*************************************************/
class webSocketState{
	constructor(ws,pg,soc){
		if (this.constructor == webSocketState) {
      			throw new Error("Abstract classes can't be instantiated.");
    		}
		this.wsServer = ws;
		this.dbConnection = pg;
		this.socket = soc;
		this.timeout = 30;
		this.currentTime = 0;
	}
	
	processStart(){
	}
	processMessage(message) {
  	}
	processConnection(){
	}
	onTick(){
	}
	onTimeOut(){
		//todo make default timeout action
	}
}


class websocketStateClientTransition extends webSocketState{
	constructor(ws,pg,soc,nextstate){
		super(ws,pg,soc);
		this.nextState = nextstate;
	}
	processMessage(message) {
		if(message == "transition end"){
			this.socket.MathemagicianStateMachine.changeState(this.nextState);
		}else{
			//todo close connection
		}
	}
}

class webSocketStateAuthenticate extends webSocketState{
	processMessage(message) {
 		//todo need to check if string is actually a cookie string

		let cookielist = message.split(';');
		let userName = getCookieValue('username',cookielist);
		let sessionId = getCookieValue('session',cookielist);
		this.socket.MathemagicianUserName = userName;
		this.socket.MathemagicianSessionID = sessionId;

		let querySession = "Select sid,sess,expire from session where sess::json ->> 'user' = $1 and sess::json ->> 'sessionID' = $2 ";
		this.dbConnection.query(querySession,[userName,sessionId], (err, result) => {
			if(err){
				console.log(err);
				//invalidate connection
				this.socket.send("db error");
				this.socket.close();
			}else{
				if(result.rows.length == 0){
					//invalidate connection
					console.log("not authenticated");
					this.socket.send("could not authenticate");
					this.socket.close();
				}else{
					//continue connection
					console.log("authenticated "+this.socket.MathemagicianUserName);
					let stateMachine = this.socket.MathemagicianStateMachine;
					stateMachine.changeState(new webSocketStateGetGameMode(this.wsServer,this.dbConnection,this.socket));
					this.socket.send("authenticated");
					
				}
			}
		});		
	}
}

class webSocketStateGetGameMode extends webSocketState{	
	constructor(ws,pg,soc){
		super(ws,pg,soc);
		this.gameModes = ['casual','ranked','tourniment'];
	}

	processMessage(message){
		if(!this.gameModes.includes(message)){
			this.socket.send("invalid game mode");
			this.socket.close();			
		}else{
			this.socket.MathemagicianMetaData.gameMode = message;
			let stateMachine = this.socket.MathemagicianStateMachine;
			stateMachine.changeState(new webSocketStateGetEquation(this.wsServer,this.dbConnection,this.socket));	
		}
	}
}

class webSocketStateGetEquation extends webSocketState{
	processMessage(message){
		//todo make sure that the message is a uuid and is one the player is ok to use
		if(false){
			//todo if not a uuid or ok for player then end connection 
		}else{
			this.socket.MathemagicianMetaData.equation = message;

			let opponent = this.wsServer.MathemagicianQueue.findMatch(this.socket.MathemagicianMetaData);
			if(opponent == null){
				let stateMachine = this.socket.MathemagicianStateMachine;
				let nextState = new webSocketStateEnterQueue(this.wsServer,this.dbConnection,this.socket);
				stateMachine.changeState(new websocketStateClientTransition(this.wsServer,this.dbConnection,this.socket,nextState));
				this.socket.send("queue");
			}else{
				this.socket.MathemagicianOpponent = opponent;
				opponent.MathemagicianOpponent = this.socket;
				opponent.MathemagicianStateMachine.applyConnection("match");
				let stateMachine = this.socket.MathemagicianStateMachine;
				this.socket.send("match");
				stateMachine.changeState(new webSocketStateSendOpponentData(this.wsServer,this.dbConnection,this.socket));	
			}
		}
	}
}

class webSocketStateEnterQueue extends webSocketState{
	processStart(){
		this.wsServer.MathemagicianQueue.addPlayer(this.socket);
	}
	processMessage(message){
		this.socket.close();
	}
	processConnection(message){
		let stateMachine = this.socket.MathemagicianStateMachine;
		this.socket.send("match");
		stateMachine.changeState(new webSocketStateSendOpponentData(this.wsServer,this.dbConnection,this.socket));
	}
}

class webSocketStateSendOpponentData extends webSocketState{
	processStart(){
		let opponentData = {}; 
		opponentData.name = this.socket.MathemagicianOpponent.MathemagicianUserName;
		let nextState = new webSocketStateMatchGetReady(this.wsServer,this.dbConnection,this.socket);
		let stateMachine = this.socket.MathemagicianStateMachine;
		stateMachine.changeState(new websocketStateClientTransition(this.wsServer,this.dbConnection,this.socket,nextState));
		this.socket.send(JSON.stringify(opponentData));
	}
}

class webSocketStateMatchGetReady extends webSocketState{
	constructor(ws,pg,soc){
		super(ws,pg,soc);
		this.clientReady = false;
		this.opponentReady = false;
		this.timeout = 20;
	}
	processMessage(message){
		if(message == 'ready'){
			this.clientReady = true;
			this.socket.MathemagicianOpponent.MathemagicianStateMachine.applyConnection("ready");

		}else{
			//todo cancel 
		}
	}
	processConnection(message){
		if(message == 'ready'){
			this.opponentReady = true;
			this.socket.send('ready');
		}else{
			//todo cancel 
		}
	}
	onTick(){
		let time;
		if(this.timeout - this.currentTime > 0){
			time = this.timeout - this.currentTime
		}else{
			time = 0;
		}
		this.socket.send(time+'');
	}
	onTimeOut(){
		if((this.clientReady)&&(this.opponentReady)){
			let stateMachine = this.socket.MathemagicianStateMachine;
			stateMachine.changeState(new webSocketStateSwapEquations(this.wsServer,this.dbConnection,this.socket));
			this.socket.send("play");
		}else{
			this.socket.send("canceled");
			this.socket.close();
		}
	}
}

class webSocketStateSwapEquations extends webSocketState{
	processStart(){
		let queryEquations = "select (Select equation as playerequation from equation where id=$1),(Select equation as opponentequation from equation where id=$2) ";
		this.dbConnection.query(queryEquations,[this.socket.MathemagicianMetaData.equation,this.socket.MathemagicianOpponent.MathemagicianMetaData.equation], (err, result) => {
			if(err){
				console.log(err);
				//invalidate connection
				this.socket.send("db error");
				this.socket.close();
			}else{
				let equationData = {}; 
				equationData.playerEquation = result.rows[0].playerequation;
				equationData.opponentEquation = result.rows[0].opponentequation;
				this.socket.MathemagicianEquation = equationData.playerEquation;

				//todo we want to generate equation on the server
 				let doc = new jsdom.JSDOM(`<!DOCTYPE html><div id="internalMenu"><input id="numberCreatorText" type="number"></input><input id="variableCreatorButton" type="checkbox"></input><table><tr><td><span id="leftdiv" class="left eqDisplay"></span></td><td>=</td><td><span id="rightdiv" class="right eqDisplay"></span></td></tr></table></div>`);
				this.socket.eqObject  = edu.GenerateFromAdvancedString("",doc.window.document,"internalMenu",true,false,this.socket.MathemagicianEquation);

				let nextState = new webSocketStatePlayMatch(this.wsServer,this.dbConnection,this.socket);
				let stateMachine = this.socket.MathemagicianStateMachine;
				stateMachine.changeState(new websocketStateClientTransition(this.wsServer,this.dbConnection,this.socket,nextState));
				this.socket.send(JSON.stringify(equationData));
			}
		});
        }
}

function checkRule(action,socket){
	let rulename = edu.MathemagicianRuleList.getRuleMapping(action);
	edu.MathemagicianRuleList[rulename](socket.eqObject,socket.eqObject.selected)
	console.log("apply "+action+" "+socket.eqObject[rulename]);
	return socket.eqObject[rulename] == true;
}


class webSocketStatePlayMatch extends webSocketState{
	constructor(ws,pg,soc){
		super(ws,pg,soc);
		this.timeout = 300;
	}
	processMessage(message){
		console.log("webSocketStatePlayMatch "+this.socket.MathemagicianUserName+" "+message);
		if(message == 'forfit'){
			this.socket.send('forfit');
			this.socket.MathemagicianMatchResult = 'Fail by Forfit';
			this.socket.MathemagicianOpponent.MathemagicianStateMachine.applyConnection(message);
			let stateMachine = this.socket.MathemagicianStateMachine;
			stateMachine.changeState(new webSocketStateEndMatch(this.wsServer,this.dbConnection,this.socket));
		}else{
			let action = JSON.parse(message);
			//need to double check that the sent function is an allowed function for security reasons
			if((action.name == 'select')||(edu.MathemagicianPerformList[action.name] != undefined)){
				//need to check that sent function can be applied to equation to prevent crashes
				if((action.name == 'select')||(!checkRule(action.name,this.socket.MathemagicianOpponent))){
					console.log(this.socket.MathemagicianUserName+" message ok "+message);
					this.socket.MathemagicianOpponent.MathemagicianStateMachine.applyConnection(message);

					//appy extra parameters to the simulated document
					if(action.extra != undefined){
						Object.keys(action.extra).forEach(key => {
  							let input = this.socket.MathemagicianOpponent.eqObject.document.querySelector("#internalMenu #"+key);
							input.value = action.extra[key];
						});
					}
					
					//apply action to simulated document
					if(action.name == "select"){
						edu.select(this.socket.MathemagicianOpponent.eqObject,action.selected);
					}else{
						edu.MathemagicianPerformList[action.name](this.socket.MathemagicianOpponent.eqObject);
					}

					//check for victory
					if(edu.checkfinishgame(this.socket.MathemagicianOpponent.eqObject)){
						this.socket.MathemagicianMatchResult = "Victory";
						this.socket.MathemagicianOpponent.MathemagicianStateMachine.applyConnection("victory");
						this.socket.send("victory");
						let stateMachine = this.socket.MathemagicianStateMachine;
						stateMachine.changeState(new webSocketStateEndMatch(this.wsServer,this.dbConnection,this.socket));
					}
				}else{
					//todo action is invalid. we are being hacked.
				}				
			}else{
				//todo command doesnt exist. we are being hacked.
			}
		}
	}
	processConnection(message){
		console.log(this.socket.MathemagicianUserName+" message received "+message);
		this.socket.send(message);
		if(message == 'forfit'){
			this.socket.MathemagicianMatchResult = 'Victory by Forfit';
			let stateMachine = this.socket.MathemagicianStateMachine;
			stateMachine.changeState(new webSocketStateEndMatch(this.wsServer,this.dbConnection,this.socket));			
		}else if(message == 'victory'){
			this.socket.MathemagicianMatchResult = 'Fail';
			let stateMachine = this.socket.MathemagicianStateMachine;
			stateMachine.changeState(new webSocketStateEndMatch(this.wsServer,this.dbConnection,this.socket));
		}
	}
	onTick(){
		let time;
		if(this.timeout - this.currentTime > 0){
			time = this.timeout - this.currentTime
		}else{
			time = 0;
		}
		this.socket.send(time+'');
	}
	onTimeOut(){
		this.socket.send("timeout");
		this.socket.MathemagicianMatchResult = 'timeout';
		let stateMachine = this.socket.MathemagicianStateMachine;
		stateMachine.changeState(new webSocketStateEndMatch(this.wsServer,this.dbConnection,this.socket));
	}
}

class webSocketStateEndMatch extends webSocketState{
	processStart(){
		let queryMatchResult = "insert into history(playerName,opponentName,playerEquation,opponentEquation,gameMode,result,whentime) values($1,$2,$3,$4,$5,$6,$7)";
		
		let playerName = this.socket.MathemagicianUserName;
		let opponentName = this.socket.MathemagicianOpponent.MathemagicianUserName;
		let playerEquation = this.socket.MathemagicianEquation;
		let opponentEquation = this.socket.MathemagicianOpponent.MathemagicianEquation;
		let gameMode = this.socket.MathemagicianMetaData.gameMode;
		let result = this.socket.MathemagicianMatchResult;
		let whentime = new Date();

		console.log("webSocketStateEndMatch "+playerName+" "+result);

		this.dbConnection.query(queryMatchResult,[playerName,opponentName,playerEquation,opponentEquation,gameMode,result,whentime], (err, result) => {
			if(err){
				console.log(err);
			}else{
				//todo clear player data 
				this.socket.send(this.socket.MathemagicianMatchResult);
				this.socket.close();
			}
		});
	}
}

class wssStateMachine{
	constructor(wsServer,dbConnection,socket){
		this.socket = socket;
		this.wsServer = wsServer;
		this.dbConnection = dbConnection;
		this.state = new webSocketStateAuthenticate(wsServer,dbConnection,socket);
	}

	changeState(nextstate){
		this.state = nextstate;
		this.state.processStart();
	}

	applyMessage(message){
		if(this.state != null){
			console.log(this.state.constructor.name);
			this.state.processMessage(message);
		}
	}

	applyConnection(message){
		if(this.state != null){
			this.state.processConnection(message);
		}
	}
	
	applyTick(){
		if(this.state != null){
			this.state.onTick();
		}
	}

	applyTimeOut(){
		if(this.state != null){
			this.state.onTimeOut();
		}
	}
}

module.exports = wssStateMachine;