const handUrl = './textures/hands.glb';
const sleeveUrlStars = './textures/sleeveStars.glb';
const sleeveUrlCubes = './textures/sleeveCubes.glb';
const sleeveUrlLeaves = './textures/sleeveLeaves.glb';
const sleeveUrlLetters = './textures/sleeveLetters.glb';
const headUrlStars = './textures/headStars.glb';
const headUrlCubes = './textures/headCubes.glb';
const headUrlLeaves = './textures/headLeaves.glb';
const headUrlLetters = './textures/headLetters.glb';

const eyesName = 'eyes';
const neckName = 'ORG-spine005';
const jawName = 'jaw_master';
//eye lids
const lidTopRightName = 'DEF-lidTR';
const lidTopRightName2 = 'DEF-lidTR001';
const lidTopRightName3 = 'DEF-lidTR002';
const lidTopRightName4 = 'DEF-lidTR003';
const lidBottomRightName = 'lidBR002';
const lidTopLeftName = 'lidTL002';
const lidBottomLeftName = 'lidBL002';
//lips
const lipsRightName = 'ORG-lipsR';
const lipsTopRightName = 'ORG-lipTR001';
const lipsTopName = 'ORG-lipT';
const lipsTopLeftName = 'ORG-lipTL001';
const lipsLeftName = 'ORG-lipsL';
const lipsBottomRightName = 'ORG-lipBR001';
const lipsBottomName = 'ORG-lipB';
const lipsBottomLeftName = 'ORG-lipBL001';



export const directions = ['East','West','North','South'];
	

const handdepth = 6;

function HandDirectionDecode(model,direction,type,frustum) {
	if(direction == 'West'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(90);
		model.position.z += -handdepth ;
			
		if(type == 'Right'){
			model.position.y += -2 ;
		}else if(type == 'Left'){
			model.position.y += 2 ;
		}
	}else if(direction == 'East'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(270);
		model.position.z += -handdepth ;
		//todo make sure hands are in right place
		model.position.x += -35;
		if(type == 'Right'){
			model.position.y += 2 ;
		}else if(type == 'Left'){
			model.position.y += -2 ;
		}
	}else if(direction == 'North'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(0);
		model.position.z += -handdepth ;
		if(type == 'Right'){
			model.position.x += -2 ;
		}else if(type == 'Left'){
			model.position.x += 2 ;
		}
	}else if(direction == 'South'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(180);
		model.position.z += -handdepth ;
		if(type == 'Right'){
			model.position.x += 2 ;
		}else if(type == 'Left'){
			model.position.x += -2 ;
		}
	}
}

function SleeveDirectionDecode(model,direction,type,frustum) {
	if(direction == 'West'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(90);
		model.position.z += -handdepth ;
		if(type == 'Right'){
			model.position.y += -2 ;
		}else if(type == 'Left'){
			model.position.y += 2 ;
		}
		model.position.x += -11.5;
	}else if(direction == 'East'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(270);
		model.position.z += -handdepth ;
		
		if(type == 'Right'){
			model.position.y += 2 ;
		}else if(type == 'Left'){
			model.position.y += -2 ;
		}
		model.position.x += 11.5;
	}else if(direction == 'North'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(0);
		model.position.z += -handdepth ;
		if(type == 'Right'){
			model.position.x += -2 ;
		}else if(type == 'Left'){
			model.position.x += 2 ;
		}
		model.position.y += 9.5 ;
	}else if(direction == 'South'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(180);
		model.position.z += -handdepth ;
		if(type == 'Right'){
			model.position.x += 2 ;
		}else if(type == 'Left'){
			model.position.x += -2 ;
		}
		model.position.y += -9.5 ;
	}
}

function headDirectionDecode(model,direction,frustum) {
	if(direction == 'West'){
		model.position.z += -4 ;
		model.position.x += -11.5;
		model.rotation.x += (Math.PI/16)*(133);
		model.rotation.y += (Math.PI/16)*(263);
		model.rotation.z += (Math.PI/16)*(192);
		model.getObjectByName(neckName).rotation.x += (Math.PI/64)*(-6);
		model.getObjectByName(neckName).rotation.y += (Math.PI/64)*(-5);
		model.getObjectByName(neckName).rotation.z += (Math.PI/64)*(23);
	}else if(direction == 'East'){
		model.position.x += -190;
		model.position.y += (1/10)*(25);
		model.position.z += (1/10)*(-50);
		model.rotation.x += (Math.PI/16)*(-233);
		model.rotation.y += (Math.PI/16)*(-363);
		model.rotation.z += (Math.PI/16)*(-292);
		model.getObjectByName(neckName).rotation.x += (Math.PI/64)*(6);
		model.getObjectByName(neckName).rotation.y += (Math.PI/64)*(5);
		model.getObjectByName(neckName).rotation.z += (Math.PI/64)*(-23);
		//model.position.x += (1/10)*(111);
	}else if(direction == 'North'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(0);
		model.position.z += -4 ;
		model.position.y += 9.5 ;
	}else if(direction == 'South'){
		model.rotation.x += THREE.Math.degToRad(90);
		model.rotation.y += THREE.Math.degToRad(180);
		model.position.z += -4 ;
		model.position.y += -9.5 ;
	}
}

