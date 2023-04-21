class MathemagicianQueue{
	constructor(){
		this.List = [];
	}
	addPlayer(client){
		this.List.push(client);
	}
	removePlayer(client){
		for(let i = 0; i < this.List.length;i++){
			if(this.List[i].MathemagicianSessionID == client.MathemagicianSessionID){
				this.List.splice(i,1);
			}
		}
		
	}
	findMatch(metadata){
		for(let i = 0; i < this.List.length;i++){
			if(this.List[i].MathemagicianMetaData.canMatch(metadata)){
				let matchedClient = this.List[i];
				this.List.splice(i,1);
				return matchedClient;
			}
		}
		return null;
	}
}

module.exports = MathemagicianQueue;