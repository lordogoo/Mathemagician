class clientWebSocketState{
	constructor(statemachine,soc){
		if (this.constructor == clientWebSocketState) {
      			throw new Error("Abstract classes can't be instantiated.");
    		}
		this.socket = soc;
		this.stateMachine = statemachine;
	}

	processStart(){
	}
	processMessage(message){
	}
	processEvent(){
	}
}

class webSocketStateSendGameMode extends clientWebSocketState{	
	processMessage(message){
		console.log("webSocketStateSendGameMode");
		if(message === "authenticated"){
			this.stateMachine.changeState(new webSocketStateGetWaitOrPlay(this.stateMachine,this.socket));
			this.socket.send(globalThis.MultiplayerGameMode);
			this.socket.send(globalThis.equationID);
		}else{
			//deal with other messages
		}
	}
}

class webSocketStateGetWaitOrPlay extends clientWebSocketState{	
	processMessage(message){
		if(globalThis.MultiplayerGameMode == 'casual'){
			if(message == "queue"){
				let nextstate = new webSocketStateQueue(this.stateMachine,this.socket);
				this.stateMachine.changeState(new webSocketStateTransition(this.stateMachine,this.socket,nextstate));
				HandleTransition('CasualMatching');
			}else if(message == "match"){
				this.stateMachine.changeState(new webSocketStateGetOpponentData(this.stateMachine,this.socket));
			}else{
				//error
			}
		}else if(globalThis.MultiplayerGameMode == 'ranked'){
			//todo do ranked match
			//todo maybe create a store for location data so this function can be made generic
			//HandleTransition('RankedMatching');
		}
	}
}

class webSocketStateGetOpponentData extends clientWebSocketState{
	processMessage(message){
		this.socket.opponentData = JSON.parse(message);

		let playerNameView = document.querySelectorAll('#CasualMatch #playerName');
		playerNameView[0].innerHTML = globalThis.username;

		let opponentNameView = document.querySelectorAll('#CasualMatch #opponentName');
		opponentNameView[0].innerHTML = this.socket.opponentData.name;

		let nextstate = new webSocketStateReady(this.stateMachine,this.socket);
		this.stateMachine.changeState(new webSocketStateTransition(this.stateMachine,this.socket,nextstate));
		HandleTransition('CasualMatch');
	}
}

class webSocketStateTransition extends clientWebSocketState{	
	constructor(statemachine,socket,nextstate){
		super(statemachine,socket);
		this.nextState = nextstate;
	}
	processEvent(){
		this.stateMachine.changeState(this.nextState);
		this.socket.send("transition end");
	}
}

class webSocketStateQueue extends clientWebSocketState{
	processMessage(message){
		console.log("queue "+message)
		if(message == "canceled"){
			this.socket.send("canceled");
			this.socket.close();
		}else if(message == "match"){
			this.stateMachine.changeState(new webSocketStateGetOpponentData(this.stateMachine,this.socket));
		}else{
			//todo cancel match
			this.socket.send("canceled");
			this.socket.close();
		}
	}
}

class webSocketStateReady extends clientWebSocketState{
	processMessage(message){
		if(message == "canceled"){

		}else if(message == "play"){
			this.stateMachine.changeState(new webSocketStateGetPlayerEquation(this.stateMachine,this.socket));
			HandleTransition('CasualGame');
		}if(message == "ready"){
			let opponentNameView = document.querySelectorAll('#CasualMatch #opponentready');
			opponentNameView[0].innerHTML = "Ready";
			globalThis.opponentready = true;
		}else if(Number(message)){
			let timerView = document.querySelectorAll('#CasualMatch #abTimer');
			timerView[0].innerHTML = message;
		}
	}
}

class webSocketStateGetPlayerEquation extends clientWebSocketState{
	processMessage(message){		
		let equationData = JSON.parse(message);
		globalThis.equationDataOpponent = GenerateFromAdvancedString("equationDataOpponent",document,'CasualGameOpponent',true,true,equationData.playerEquation);
		globalThis.equationDataPlayer = GenerateFromAdvancedString("equationDataPlayer",document,'CasualGamePlayer',false,true,equationData.opponentEquation);

		let nextstate = new webSocketStatePlay(this.stateMachine,this.socket);
		this.stateMachine.changeState(new webSocketStateTransition(this.stateMachine,this.socket,nextstate));
	}

}

class webSocketStatePlay extends clientWebSocketState{
	processMessage(message){
		console.log(message);
		if(message == "forfit"){
			this.stateMachine.changeState(new webSocketStateEndMatch(this.stateMachine,this.socket));
		}else if(message == "timeout"){
			this.stateMachine.changeState(new webSocketStateEndMatch(this.stateMachine,this.socket));
		}else if(message == "victory"){
			this.stateMachine.changeState(new webSocketStateEndMatch(this.stateMachine,this.socket));
		}else if(isNumber(message)){
			let timerView = document.querySelectorAll('#CasualGame #abTimer');
			timerView[0].innerHTML = message;
		}else{
			console.log(message);
			let action = JSON.parse(message);

			//appy extra parameters to the simulated document
			if(action.extra != undefined){
				Object.keys(action.extra).forEach(key => {
  					let input = document.querySelector("#"+globalThis.equationDataOpponent.menu+" #"+key);
					input.value = action.extra[key];
				});
			}
			
			if(action.name == "select"){
				select(globalThis.equationDataOpponent,action.selected);
			}else{
				console.log(action.name);
				MathemagicianPerformList[action.name](globalThis.equationDataOpponent);
			}
		}
	}
}

class webSocketStateEndMatch extends clientWebSocketState{
	processMessage(message){
		this.stateMachine.endstate = true;

		let endView = document.querySelectorAll('#CasualConclusion #endmessage');
		endView[0].innerHTML = message;

		globalThis.game = false;
		globalThis.gameTimer = 0;

		//reset player equation
		let lefteq = document.querySelector("#CasualGamePlayer #leftdiv");
		let righteq = document.querySelector("#CasualGamePlayer #rightdiv");
		clearChildren(lefteq);
		clearChildren(righteq);

		//reset opponent equation
		let lefteqopp = document.querySelector("#CasualGameOpponent #leftdiv");
		let righteqopp = document.querySelector("#CasualGameOpponent #rightdiv");
		clearChildren(lefteqopp);
		clearChildren(righteqopp);
		
		//reset ready screen
		let readyplayer = document.querySelector("#CasualMatch #playerready");
		readyplayer.innerHTML = "not ready";
		let readyopponent = document.querySelector("#CasualMatch #opponentready");
		readyopponent.innerHTML = "not ready";

		HandleTransition('CasualConclusion');
	}
}

class WebSocketConnection{
	constructor(wsServerAddress){
		this.endstate = false;

		let protocol = "ws"
		if (location.protocol === 'https:') {
    			protocol= "wss"
		}

		this.socket = new WebSocket(protocol+"://"+wsServerAddress+"/");
		this.state = new webSocketStateSendGameMode(this,this.socket);
		this.socket.stateMachine = this;
		
		this.socket.onopen = function(e) {  
			this.send(document.cookie);  
		};

		this.socket.onmessage = function(event) {  
	   		this.stateMachine.state.processMessage(event.data);
		};

		this.socket.onclose = function(event) {  
	  		if (event.wasClean) {

	  		} else {  
	    			alert('close trigger: Connection closed unexpectedly');  
	  		}  
		};

		this.socket.onerror = function(error) {  
	  		alert(`error trigger: ${error.message}`);  
		};
	}

	changeState(state){
		this.state = state;
	}
}