function deltaDirection(model,direction,value){
	if(direction == 'West'){
		model.position.x -= value ;
	}else if(direction == 'East'){
		//model.position.x += value ;
	}else if(direction == 'North'){
		model.position.y += value ;
	}else if(direction == 'South'){
		model.position.y -= value ;
	}
}

function offScreenDirection(model,direction,frustum){
	if(direction == 'West'){
		offScreenWest(model,frustum);
	}else if(direction == 'East'){
		offScreenEast(model,frustum);
	}else if(direction == 'North'){
		offScreenNorth(model,frustum);
	}else if(direction == 'South'){
		offScreenSouth(model,frustum);
	}
}

let testDelta = 5;

function offScreenEast(model,frustum){
	var box = new THREE.Box3().setFromObject(model);
	var line = new THREE.Line3(new THREE.Vector3(0,0,box.min.z), new THREE.Vector3(1000,0,box.min.z));
	var intersect = findIntersect(line,box,frustum);
	if(intersect != undefined){
		model.position.x += intersect.x - testDelta + (box.max.z-box.min.z);
	}else{
		console.log('problem');
	}
}

function offScreenWest(model,frustum){
	var box = new THREE.Box3().setFromObject(model);
	var line = new THREE.Line3(new THREE.Vector3(0,0,box.min.z), new THREE.Vector3(-1000,0,box.min.z));
	var intersect = findIntersect(line,box,frustum);
	if(intersect != undefined){
		model.position.x += intersect.x + testDelta - (box.max.z-box.min.z);
	}else{
		console.log('problem');
	}
}

function offScreenNorth(model,frustum){
	var box = new THREE.Box3().setFromObject(model);
	var line = new THREE.Line3(new THREE.Vector3(0,0,box.min.z), new THREE.Vector3(0,1000,box.min.z));
	var intersect = findIntersect(line,box,frustum);
	model.position.y += intersect.y - testDelta + (box.max.z-box.min.z);
}

function offScreenSouth(model,frustum){
	var box = new THREE.Box3().setFromObject(model);
	var line = new THREE.Line3(new THREE.Vector3(0,0,box.min.z), new THREE.Vector3(0,-1000,box.min.z));
	var intersect = findIntersect(line,box,frustum);
	model.position.y += intersect.y + testDelta - (box.max.z-box.min.z);
}

function findIntersect(line,box,frustum){
	let list = [];
	for(let i = 0; i < frustum.planes.length;i++){
		let intersect = frustum.planes[i].intersectLine(line,new THREE.Vector3(0,0,box.min.z));
		if(intersect != null){
			list.push(intersect);
		}
	}
	return list[0];
}

function saveModelInfo(model){
	model.savedScaleX = model.scale.x;
	model.savedScaleY = model.scale.y;
	model.savedScaleZ = model.scale.y;
	model.savedPositionX = model.position.x;
	model.savedPositionY = model.position.y;
	model.savedPositionZ = model.position.z;
	model.savedRotationX = model.rotation.x;
	model.savedRotationY = model.rotation.y;
	model.savedRotationZ = model.rotation.z;
	model.savedNeckRotationX = model.getObjectByName(neckName).rotation.x;
	model.savedNeckRotationY = model.getObjectByName(neckName).rotation.y;
	model.savedNeckRotationZ = model.getObjectByName(neckName).rotation.z;
}

