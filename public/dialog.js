/**************************************************************
The wizard dialog file

This file contains the classes and structure nessisary for 
wizards to have conversations with the player.

requirements:
three.js
wizards.js
**************************************************************/

const fingers = ['Index','Middle','Ring','Pinky'];
const pointfingers = ['Middle','Ring','Pinky'];

let snap = new Audio('/sound/human_finger_click.mp3');
let clap = new Audio('/sound/human_punch_slap_face.mp3');
let slap = new Audio('/sound/noisecreations_NC_SFX_FistPunch-NoVocal_02.mp3');


/*
* dialog construction classes
*/

class dialog{

	constructor(lesson){
		this.lesson = lesson;
		this.current = 0;
		this.actions = [];

	}
}

class dialogAction{
	constructor(){
		this.started = false;
		this.willPause = true;
	}
	
	run(){
		if(this.started == false){
			this.start();
			this.started = true;
		}
		this.update();
		if(this.endcondition()){
			this.end();
		}		
	}

	start(){
        }
	update(){
        }
	endcondition(){
	}
	end(){
		globalThis.currentDialog.current++;
        }	
}

function containsWizard(wizard,wizardList){
	for(var i = 0; i < wizardlist.length;i++){
		if(wizard == wizardList[i]){
			return true;
		}
	}
	return false;
}

class dialogActionWizardEnter extends dialogAction{
	constructor(wizardList){
		super();
		this.wizardList = wizardList;
		this.mode = 0;
		this.frame = 0;
		this.maxframe = 280;
	}
	start(){
		console.log("Wizard Enter");
	}
	update(){
		if(this.mode == 0){
			//animate hands		
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					if(globalThis.wizardlist[w].handList[i] != undefined){
						let handAnimationIndex = this.frame;
						let newpos = (Math.cos(Math.PI*handAnimationIndex/10)+1)/40;
						if(globalThis.wizardlist[w].name == 'West'){
							globalThis.wizardlist[w].handList[i].position.x += newpos;
							globalThis.wizardlist[w].sleeveList[i].position.x += newpos;
						}else if(globalThis.wizardlist[w].name == 'East'){
							globalThis.wizardlist[w].handList[i].position.x -= newpos;
							globalThis.wizardlist[w].sleeveList[i].position.x -= newpos;
						}else if(globalThis.wizardlist[w].name == 'North'){
							globalThis.wizardlist[w].handList[i].position.y -= newpos;
							globalThis.wizardlist[w].sleeveList[i].position.y -= newpos;
						}else if(globalThis.wizardlist[w].name == 'South'){
							globalThis.wizardlist[w].handList[i].position.y += newpos;
							globalThis.wizardlist[w].sleeveList[i].position.y += newpos;
						}
						const value = Math.sin(Math.PI*handAnimationIndex/20);
						for(var j = 0; j < fingers.length;j++){
							globalThis.wizardlist[w].handList[i].getObjectByName(fingers[j]+'_1').rotation.z -= value/64;
							globalThis.wizardlist[w].handList[i].getObjectByName(fingers[j]+'_2').rotation.z -= -value/32;
							globalThis.wizardlist[w].handList[i].getObjectByName(fingers[j]+'_3').rotation.z -= value/64;

						}
					}
				}
			}
			}
			this.frame++;
			if(this.frame >= this.maxframe){
				this.mode = 1;
				this.frame = 0;
				this.maxframe = 140;
			}
		}else if(this.mode == 1){
			//animate head
			//deltaDirection(this.head,this.direction,-0.02);
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){

				let newpos = (this.frame*(1/10))/this.maxframe;
				if(globalThis.wizardlist[w].name == 'West'){
					globalThis.wizardlist[w].head.position.x += newpos;
				}else if(globalThis.wizardlist[w].name == 'East'){
					globalThis.wizardlist[w].head.position.x -= newpos;
				}else if(globalThis.wizardlist[w].name == 'North'){
					globalThis.wizardlist[w].head.position.y -= newpos;
				}else if(globalThis.wizardlist[w].name == 'South'){
					globalThis.wizardlist[w].head.position.y += newpos;
				}
			}
			}
			this.frame++;
			if(this.frame >= this.maxframe){
				this.mode = 2;
				this.frame = 0;
			}
		}

	}
	endcondition(){
		let total = 0;
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				if(this.mode == 2){
					total++;
				}
			}
		}
		if(total == this.wizardList.length){
			return true;
		}
		return false;
	}

}

