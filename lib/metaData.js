class ClientMetaData{
	constructor(){
		this.gameMode = "";
	}
	canMatch(metadata){
		if(this.gameMode == metadata.gameMode){
			return true;
		}
		return false;
	}
}

module.exports = ClientMetaData;