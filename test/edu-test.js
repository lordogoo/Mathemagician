/**************************************************************
* edu-test
* Library used to test the functions in edu library.
***************************************************************/

/************************************
* makePlusAndMultiplyFlat
* equation trees generated by the recursion function
* in edu is not in a format that is easy to compare to
* the equation contained in the interface. This function
* fixes that by reformatting brackets tables, plus/minus
* tables and multiply tables.
* 
* equation: is the equation tree that needs reformatting
* 
* returns: array
* returns the modified equation tree
*************************************/
function makePlusAndMultiplyFlat(equation){
	if(!Array.isArray(equation)){
		return equation;
	}
	if(equation[1] == '()'){
		//change brackets so that they surround the inner equation
		return ['(', makePlusAndMultiplyFlat(equation[0]),')']
	}else if((equation[1] == '+')||(equation[1] == '-')){
		//flatten the equation tree so all the additions and subtractions are in the same list
		let flatlist = [makePlusAndMultiplyFlat(equation[0]),equation[1]];
		let eq = equation[2];
		while((Array.isArray(eq))&&((eq[1]=='+')||(eq[1]=='-'))){
			flatlist.push(makePlusAndMultiplyFlat(eq[0]));
			flatlist.push(eq[1]);
			eq = eq[2];
		}
		flatlist.push(makePlusAndMultiplyFlat(eq));
		return flatlist;
	}else if(equation[1] == '*'){
		//flatten the equation tree so all the multiplys are in the same list
		let flatlist = [makePlusAndMultiplyFlat(equation[0]),equation[1]];
		let eq = equation[2];
		while((Array.isArray(eq))&&(eq[1]=='*')){
			flatlist.push(makePlusAndMultiplyFlat(eq[0]));
			flatlist.push(eq[1]);
			eq = eq[2];
		}
		flatlist.push(makePlusAndMultiplyFlat(eq));
		return flatlist;
	}else{
		return [makePlusAndMultiplyFlat(equation[0]),equation[1],makePlusAndMultiplyFlat(equation[2])];
	}	
	return equation;
}

/************************************
* testEquation
* compares a string equation to the 
* equation contained in the current menu.
* 
* menu: the string id name of the menu that contains an equation we are testing
* equation: an equation string
* 
* returns: boolean 
* outputs true if they are equivilent
* outputs false if they are not
*************************************/
function testEquation(menu,equation){

   let start = 0;
   let end = equation.length;
   let eq = makePlusAndMultiplyFlat(recursion(equation,start,end));

   let left = document.querySelector("#"+menu+" #leftdiv");
   let right = document.querySelector("#"+menu+" #rightdiv");

   //todo do recursive equals
   let leftEquality = recursiveEquals(left.childNodes[0],eq[0]);
   let rightEquality = recursiveEquals(right.childNodes[0],eq[2]);

   return leftEquality && rightEquality;
}

function recursiveEquals(equation1,equation2){

	if(equation1.nodeName == "SPAN"){
		return recursiveEqualsSpan(equation1,equation2);
	}else if(equation1.nodeName == "TABLE"){
		return recursiveEqualsTable(equation1,equation2)
	}
	return false;
}

function recursiveEqualsSpan(equation1,equation2){
	if((equation1.innerHTML == '·')&&(equation2 == '*')){
		return true;
	}else if(equation1.innerHTML == equation2){
		return true;
	}
	return false;
}

function recursiveEqualsTable(equation1,equation2){
	let result = true;
	if(!Array.isArray(equation2)){
		return false;
	}

	//if exponent
	if(equation2.length == 3){
		if(equation2[1]=='^'){
			return recursiveEquals(equation1.childNodes[0].childNodes[0].childNodes[0],equation2[0]) && 
			recursiveEquals(equation1.childNodes[0].childNodes[1].childNodes[0].childNodes[0],equation2[2]);
		}
	}

	//if divide
	if(equation2.length == 3){
		if(equation2[1]=='/'){
			return recursiveEquals(equation1.childNodes[0].childNodes[0].childNodes[0],equation2[0]) && 
			recursiveEquals(equation1.childNodes[2].childNodes[0].childNodes[0],equation2[2]);
		}
	}

	//if normal table
	if(equation1.childNodes[0].childNodes.length !== equation2.length){
		return false;
	}
	for(let i = 0; i < equation1.childNodes[0].childNodes.length; i++){
		result = result && recursiveEquals(equation1.childNodes[0].childNodes[i].childNodes[0],equation2[i]);
	}
	return result;
}

/************************************
* displayResult
* Displayes a boolean result in the 
* testing interface.
* 
* menu: the string id name of the menu where to display; 
* result: a boolean result
*
* returns: none
*************************************/
function displayResult(menu,result){
	let resultdisplay = document.querySelectorAll("#"+menu+" #"+menu+"_result");
	if(result){
		resultdisplay[0].innerHTML = "&#x2713;"
		resultdisplay[0].style.color = "green";
	}else{
		resultdisplay[0].innerHTML = "X"
		resultdisplay[0].style.color = "red";
	}
}