class dialogActionWizardSpeek extends dialogAction{
	constructor(wizard,text){
		super();
		this.mode = 0;
		this.frame = 0;
		this.frameGoal = 50;
		this.widthStart = 1;
		this.heightStart = 1; 
		this.widthGoal = (window.innerWidth-200);
		this.heightGoal = (window.innerHeight/5);
		this.leftStart = (window.innerWidth-200);
		this.leftGoal = 50;
		this.topStart = (window.innerHeight/2);
		this.topGoal = 50;
		this.wizard = wizard;
		this.text = text;
		this.speach = document.getElementById("SpeachBubble");
		this.classAdd;
	}
	start(){
		console.log("Wizard Speek");
		if(this.wizard == 'East'){
			this.classAdd = '.btm-right';
			
		}else if(this.wizard == 'West'){
			this.classAdd = '.btm-left';
		}else if(this.wizard == 'North'){
			//todo
			this.classAdd = '.right-top';
		}else if(this.wizard == 'South'){
			//todo
			this.classAdd = '.btm-right-in';
		}
		this.speach.classList.add(this.classAdd);
		this.speach.style.width = this.widthStart+"px";
		this.speach.style.height = this.heightStart+"px";
		this.speach.style.left = this.leftStart +"px";
		this.speach.style.top = this.topStart+"px";
		 

		var speachtext = document.getElementById("SpeachBubbleText");
		speachtext.innerHTML = '';
		
        }
	update(){
		if(this.mode == 0){
			//speach bubble inflaits
			this.speach.style.width = (this.widthStart+(this.frame*(this.widthGoal-this.widthStart)/this.frameGoal))+"px";
			this.speach.style.height = (this.heightStart+(this.frame*(this.heightGoal-this.heightStart)/this.frameGoal))+"px";
			this.speach.style.left = (this.leftStart+(this.frame*(this.leftGoal-this.leftStart)/this.frameGoal))+"px";
			this.speach.style.top = (this.topStart+(this.frame*(this.topGoal-this.topStart)/this.frameGoal))+"px";

			if(this.frame == this.frameGoal){
				this.frame = 0;
				this.mode = 1;
			}else{
				this.frame++;
			}
		}else if(this.mode == 1){
			//animate text
			let textpercent = this.frame/this.frameGoal;
        		if(textpercent > 1){ textpercent = 1; }
        		let numchar = this.text.length * textpercent;
        		let modtext = this.text.substring(0,numchar);
			var speachtext = document.getElementById("SpeachBubbleText");
			speachtext.innerHTML = modtext;
			if(this.frame == this.frameGoal){
				this.frame = 0;
				this.frameGoal = 200;
				this.mode = 2;
			}else{
				this.frame++;
			}
		}else if(this.mode == 2){
			//pause for a bit
			if(this.frame == this.frameGoal){
				this.frame = 0;
				this.mode = 3;
			}else{
				this.frame++;
			}
		}
        }
	endcondition(){
		return this.mode == 3;
	}
	end(){
		this.speach.classList.remove(this.classAdd);
		var speachtext = document.getElementById("SpeachBubbleText");
		speachtext.innerHTML = '';
		this.speach.style.width = "1px";
		this.speach.style.height = "1px";
		this.speach.style.left = "-10000px";
		super.end();
	}

}


