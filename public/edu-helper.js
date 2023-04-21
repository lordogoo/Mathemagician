function isIdAgnosticEqual(element1,element2){
	if((element1.nodeType == element2.nodeType)
	&&(element1.nodeName == element2.nodeName)
	&&(element1.innerText == element2.innerText))
	{
		return true;
	}
	return false;
}

function isStructureEqual(element1,element2){
	if((element1.childNodes.length == 0)&&(element2.childNodes.length == 0)){
		return isIdAgnosticEqual(element1,element2);
	}

	if((element1.childNodes.length == element2.childNodes.length)&&(isIdAgnosticEqual(element1,element2))){
		let count = 0;
		for(let i = 0; i < element1.childNodes.length; i++){
			if(isStructureEqual(element1.childNodes[i],element1.childNodes[i])){
				count ++;
			}
		}

		if(count ==  element1.childNodes.length){
			return true;
		}
	}
	return false;
}

function removeUnneededEquationElementsUp(element){
	let testelement = element;
	while(!testelement.classList.contains("eqDisplay")){
		let parent = testelement.parentNode
		if((testelement.classList.contains("gameMultiply"))
		||(testelement.classList.contains("gamePlusMinus"))){
			if(testelement.childNodes[0].childNodes.length == 1){
				for(let i = 0; i < testelement.childNodes[0].childNodes[0].childNodes.length; i++){
					parent.appendChild(testelement.childNodes[0].childNodes[0].childNodes[i]);
					parent.removeChild(testelement);
				}
			}
		}

		testelement = parent;
	}	

}

function removeUnnededEquationElementDown(element){
	let testelement = element;


}

/****************************
* network functions
*****************************/

function postInfo(url,postObj,donefunction){

	let post = JSON.stringify(postObj);
  	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
        	if (this.readyState == 4 && this.status == 200) {
			let responsevalue = JSON.parse (this.responseText);
            		console.log(responsevalue);
			if(typeof donefunction !== "undefined"){
				donefunction(responsevalue);
			}
       		}
    	};
  	xhttp.open('POST', url, true)
	xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
	xhttp.send(post);
}