export class Wizard {
  		constructor(name,direction,frustum,gltfLoader,physicsWorld,overlayScene) {
    			this.name = name;
			this.direction = direction;
			this.handList = [];
			this.sleeveList = []

			let sleeveUrl;
			if(direction == 'West'){
				sleeveUrl = sleeveUrlCubes;
			}else if(direction == 'East'){
				sleeveUrl = sleeveUrlStars;
			}else if(direction == 'North'){
				sleeveUrl = sleeveUrlLeaves;
			}else if(direction == 'South'){
				sleeveUrl = sleeveUrlLetters;
			}

			let headUrl;
			if(direction == 'West'){
				headUrl = headUrlCubes;
			}else if(direction == 'East'){
				headUrl = headUrlStars;
			}else if(direction == 'North'){
				headUrl = headUrlLeaves;
			}else if(direction == 'South'){
				headUrl = headUrlLetters;
			}


			//load right hand
  			this.rhand;
			globalThis.loadingMaxFrame++;
			gltfLoader.load(handUrl, (gltf) => {
				this.rhand = gltf.scene;
				this.rhand.handType = "Right";
				HandDirectionDecode(this.rhand,this.direction,'Right',frustum);
				offScreenDirection(this.rhand,this.direction,frustum);
				overlayScene.add(this.rhand);
				this.handList[0] = this.rhand;
				globalThis.loadingFrame++;
			});
			//load right sleeve
			this.rsleeve;
			globalThis.loadingMaxFrame++;
  			gltfLoader.load(sleeveUrl, (gltf) => {
				this.rsleeve = gltf.scene;
				this.rsleeve.handType = "Right";
				SleeveDirectionDecode(this.rsleeve,this.direction,'Right',frustum);
				offScreenDirection(this.rsleeve,this.direction,frustum);
				overlayScene.add(this.rsleeve);
				this.sleeveList[0] = this.rsleeve;
				globalThis.loadingFrame++;
			});

			//load left hand
  			this.lhand;
			globalThis.loadingMaxFrame++;
			gltfLoader.load(handUrl, (gltf) => {
				this.lhand = gltf.scene;
				this.lhand.handType = "Left";
				HandDirectionDecode(this.lhand,this.direction,'Left',frustum);
				offScreenDirection(this.lhand,this.direction,frustum);
				this.lhand.scale.x *= -1;
				overlayScene.add(this.lhand);
				this.handList[1] = this.lhand;
				globalThis.loadingFrame++;
			});
			//load left sleeve
			this.lsleeve;
			globalThis.loadingMaxFrame++;
  			gltfLoader.load(sleeveUrl, (gltf) => {
				this.lsleeve = gltf.scene;
				this.lsleeve.handType = "Left";
				SleeveDirectionDecode(this.lsleeve,this.direction,'Left',frustum);
				offScreenDirection(this.lsleeve,this.direction,frustum);
				this.lsleeve.scale.x *= -1;
				overlayScene.add(this.lsleeve);
				this.sleeveList[1] = this.lsleeve;
				globalThis.loadingFrame++;
			});

			//load head
			this.head;
			globalThis.loadingMaxFrame++;
  			gltfLoader.load(headUrl, (gltf) => {
				this.head = gltf.scene;
				headDirectionDecode(this.head,this.direction,frustum);
				offScreenDirection(this.head,this.direction,frustum);
				saveModelInfo(this.head);
				overlayScene.add(this.head);
				globalThis.loadingFrame++;
			});

  		}


	update(){
		if(this.head != undefined){
			if(this.name != "East"){
				let xval = document.getElementById("xpos");
				this.head.position.x = this.head.savedPositionX + (1/10)*xval.value;
				let yval = document.getElementById("ypos");
				this.head.position.y = this.head.savedPositionY + (1/10)*yval.value;
				let zval = document.getElementById("zpos");
				this.head.position.z = this.head.savedPositionZ + (1/10)*zval.value;

				let xrot = document.getElementById("xrot");
				this.head.rotation.x = this.head.savedRotationX + (Math.PI/16)*xrot.value;
				let yrot = document.getElementById("yrot");
				this.head.rotation.y = this.head.savedRotationY + (Math.PI/16)*yrot.value;
				let zrot = document.getElementById("zrot");
				this.head.rotation.z = this.head.savedRotationZ + (Math.PI/16)*zrot.value;

				let xneck = document.getElementById("xneck");
				this.head.getObjectByName(neckName).rotation.x = this.head.savedNeckRotationX + (Math.PI/64)*xneck.value;
				let yneck = document.getElementById("yneck");
				this.head.getObjectByName(neckName).rotation.y = this.head.savedNeckRotationY + (Math.PI/64)*yneck.value;
				let zneck = document.getElementById("zneck");
				this.head.getObjectByName(neckName).rotation.z = this.head.savedNeckRotationZ + (Math.PI/64)*zneck.value;
				/*
				console.log(xval.value,yval.value,zval.value);
				console.log(xrot.value,yrot.value,zrot.value);
				console.log(xneck.value,yneck.value,zneck.value);
				*/
			}


			let partlist = [
					{"part":lidTopRightName,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lidTopRightName2,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lidTopRightName3,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lidTopRightName4,"x":-0.001,"y":-0.001,"z":-0.001},

					{"part":lipsLeftName,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lipsBottomRightName,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lipsBottomName,"x":-0.001,"y":-0.001,"z":-0.001},
					{"part":lipsBottomLeftName,"x":-0.001,"y":-0.001,"z":-0.001}
				];
			/*
			for(let i = 0; i < partlist.length; i++){
				this.head.getObjectByName('rig').getObjectByName(partlist[i].part).position.x += partlist[i].x;
				this.head.getObjectByName('rig').getObjectByName(partlist[i].part).position.y += partlist[i].y;
				this.head.getObjectByName('rig').getObjectByName(partlist[i].part).position.z += partlist[i].z;
			}
			*/
			//this.head.getObjectByName('rig').getObjectByName(lipsTopRightName).position.z += -0.001;

		}
	}

}