class dialogActionWizardSnap extends dialogAction{
	constructor(wizardList){
		super();
		this.wizardList = wizardList;
	}
	update(){
		if(this.mode == 0){
		}
	}
}


class dialogActionWizardSlap extends dialogAction{
	constructor(wizardList){
		super();
		this.wizardList = wizardList;
		this.mode = 0;
		this.frame = 0;
		this.maxframe = 200;

		this.rotationStartArm = [];
	}
	start(){
		console.log("Wizard Slap");
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				this.rotationStartArm[i] = globalThis.wizardlist[i].rhand.getObjectByName("Arm").rotation.clone();
			}
		}
	}
	update(){
		if(this.mode == 0){
			//animate slap
			//deltaDirection(this.head,this.direction,-0.02);
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					let rotationStart = this.rotationStartArm[w].z;
					let rotationEnd = this.rotationStartArm[w].z + (Math.PI/16);
					let newrotation = rotationStart+(this.frame*(
								rotationEnd-rotationStart
							)/this.maxframe);
					globalThis.wizardlist[w].handList[i].getObjectByName("Arm").rotation.z = newrotation;
					globalThis.wizardlist[w].sleeveList[i].rotation.z = newrotation;
					globalThis.wizardlist[w].handList[i].getObjectByName("Hand").rotation.z = -newrotation;
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 2;
				this.frame = 0;
				 slap.play();
			}else{
				this.frame++;
			}
		}else if(this.mode == 1){
			//animate unslap
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
			let rotationStart = this.rotationStartArm[w].z + (Math.PI/16);
			let rotationEnd = this.rotationStartArm[w].z ;
			let newrotation = rotationStart+(this.frame*(
						rotationEnd-rotationStart
					)/this.maxframe);
			globalThis.wizardlist[w].handList[i].getObjectByName("Arm").rotation.z = newrotation;
			globalThis.wizardlist[w].sleeveList[i].rotation.z = newrotation;
			globalThis.wizardlist[w].handList[i].getObjectByName("Hand").rotation.z = -newrotation;
			}}}
			if(this.frame >= this.maxframe){
				this.mode = 3;
				this.frame = 0;
				this.maxframe = 200;
			}else{
				this.frame++;
			}
		}
	}
	endcondition(){
		let total = 0;
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				if(this.mode == 4){
					total++;
				}
			}
		}
		if(total == this.wizardList.length){
			return true;
		}
		return false;
	}
}

class dialogActionWizardClap extends dialogAction{
	constructor(wizardList){
		super();
		this.wizardList = wizardList;
		this.mode = 0;
		this.frame = 0;
		this.maxframe = 200;

		this.rotationStart = [];
		this.rotationStartArm = [];
	}
	start(){
		console.log("Wizard Clap");
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				this.rotationStart[i] = globalThis.wizardlist[i].rhand.rotation.clone();
				this.rotationStartArm[i] = globalThis.wizardlist[i].rhand.getObjectByName("Arm").rotation.clone();
			}
		}
	}
	update(){
		if(this.mode == 0){
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				//animate rotate arms
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					if(globalThis.wizardlist[w].handList[i] != undefined){
						let newpos;
						if(globalThis.wizardlist[w].handList[i].handType == "Right"){
							//right
							let rotationStart = this.rotationStart[w].x;
							let rotationEnd = this.rotationStart[w].x-(Math.PI/2);
							newpos = rotationStart+(this.frame*(
									rotationEnd-rotationStart
								)/this.maxframe);				
						}else if(globalThis.wizardlist[w].handList[i].handType == "Left"){
							//left
							let rotationStart = this.rotationStart[w].x;
							let rotationEnd = this.rotationStart[w].x+(Math.PI/2);
							newpos = rotationStart+(this.frame*(
									rotationEnd-rotationStart
								)/this.maxframe);
						}
						
						if(globalThis.wizardlist[w].name == 'West'){
							globalThis.wizardlist[w].handList[i].rotation.x = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.x = newpos;
						}else if(globalThis.wizardlist[w].name == 'East'){
							globalThis.wizardlist[w].handList[i].rotation.x = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.x = newpos;
						}else if(globalThis.wizardlist[w].name == 'North'){
							globalThis.wizardlist[w].handList[i].rotation.z = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.z = newpos;
						}else if(globalThis.wizardlist[w].name == 'South'){
							globalThis.wizardlist[w].handList[i].rotation.z = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.z = newpos;
						}
					}
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 1;
				this.frame = 0;
				this.maxframe = 100;
			}else{
				this.frame++;
			}
		}else if(this.mode == 1){
			//animate clap
			//deltaDirection(this.head,this.direction,-0.02);
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					let rotationStart = this.rotationStartArm[w].z;
					let rotationEnd = this.rotationStartArm[w].z + (Math.PI/16);
					let newrotation = rotationStart+(this.frame*(
								rotationEnd-rotationStart
							)/this.maxframe);
					globalThis.wizardlist[w].handList[i].getObjectByName("Arm").rotation.z = newrotation;
					globalThis.wizardlist[w].sleeveList[i].rotation.z = newrotation;
					globalThis.wizardlist[w].handList[i].getObjectByName("Hand").rotation.z = -newrotation;
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 2;
				this.frame = 0;
				clap.play();
			}else{
				this.frame++;
			}
		}else if(this.mode == 2){
			//animate unclap
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
			let rotationStart = this.rotationStartArm[w].z + (Math.PI/16);
			let rotationEnd = this.rotationStartArm[w].z ;
			let newrotation = rotationStart+(this.frame*(
						rotationEnd-rotationStart
					)/this.maxframe);
			globalThis.wizardlist[w].handList[i].getObjectByName("Arm").rotation.z = newrotation;
			globalThis.wizardlist[w].sleeveList[i].rotation.z = newrotation;
			globalThis.wizardlist[w].handList[i].getObjectByName("Hand").rotation.z = -newrotation;
			}}}
			if(this.frame >= this.maxframe){
				this.mode = 3;
				this.frame = 0;
				this.maxframe = 200;
			}else{
				this.frame++;
			}
		}else if(this.mode == 3){
			//animate rotate back
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					if(globalThis.wizardlist[w].handList[i] != undefined){

						let newpos;
						if(globalThis.wizardlist[w].handList[i].handType == "Right"){
							//right
							let rotationStart = this.rotationStart[w].x-(Math.PI/2);
							let rotationEnd = this.rotationStart[w].x;
							newpos = rotationStart
									+(this.frame*(
										rotationEnd
										-rotationStart
									)/this.maxframe);				
						}else if(globalThis.wizardlist[w].handList[i].handType == "Left"){
							//left
							let rotationStart = this.rotationStart[w].x+(Math.PI/2);
							let rotationEnd = this.rotationStart[w].x;
							newpos = rotationStart
									+(this.frame*(
										rotationEnd
										-rotationStart
									)/this.maxframe);
						}

						if(globalThis.wizardlist[w].name == 'West'){
							globalThis.wizardlist[w].handList[i].rotation.x = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.x = newpos;
						}else if(globalThis.wizardlist[w].name == 'East'){
							globalThis.wizardlist[w].handList[i].rotation.x = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.x = newpos;
						}else if(globalThis.wizardlist[w].name == 'North'){
							globalThis.wizardlist[w].handList[i].rotation.z = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.z = newpos;
						}else if(globalThis.wizardlist[w].name == 'South'){
							globalThis.wizardlist[w].handList[i].rotation.z = newpos;
							globalThis.wizardlist[w].sleeveList[i].rotation.z = newpos;
						}
					}
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 4;
				this.frame = 0;
			}else{
				this.frame++;
			}

		}
	}
	endcondition(){
		let total = 0;
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				if(this.mode == 4){
					total++;
				}
			}
		}
		if(total == this.wizardList.length){
			return true;
		}
		return false;
	}
}

class dialogActionWizardPoint extends dialogAction{
	constructor(wizardList,elementID){
		super();
		this.mode = 0;
		this.frame = 0;
		this.maxframe = 200;
		this.wizardList = wizardList;
		this.elementID = elementID;

		this.rotationFingerStart = [];

	}
	start(){
		console.log("Wizard Point");
		for(var i = 0; i < globalThis.wizardlist.length;i++){
			if(containsWizard(globalThis.wizardlist[i].name,this.wizardList)){
				this.rotationFingerStart[i] = [];
				for(var j = 0; j < pointfingers.length;j++){
					this.rotationFingerStart[i][j] = globalThis.wizardlist[i].rhand.getObjectByName(
										pointfingers[j]+'_1'
									).rotation.clone();
				}
			}
		}
	}
	update(){
		if(this.mode == 0){
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				//animate finger point
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					if(globalThis.wizardlist[w].handList[i] != undefined){
						for(var j = 0; j < pointfingers.length;j++){
							let rotationStart = this.rotationFingerStart[w][j].z;
							let rotationEnd = this.rotationFingerStart[w][j].z+Math.PI/2;
							let value = rotationStart+(this.frame*(rotationEnd-rotationStart)/this.maxframe);
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_1').rotation.z = value;
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_2').rotation.z = value;
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_3').rotation.z = value;

						}
					}
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 1;
				this.frame = 0;
			}else{
				this.frame++;
			}
		}else if(this.mode == 1){
			//animate clap
			for(var w = 0; w < globalThis.wizardlist.length;w++){
			if(containsWizard(globalThis.wizardlist[w].name,this.wizardList)){
				for(var i = 0; i <  globalThis.wizardlist[w].handList.length;i++){
					if(globalThis.wizardlist[w].handList[i] != undefined){
						for(var j = 0; j < pointfingers.length;j++){
							let rotationStart = this.rotationFingerStart[w][j].z+Math.PI/2;
							let rotationEnd = this.rotationFingerStart[w][j].z;
							let value = rotationStart+(this.frame*(rotationEnd-rotationStart)/this.maxframe);
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_1').rotation.z = value;
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_2').rotation.z = value;
							globalThis.wizardlist[w].handList[i].getObjectByName(pointfingers[j]+'_3').rotation.z = value;

						}
					}
				}
			}
			}
			if(this.frame >= this.maxframe){
				this.mode = 2;
				this.frame = 0;
			}else{
				this.frame++;
			}
		}
	}
}

/*
* dialog support functions
*/

export function getDialog(lesson){
	for(var i = 0; i < dialogList.length; i++){
		if(dialogList[i].lesson == lesson){
			return dialogList[i];
		}
	}
	return null;
}

/*
*/
function idleBlink(){
	
	
}


/*
* dialog data
*/
export const dialogList = [];
var dialogA1 = new dialog("A1");
dialogA1.actions.push(new dialogActionWizardEnter(['East']));
//dialogA1.actions.push(new dialogActionWizardPoint(['East']));
dialogA1.actions.push(new dialogActionWizardSpeek('East','Hello'));
dialogA1.actions.push(new dialogActionWizardSpeek('East','I am the Wizard of the East'));
dialogA1.actions.push(new dialogActionWizardSpeek('East','I am here to teach you Algebra'));
dialogA1.actions.push(new dialogActionWizardSpeek('East','Before you is the Algebra Engine'));
//todo point
dialogA1.actions.push(new dialogActionWizardSpeek('East','To use it try clicking the plus symbole'));

dialogList.push(dialogA1)

var dialogA2 = new dialog("A2");
dialogA2.actions.push(new dialogActionWizardEnter(['East']));
dialogList.push(dialogA2)






