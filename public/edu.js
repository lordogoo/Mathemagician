/*****************************************
edu

This is the file with the main mathematical functions.

todo: note this file needs a huge refactor
******************************************/
const gameBracketsName = "gameBrackets";
const gamePlusMinusName = "gamePlusMinus";
const gameMultiplyName = "gameMultiply";
const gameDivideName = "gameDivide";
const gameExponentName = "gameExonent";

class MathemagicianEquation{
	constructor(variable,document,menu,test,multiplayer){
		this.variable = variable;
		this.document = document;
		this.menu = menu;
		this.test = test;
		this.isMultiplayer = multiplayer; 
		this.index = 0;
		this.selected = null;
	}
	getIndex(){
		let i = this.index;
		this.index++;
		return i;
	}
}

/*
* generate equation from string
*/
//todo add sqrt,log,ln,cos,sin,tan,arccos,arcsin,arctan
//todo add pi,e

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

const priority = [['='],['+','-'],['*'],['/'],['^']]
function getPriority(letter){
	for(let i = 0; i < priority.length;i++){
		for(let j = 0; j < priority[i].length; j++){
			if(letter == priority[i][j]){
				return i;
			}
		}
	}
	return Infinity;
}

function createGameSpanWithIndex(mequation,i,text){
	let valspan = mequation.document.createElement("span");
	valspan.setAttribute("id","item"+i);
	if(!mequation.test){
		valspan.setAttribute("onclick","select(globalThis."+mequation.variable+",\"item"+i+"\")");
	}
	var valt = mequation.document.createTextNode(text);
	valspan.appendChild(valt);
	return valspan;
}

function createGameSpan(mequation,text){
	return createGameSpanWithIndex(mequation,mequation.getIndex(),text);
}

function createHr(mequation){
	let index = mequation.getIndex();
	let hr = mequation.document.createElement("hr");
	hr.setAttribute("id","item"+index);
	if(!mequation.test){
		hr.setAttribute("onclick","select(globalThis."+mequation.variable+",\"item"+mequation.index+"\")");
	}
	return hr;
}

function createTable(mequation,equation){
	var valtd = mequation.document.createElement("table");
	valtd.appendChild(equation);
	return valtd;
}

function createTr(mequation,equation){
	var valtd = mequation.document.createElement("tr");
	valtd.appendChild(equation);
	return valtd;
}

function createTd(mequation,equation){
	var valtd = mequation.document.createElement("td");
	valtd.style.textAlign = "center";
	valtd.style.margin = "auto";
	valtd.style.borderSpacing = "0 auto";
	valtd.appendChild(equation);
	return valtd;
}

/*
* generate equation from string
*/
function GenerateFromString(variableName,doc,menu,test,multy,equation)
{
   //todo add the ability to invoke a procedural function
   let mequation = new MathemagicianEquation(variableName,doc,menu,test,multy);
   var start = 0;
   var end = equation.length;
   var eq = recursion(mequation,equation,start,end);

   var left = doc.querySelector("#"+menu+" #leftdiv");
   var right = doc.querySelector("#"+menu+" #rightdiv");

   var lefteq = instantiate(mequation,eq[0]);
   left.appendChild(lefteq);
   var righteq = instantiate(mequation,eq[2]);
   right.appendChild(righteq);
   return mequation;
}

function recursion(mequation,string,start,end){
   //todo deal with size differences
   var largestPiorityCharacter = string[start];
   var largestPiorityIndex = start;
   var numBrackets = 0;
   if(string[start] == '('){
	numBrackets++;
   }
   if(start+1 < end){
   	//get the character with the highest priority
	for(var i = start+1; i < end;i++){

		if(string[i] == '('){
			numBrackets ++;
		}else if(string[i] == ')'){
			numBrackets --;
		}

		if(numBrackets == 0){
			//if the new character has a higher priority then use that one
			//exception: skip any leading negative signs
			if((getPriority(largestPiorityCharacter) > getPriority(string[i]))||
			((largestPiorityIndex == start)&&(i != start)&&(string[largestPiorityIndex] == '-'))){
				largestPiorityCharacter = string[i];
				largestPiorityIndex = i;
			}
		}	
   	}


	if(string[start]=='-'){
		if(largestPiorityIndex == start + 1){
			if(isNaN(string[largestPiorityIndex])){
				//need to convert negative variables to -1*variable
				//negative variables are not allowed
				return ['-1','*',string.substring(largestPiorityIndex,end)]
			}else{
				//return negative number
				return string.substring(start,end);
			}
		}
	}

	if(getPriority(largestPiorityCharacter) == Infinity){
		if(string[start] == '('){
			return [recursion(mequation,string,start+1,end-1),'()']
		}else{
			return string.substring(start,end);
		}
	}else{
   		return [recursion(mequation,string,start,largestPiorityIndex),largestPiorityCharacter,recursion(mequation,string,largestPiorityIndex+1,end)];
	}
   }else{
	return largestPiorityCharacter;
   }
}


/*
* generate equation from advanced string
*/

function GenerateFromAdvancedString(variableName,doc,menu,test,multy,equation)
{
   let mequation = new MathemagicianEquation(variableName,doc,menu,test,multy);
   let left = doc.querySelector("#"+menu+" #leftdiv");
   let right = doc.querySelector("#"+menu+" #rightdiv");

   let splitequation = equation.split('=');

   var lefteq = advancedInstantiate(mequation,splitequation[0]);
   left.appendChild(lefteq);
   var righteq = advancedInstantiate(mequation,splitequation[1]);
   right.appendChild(righteq);
   return mequation;
}

function advancedInstantiate(mequation,equation){
	if(equation.substring(1, 2) == "("){
		let indexletter = equation.substring(0, 1);
		if(indexletter == "B"){
			return createBrackets(mequation,advancedInstantiate(mequation,equation.substring(2,equation.length-1)));
		}else if(indexletter == "P"){
			let stringlist = splitOnCommaOutsideBracket(equation.substring(2,equation.length-1));
			let plus = createEmptyPlus(mequation);
			for(let i = 0; i < stringlist.length; i++){
				plus.childNodes[0].appendChild(createTd(mequation,advancedInstantiate(mequation,stringlist[i])));
			}
			return plus;
		}else if(indexletter == "M"){
			let stringlist = splitOnCommaOutsideBracket(equation.substring(2,equation.length-1));
			let mult = createEmptyMult(mequation.document);
			for(let i = 0; i < stringlist.length; i++){
				mult.childNodes[0].appendChild(createTd(mequation,advancedInstantiate(mequation,stringlist[i])));
			}
			return mult;
		}else if(indexletter == "D"){
			let stringlist = splitOnCommaOutsideBracket(equation.substring(2,equation.length-1));
			return createDivideDouble(mequation,advancedInstantiate(mequation,stringlist[0]),advancedInstantiate(mequation,stringlist[1]));
		}else if(indexletter == "E"){
			let stringlist = splitOnCommaOutsideBracket(equation.substring(2,equation.length-1));
			return createExponentDouble(mequation,advancedInstantiate(mequation,stringlist[0]),advancedInstantiate(mequation,stringlist[1]));
		}
	}else{
		if(equation == '*'){
			return createGameSpan(mequation,'·');
		}else{
			return createGameSpan(mequation,equation);
		}
	}
}

/*
Splits a string on its commas ignoring all the commas inside brackets.
*/
function splitOnCommaOutsideBracket(string){
	let stringlist = [];
	let startindex = 0;
	let depth = 0;
	for(let i = 0; i < string.length; i++){
		if(string.substring(i,i+1) == '('){
			depth ++;
		}else if(string.substring(i,i+1) === ')'){
			depth --;
		}
		if((string.substring(i,i+1) === ',')&&(depth == 0)){
			stringlist.push(string.substring(startindex,i));
			startindex = i+1;
		}else if(i == string.length-1){
			stringlist.push(string.substring(startindex,i+1));
		}	
	}
	return stringlist;
}

/*
* generate string from equation
*/
function equationToString(leftdiv,rightdiv){
	return recursiveToString(leftdiv)+'='+recursiveToString(rightdiv);
}

function recursiveToString(equation){
	if(equation.nodeName == "SPAN"){
		return recursiveToStringSpan(equation);
	}else if(equation.nodeName == "TABLE"){
		return recursiveToStringTable(equation)
	}
	return false;
}

function recursiveToStringSpan(equation){
	if((equation.innerHTML == '·')){
		return '*';
	}else{
		return equation.innerHTML;
	}
}

function recursiveToStringTable(equation){
	let stringvalue;
	if(equation.classList.contains(gameBracketsName)){
		stringvalue = "B(";
		stringvalue+= recursiveToString(equation.childNodes[0].childNodes[1].childNodes[0]);
	}else if(equation.classList.contains(gamePlusMinusName)){
		stringvalue = "P(";
		for(let i = 0; i < equation.childNodes[0].childNodes.length;i++){
			stringvalue += recursiveToString(equation.childNodes[0].childNodes[i].childNodes[0]);
			if(i !== equation.childNodes[0].childNodes.length-1){
				stringvalue+=",";
			}
		}
	}else if(equation.classList.contains(gameMultiplyName)){
		stringvalue = "M("
		for(let i = 0; i < equation.childNodes[0].childNodes.length;i++){
			stringvalue += recursiveToString(equation.childNodes[0].childNodes[i].childNodes[0]);
			if(i !== equation.childNodes[0].childNodes.length-1){
				stringvalue+=",";
			}
		}
	}else if(equation.classList.contains(gameDivideName)){
		stringvalue = "D("
		stringvalue += recursiveToString(equation.childNodes[0].childNodes[0].childNodes[0]);
		stringvalue+=",";
		stringvalue += recursiveToString(equation.childNodes[2].childNodes[0].childNodes[0]);
	}else if(equation.classList.contains(gameExponentName)){
		stringvalue = "E("
		stringvalue += recursiveToString(equation.childNodes[0].childNodes[0].childNodes[0]);
		stringvalue+=",";
		stringvalue += recursiveToString(equation.childNodes[0].childNodes[2].childNodes[0]);
	}
	stringvalue+=")"
	return stringvalue;
}

/*
* generate procedural algorithm
*/
function instantiate(mequation,equation){
	if(!Array.isArray(equation)){
		return createGameSpan(mequation,equation);
	}

	//todo think about replacing instanciate functions with create functions
	if(equation[1] == '()'){
		return createBrackets(mequation,instantiate(mequation,equation[0]));
	}else if((equation[1] == '+')||(equation[1] == '-')){
		return instantiatePlusMinus(mequation,equation[1],equation);
	}else if(equation[1] == '*'){
		return instantiateMultiply(mequation,equation);
	}else if(equation[1] == '/'){
		return createDivideDouble(mequation,instantiate(mequation,equation[0]),instantiate(mequation,equation[2]));
	}else if(equation[1] == '^'){
		return createExponent(mequation,instantiate(mequation,equation[2]),instantiate(mequation,equation[0]));
	}
}

function createEmptyBrackets(mequation){
	var valTable = mequation.document.createElement("table");
	valTable.style.margin = "auto";
	valTable.classList.add("gameBrackets");
	var valtr = mequation.document.createElement("tr");
	valTable.appendChild(valtr);
	return valTable;
}

function createBrackets(mequation,equation){
	var currentIndex = mequation.getIndex();
	var valTable = createEmptyBrackets(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpanWithIndex(mequation,currentIndex,'(')));
	valTable.childNodes[0].appendChild(createTd(mequation,equation));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpanWithIndex(mequation,currentIndex,')')));	
	return valTable;
}

function createEmptyPlus(mequation){
	var valTable = mequation.document.createElement("table");
	valTable.classList.add(gamePlusMinusName);
	var valtr = mequation.document.createElement("tr");
	valTable.appendChild(valtr);
	return valTable;
}

function instantiatePlusMinus(mequation,symbol,equation){
	var valTable = createEmptyPlus(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,equation[0])));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,symbol)));
	if((Array.isArray(equation[2]))&&((equation[2][1] == '+')||(equation[2][1] == '-'))){
		let currentEquationPart = equation[2];
		while((Array.isArray(currentEquationPart))&&((currentEquationPart[1] == '+')||(currentEquationPart[1] == '-'))){
			valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,currentEquationPart[0])));
			valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,currentEquationPart[1])));
			currentEquationPart = currentEquationPart[2];
		}
		valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,currentEquationPart)));
	}else{
		valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,equation[2])));
	}
	return valTable;
}

function createPlusDouble(mequation,equation1,equation2){
	var valTable = createEmptyPlus(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,equation1));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"+")));
	valTable.childNodes[0].appendChild(createTd(mequation,equation2));
	return valTable;
}

function createPlus(mequation,value,equation){
	var valTable = createEmptyPlus(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,equation));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"+")));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,value)));
	return valTable;
}

function createSubtraction(mequation,value,equation){
	var valTable = createEmptyPlus(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,equation));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"-")));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,value)));
	return valTable;
}

function createSubtractionDouble(mequation,equation1,equation2){
	var valTable = createEmptyPlus(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,equation1));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"-")));
	valTable.childNodes[0].appendChild(createTd(mequation,equation2));
	return valTable;
}

function createEmptyMult(mequation){
	var valTable = mequation.document.createElement("table");
	valTable.classList.add(gameMultiplyName);
	var valtr = mequation.document.createElement("tr");
	valTable.appendChild(valtr);
	return valTable;
}

function instantiateMultiply(mequation,equation){
	var valTable = createEmptyMult(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,equation[0])));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"\u00B7")));
	if((Array.isArray(equation[2]))&&(equation[2][1] == '*')){
		let currentEquationPart = equation[2];
		while((Array.isArray(currentEquationPart))&&(currentEquationPart[1] == '*')){
			valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,currentEquationPart[0])));
			valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"\u00B7")));
			currentEquationPart = currentEquationPart[2];
		}
		valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,currentEquationPart)));
	}else{
		valTable.childNodes[0].appendChild(createTd(mequation,instantiate(mequation,equation[2])));
	}
	return valTable;
}

function createMultiplyDouble(mequation,equation1,equation2){
	let valTable = createEmptyMult(mequation);
	valTable.childNodes[0].appendChild(createTd(mequation,equation1));
	valTable.childNodes[0].appendChild(createTd(mequation,createGameSpan(mequation,"\u00B7")));
	valTable.childNodes[0].appendChild(createTd(mequation,equation2));
	return valTable;
}

function createMultiply(mequation,value,equation){
	return createMultiplyDouble(mequation,createGameSpan(mequation,value),equation);
}

function createDivideDouble(mequation,equation1,equation2){
	var valTable = mequation.document.createElement("table");
	valTable.classList.add("gameDivide");

	valTable.appendChild(createTr(mequation,createTd(mequation,equation1)));
	valTable.appendChild(createTr(mequation,createTd(mequation,createHr(mequation))));
	valTable.appendChild(createTr(mequation,createTd(mequation,equation2)));

	return valTable;
}

function createDivide(mequation,value,equation){
	return createDivideDouble(mequation,equation,createGameSpan(mequation,value));
}

function createExponent(mequation,value,equation){
	var valTable = mequation.document.createElement("table");
	valTable.classList.add("gameExonent");
	var valtr1 = mequation.document.createElement("tr");

	var valtd1 = mequation.document.createElement("td");
	valtd1.setAttribute("rowspan","2");
	var valt1 = equation;
	valtd1.appendChild(valt1);
	valtr1.appendChild(valtd1);

	var valtd12 = mequation.document.createElement("td");
	valtd12.setAttribute("style","display: inline-flex;horizontal-align:left;vertical-align:top;");
	var valspan12 = mequation.document.createElement("span");
	valspan12.setAttribute("style","display: inline-block;font-size: 50%;");
	var valt12 = value;
	valspan12.appendChild(valt12);
	valtd12.appendChild(valspan12);
	valtr1.appendChild(valtd12);
	valTable.appendChild(valtr1);
	
	valTable.appendChild(createTr(mequation,createTd(mequation,mequation.document.createTextNode(" "))));

	return valTable;
}

function createExponentDouble(mequation,equation1,equation2){
	var valTable = mequation.document.createElement("table");
	valTable.classList.add("gameExonent");
	var valtr1 = mequation.document.createElement("tr");

	var valtd1 = mequation.document.createElement("td");
	valtd1.setAttribute("rowspan","2");
	var valt1 = equation1;
	valtd1.appendChild(valt1);
	valtr1.appendChild(valtd1);

	var valtd12 = mequation.document.createElement("td");
	valtd12.setAttribute("style","display: inline-flex;horizontal-align:left;vertical-align:top;");
	var valspan12 = mequation.document.createElement("span");
	valspan12.setAttribute("style","display: inline-block;font-size: 50%;");
	valspan12.appendChild(equation2);
	valtd12.appendChild(valspan12);
	valtr1.appendChild(valtd12);
	valTable.appendChild(valtr1);
	
	valTable.appendChild(createTr(mequation,createTd(mequation,document.createTextNode(" "))));

	return valTable;
}

/*
*helper functions
*/

function hasClass(yourObj, yourClass) {
    if(!yourObj || typeof yourClass !== 'string') {
        return false;
    } else if(yourObj.className && yourObj.className.trim().split(/\s+/gi).indexOf(yourClass) > -1) {
        return true;
    } else {
        return false;
    }
}

function prependChild(element,child){
    var first = element.firstChild;
    element.insertBefore(child,first);
}


function clearselection(item){
	for(var i = 0; i < item.length;i++){
		item[i].style.color = "#000000";
		item[i].style.webkitTextStroke = null;
		if(item[i].tagName.toLowerCase() == 'hr'){
			item[i].style.backgroundColor = "#333";
		}
		if(item[i].tagName.toLowerCase() == 'span'){
			if(item[i].data == '·'){
				item[i].style.webkitTextStroke = "2px black";
			}
		}		
	}
}

function select(mequation,item){
	if(mequation.selected != null){
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		for(var i = 0; i < selectedele.length;i++){
			selectedele[i].style.color = "#000000";
			selectedele[i].style.webkitTextStroke = null;
			if(selectedele[i].tagName.toLowerCase() == 'hr'){
				selectedele[i].style.backgroundColor = "#333";
			}
			if(selectedele[i].tagName.toLowerCase() == 'span'){
				if(selectedele[i].data == '·'){
					selectedele[i].style.webkitTextStroke = "2px black";
				}
			}	
		}
	}
	var ele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+item);
	if(mequation.isMultiplayer){
		sendSelect(item,mequation.test);
	}
	for(var i = 0; i < ele.length;i++){
		ele[i].style.color = "#ff0000";
		ele[i].style.webkitTextStroke = "2px red";
		if(ele[i].tagName.toLowerCase() == 'hr'){
			ele[i].style.backgroundColor = "#f00";
		}
	}
	mequation.selected = item;
	if(!mequation.test){
		checkrules(mequation);
	}
}

function checkrules(mequation){
	if(mequation.selected != null){
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);

		const rules = Object.getOwnPropertyNames(MathemagicianRuleList).filter(prop => typeof MathemagicianRuleList[prop] === "function");
		for(let i = 0; i < rules.length; i++){
			MathemagicianRuleList[rules[i]](mequation,selectedele);
		}
	}
}

function disablerules(mequation){
	let rulebuttonlist = mequation.document.querySelectorAll("#"+mequation.menu+" .rulebutton");
	for(let i = 0; i < rulebuttonlist.length; i++){
		rulebuttonlist[i].disabled = true;
	}
}

function numberValueChanged(mequation){
	var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
    	var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");

	let adderbutton = mequation.document.querySelectorAll("#"+mequation.menu+" #gameCreateAdder");
	let subtractorbutton = mequation.document.querySelectorAll("#"+mequation.menu+" #gameCreateSubtractor");
	let multiplierbutton = mequation.document.querySelectorAll("#"+mequation.menu+" #gameCreateMultiplier");
	let divisorbutton = mequation.document.querySelectorAll("#"+mequation.menu+" #gameCreateDivisor");
	let exponentbutton = mequation.document.querySelectorAll("#"+mequation.menu+" #gameCreateExponent");
    	if(isNumber(nc.value) == 0){
    		multiplierbutton.forEach(function(elem, idx) {elem.disabled = true});
		divisorbutton.forEach(function(elem, idx) {elem.disabled = true});
    	}else{
	    	multiplierbutton.forEach(function(elem, idx) {elem.disabled = false});
		divisorbutton.forEach(function(elem, idx) {elem.disabled = false});
	}

	if((isNumber(nc.value)==0)||(vc.checked == true)){
		exponentbutton.forEach(function(elem, idx) {elem.disabled = true});
	}else{
		exponentbutton.forEach(function(elem, idx) {elem.disabled = false});
	}
}

function ruleEnableDisableButton(mequation,rulename,buttonname,value){
		mequation.document.querySelectorAll("#"+mequation.menu+" #"+buttonname).forEach(function(elem, idx) {elem.disabled = value});
		mequation[rulename] = !value;
}

/************************
 *rules
 *************************/
class MathemagicianRuleList{
	//todo
	static ruleSplitNumber(mequation,selectedele){
		mequation.document.querySelectorAll("#"+mequation.menu+" #addSplit").forEach(function(elem, idx) {elem.disabled = true});
		mequation.document.querySelectorAll("#"+mequation.menu+" #multSplit").forEach(function(elem, idx) {elem.disabled = true});
		mequation.document.querySelectorAll("#"+mequation.menu+" #expSplit").forEach(function(elem, idx) {elem.disabled = true});
		if(isNaN(selectedele[0].innerHTML)){
			return;
		}
		mequation.document.querySelectorAll("#"+mequation.menu+" #addSplit").forEach(function(elem, idx) {elem.disabled = false});
		mequation.document.querySelectorAll("#"+mequation.menu+" #multSplit").forEach(function(elem, idx) {elem.disabled = false});
		mequation.document.querySelectorAll("#"+mequation.menu+" #expSplit").forEach(function(elem, idx) {elem.disabled = false});
	}

	//done
	static ruleRemoveBrackets(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleRemoveBrackets","removeBrackets",true)
		if(selectedele[0].innerHTML !== '(' && selectedele[0].innerHTML !== ')' ){
			return;
		}
		if(selectedele[0].parentNode.parentNode.parentNode.parentNode.previousSibling != null){
			if(selectedele[0].parentNode.parentNode.parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].data === '-'){
				return;
			}
		}

		if((!selectedele[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains(gameMultiplyName))
		||(!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gamePlusMinusName)))
		{
			ruleEnableDisableButton(mequation,"ruleRemoveBrackets","removeBrackets",false)
		}  		
	}

	//done
	static ruleCommunitive(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleCommunitive","commutativeRule",true)
		if((selectedele[0].innerHTML === '-') && (selectedele[0].parentNode.previousSibling.previousSibling != null)){
			ruleEnableDisableButton(mequation,"ruleCommunitive","commutativeRule",false)
		}else if(selectedele[0].innerHTML === '+' || selectedele[0].innerHTML === '·' || selectedele[0].innerHTML === '\u00B7'){
			ruleEnableDisableButton(mequation,"ruleCommunitive","commutativeRule",false)
		}
	}

	static ruleDistributive(mequation,selectedele){
		//need to fix
		ruleEnableDisableButton(mequation,"ruleDistributive","distributiveRule",true)
		if(selectedele[0].innerHTML === '·'){
			if(selectedele[0].parentNode.nextSibling == undefined){
				return;
			}else if(selectedele[0].parentNode.previousSibling == undefined){
				return;
			}
		
			if(!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].innerHTML)){
				if(selectedele[0].parentNode.previousSibling.childNodes[0].innerHTML == ')'){
					var currentnodelist = selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].childNodes;
					for(var i = 0; i < currentnodelist.length;i++){
						if(currentnodelist[i].childNodes[0].innerHTML === '+' 
						|| currentnodelist[i].childNodes[0].innerHTML === '-'){
							ruleEnableDisableButton(mequation,"ruleDistributive","distributiveRule",false)
							return;
						}
					}
				}
			}else if(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].innerHTML)){
				if(selectedele[0].parentNode.nextSibling.childNodes[0].innerHTML == '('){
					var currentnodelist = selectedele[0].parentNode.nextSibling.nextSibling.childNodes[0].childNodes[0].childNodes;
					for(var i = 0; i < currentnodelist.length;i++){
						if(currentnodelist[i].childNodes[0].innerHTML === '+' 
						|| currentnodelist[i].childNodes[0].innerHTML === '-'){
							ruleEnableDisableButton(mequation,"ruleDistributive","distributiveRule",false)
							return;
						}
					}
				}
			}
		}
	}

	//todo
	static ruleAddFractions(mequation,selectedele){
	}

	//done
	static ruleDoubleNegative(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleDoubleNegative","doubleNegative",true)
		mequation["ruleDoubleNegative"] = true;
		if(selectedele[0].innerHTML === '+' || selectedele[0].innerHTML === '-' ){
			ruleEnableDisableButton(mequation,"ruleDoubleNegative","doubleNegative",false)
		}	
	}

	//done
	static ruleSTMNegative(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleSTMNegative","MultNegative",true)
		mequation["ruleSTMNegative"] = true;
		if(selectedele[0].innerHTML === '-' ){
			ruleEnableDisableButton(mequation,"ruleSTMNegative","MultNegative",false)
		}	
	}

	//done
	static ruleMultiply(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleMultiply","multiply",true)
		if((selectedele[0].innerHTML !== '·')&&(selectedele[0].innerHTML !== '\u00B7')){
			return;
		}

		if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined)){
			if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '1'){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '1'){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
				ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(!selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent"))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}else if((!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent"))){	
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent")){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleMultiply","multiply",false)
				}
			}		
		}	
	}

	static ruleDivide(mequation,selectedele){
		//broken
		ruleEnableDisableButton(mequation,"ruleDivide","divide",true)
		if(selectedele[0].tagName !== 'HR'){
			return;
		}
		console.log(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].innerHTML);
		if(isNaN(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].innerHTML)){
			console.log("test 1");	
			return;
		}
		if(isNaN(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].innerHTML)){
			console.log("test 2");
			return;
		}
		ruleEnableDisableButton(mequation,"ruleDivide","divide",false)
	}	

	static ruleAdd(mequation,selectedele){
		//todo
		//look at tripple add situation
		ruleEnableDisableButton(mequation,"ruleAdd","add",true)
		if(selectedele[0].innerHTML !== '+'){
			return;
		}
		if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined)){
			if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleAdd","add",false)
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleAdd","add",false)
			}else if((isNumber(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNumber(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
				ruleEnableDisableButton(mequation,"ruleAdd","add",false)
			}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleAdd","add",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleAdd","add",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild,
				selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild)){
					ruleEnableDisableButton(mequation,"ruleAdd","add",false)
				}
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
				if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0],
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleAdd","add",false)
				}
			}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName)){
				if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0],
				selectedele[0].parentNode.nextSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleAdd","add",false)
				}
			}
		}
	}

	static ruleSubtract(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleSubtract","subtract",true)
		if(selectedele[0].innerHTML !== '-'){
			return;

		}
		if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined)){
			if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
				ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
			}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
				ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
			}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
				}
			}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
				if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild,
				selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild)){
					ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
				}
			}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
				if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0],
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
				}
			}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName)){
				if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0],
				selectedele[0].parentNode.nextSibling.childNodes[0])){
					ruleEnableDisableButton(mequation,"ruleSubtract","subtract",false)
				}
			}
		}
	}

	static ruleZero(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleZero","removezero",true)
		mequation["ruleTrivial"] = true;
		if((selectedele[0].innerHTML !== '-')&&(selectedele[0].innerHTML !== '+')){
			return;
		}
		if(selectedele[0].parentNode.nextSibling.childNodes[1] != undefined){
			if(selectedele[0].parentNode.nextSibling.childNodes[1].childNodes[0].data == 0){
				ruleEnableDisableButton(mequation,"ruleZero","removezero",false)
			}
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0] != undefined){
			if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 0){
				ruleEnableDisableButton(mequation,"ruleZero","removezero",false)
			}
		}
	}

	static ruleChange(mequation,selectedele){
		ruleEnableDisableButton(mequation,"ruleChange","changeValue",true)
		mequation["ruleTrivial"] = true;
		if(!isNaN(selectedele[0].innerHTML)){
			ruleEnableDisableButton(mequation,"ruleChange","changeValue",false)
		}
	}

	static ruleTrivial(mequation,selectedele){
		mequation["ruleTrivial"] = false;
	}

	static getRuleMapping(perform){
		console.log(perform);
		let mapping = {	"createNumeratorBoth":"ruleTrivial",
				"createDenominatorBoth":"ruleTrivial",
				"createAdderBoth":"ruleTrivial",
				"createSubtractorBoth":"ruleTrivial",
				"createSubtractorBoth":"ruleTrivial",
				"createExponentBoth":"ruleTrivial",
				//ruleSplitNumber
				"preformRemoveBrackets":"ruleRemoveBrackets",
				"preformCommutativeRule":"ruleCommunitive",
				"preformDistributiveRule":"ruleDistributive",
				//ruleAddFractions
				"preformDoubleNegative":"ruleDoubleNegative",
				"performMultiNegative":"ruleSTMNegative",
				"preformMultiply":"ruleMultiply",
				"preformDivide":"ruleDivide",
				"preformAdd":"ruleAdd",
				"preformSubtract":"ruleSubtract",
				"preformRemoveZero":"ruleZero"}
		
		return mapping[perform];
	}
}

/************************
 *actions
 *************************/
function changeAllBrackets(parentname){
	console.log(parentname);
	var parentNode = document.getElementById(parentname);
	for(var i=0; i < index; i++) {
		var bracket = document.querySelectorAll("#bracket"+i);
		for(var j=0; j < bracket.length;j++){
			if(bracket[j] != null){
				if(isDescendant(parentNode,bracket[j])){
					var value = bracket[j].style.transform.match(new RegExp(",(.*)\\)"));
					value = isNumber(value[1]) - 3;
					bracket[j].style.transform = "scale(1,"+value+")";
				}
			}
		}
	}
}

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
	 console.log(node);
	 console.log(node.id+" "+parent.id);
	 console.log(node.id === parent.id);
         if (node.id === parent.id) {
             return true;
         }
         node = node.parentNode;
	console.log(node);
     }
     return false;
}


/****************************************************
* applyFunctionInCreate
* this function creates new structures on one side of an
* equation on screen.
* 
* mequation: equation object -> the equation struct with all the equation metadata
* side: dom element -> which side of the equation being acted on.
* nc: number input dom element -> input that contains the number to add.
* vc: checkbox input dom element -> input that indicates we should add a variable.
* func: function -> the create function for the new element.
* reverse: boolean -> true if we want to add new element before and false if after
*****************************************************/
function applyFunctionInCreate(mequation,side,nc,vc,func,reverse){
   	var child = side.childNodes[0];
   	clearChildren(side);
	let newvalue;
	if(vc.checked == true){
		newvalue = createMultiply(mequation,nc.value,createGameSpan(mequation,'x'));
   	}else{
   		newvalue = createGameSpan(mequation,nc.value);
   	}
	if(!reverse){
	   	side.appendChild(func(mequation,newvalue,createBrackets(mequation,child)));
	}else{
		side.appendChild(func(mequation,createBrackets(mequation,child),newvalue));
	}
}

/****************************************************
* getInBracketList
todo: 
*****************************************************/
function getInBracketList(selectedele,reverse){
	let direction;
	if(reverse){
		direction = "nextSibling";
	}else{
		direction = "previousSibling";
	}	

	let list = []
	for(let i = 0; i < selectedele[0].parentNode[direction].childNodes[0].childNodes[0].childNodes.length - 2; i++){
		list.push(selectedele[0].parentNode[direction].childNodes[0].childNodes[0].childNodes[i]);
	}
	let table;
	if(list.length > 1){
		table = mequation.document.createElement("table");
		table.classList.add(gameMultiplyName);
		let tr = mequation.document.createElement("tr");
		table.appendChild(tr);
		for(let i = 0; i < list.length;i++){
			tr.appendChild(list[i]);
		}
	}else{
		table = list[0].childNodes[0];
	}
	return table;
}

/****************************************************
* insertNewMultipliedElement
todo: 
*****************************************************/
function insertNewMultipliedElement(mequation,selectedele,leftTable,rightTable,focus,reverse){
	let positiveEQ;	
	let negativeEQ;
	if(reverse){
		positiveEQ = createPlusDouble;	
		negativeEQ = createSubtractionDouble;
	}else{
		positiveEQ = createSubtractionDouble;	
		negativeEQ = createPlusDouble;
	}

	let mult;
	if((selectedele[0].parentNode.previousSibling.previousSibling != null)
	&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
		selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
		mult = createTd(mequation,createMultiplyDouble(mequation,createBrackets(mequation,positiveEQ(mequation,rightTable,leftTable)),focus));
	}else{
		mult = createTd(mequation,createMultiplyDouble(mequation,createBrackets(mequation,negativeEQ(mequation,leftTable,rightTable)),focus));
	}
	selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
	selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
	selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
	selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
}

/************************************************
*************************************************
**MathemagicianPerformList
**
**This class contains all the perform operation functions.
**The point of this is to have an easy container for these 
**functions that can be referenced both by the client and server.
**
**
*************************************************
*************************************************/
class MathemagicianPerformList{

	static createNumeratorBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createNumeratorBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createMultiplyDouble,false);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createMultiplyDouble,false);
	}

	static createDenominatorBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createDenominatorBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createDivideDouble,true);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createDivideDouble,true);
	}

	static createReciprocalBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createDenominatorBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createDivideDouble,false);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createDivideDouble,false);
	}

	static createAdderBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
    		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createAdderBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createPlusDouble,true);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createPlusDouble,true);
	}

	static createSubtractorLeftBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
    		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createSubtractorBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createSubtractionDouble,false);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createSubtractionDouble,false);
	}

	static createSubtractorRightBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
    		var vc = mequation.document.querySelector("#"+mequation.menu+" #variableCreatorButton");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createSubtractorBoth",nc.value,vc.value,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
		applyFunctionInCreate(mequation,left,nc,vc,createSubtractionDouble,true);
   		var right = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
		applyFunctionInCreate(mequation,right,nc,vc,createSubtractionDouble,true);
	}

	static createExponentBoth(mequation){
    		var nc = mequation.document.querySelector("#"+mequation.menu+" #numberCreatorText");
    		if(isNumber(nc.value) == 0){
    			nc.value = 1;
    		}
		if(mequation.isMultiplayer){
			sendCommandWithNumber("createExponentBoth",nc.value,false,mequation.test);
		}
   		var left = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
   		var leftchild = left.childNodes[0];
   		clearChildren(left);
  		left.appendChild(createExponent(mequation,createGameSpan(mequation,nc.value),createBrackets(mequation,leftchild)));
   		var right = document.querySelector("#"+mequation.menu+" #rightdiv");
   		var rightchild = right.childNodes[0];
   		clearChildren(right);
   		right.appendChild(createExponent(mequation,createGameSpan(mequation,nc.value),createBrackets(mequation,rightchild)));
	}

	//done
	static performChange(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}

		let num = mequation.document.querySelector("#"+mequation.menu+" #NumberChangeInput");
		let selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		selectedele[0].innerHTML = num.value;

		clearselection(selectedele);
		mequation.selected = undefined;
		/*
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
		*/
	}

	//done
	static preformCommutativeRule(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformCommutativeRule",mequation.test);
		}
		if(selectedele[0].innerHTML === '+' || selectedele[0].innerHTML === '-'){
			let farleft = selectedele[0].parentNode.previousSibling.previousSibling;
			let left = selectedele[0].parentNode.previousSibling;
			let center = selectedele[0].parentNode;
			let right = selectedele[0].parentNode.nextSibling;
			if(farleft != null){
				selectedele[0].parentNode.parentNode.replaceChild(left,right);
				selectedele[0].parentNode.parentNode.insertBefore(right,center);
				selectedele[0].parentNode.parentNode.insertBefore(right,farleft);
				selectedele[0].parentNode.parentNode.insertBefore(center,right);
			}else{
				selectedele[0].parentNode.parentNode.replaceChild(left,right);
				selectedele[0].parentNode.parentNode.insertBefore(right,selectedele[0].parentNode);
			}
		}else{
			let left = selectedele[0].parentNode.previousSibling;
			let right = selectedele[0].parentNode.nextSibling;
			selectedele[0].parentNode.parentNode.replaceChild(left,right);
			selectedele[0].parentNode.parentNode.insertBefore(right,selectedele[0].parentNode);
		}

		clearselection(selectedele);
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//definitly broken
	static preformDistributiveRule(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
	
		var selectedele = document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformDistributiveRule",mequation.test);
		}
		clearselection(selectedele);
		//get what is in the brackets
	
		if(!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].innerHTML)){
			var equation = selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].childNodes;
			var bracket1 = selectedele[0].parentNode.previousSibling;
			var inner = selectedele[0].parentNode.previousSibling.previousSibling;
			var bracket2 = selectedele[0].parentNode.previousSibling.previousSibling.previousSibling;
			bracket1.remove();
			bracket2.remove();
			while(equation.length > 0){		
				selectedele[0].parentNode.parentNode.insertBefore(equation[equation.length - 1],selectedele[0].parentNode.previousSibling);
				console.log(selectedele[0].parentNode.previousSibling.previousSibling);
				if(selectedele[0].parentNode.previousSibling.previousSibling != undefined){
					if(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].innerHTML == '+' 
					|| selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].innerHTML == '-'){
						var mult = selectedele[0].parentNode.cloneNode(true);
						console.log(mult);
						mult.childNodes[0].setAttribute("id","item"+index);
						mult.childNodes[0].setAttribute("onclick","select(\"item"+index+"\")");
						index++;
						selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode.previousSibling.previousSibling);
						var num = selectedele[0].parentNode.nextSibling.cloneNode(true);
						selectedele[0].parentNode.parentNode.insertBefore(num,selectedele[0].parentNode.previousSibling.previousSibling);
					}
				}
			}
			inner.remove();
		}else if(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].innerHTML)){
			var equation = selectedele[0].parentNode.nextSibling.nextSibling.childNodes[0].childNodes[0].childNodes;
			var bracket1 = selectedele[0].parentNode.nextSibling;
			var inner = selectedele[0].parentNode.nextSibling.nextSibling;
			var bracket2 = selectedele[0].parentNode.nextSibling.nextSibling.nextSibling;
			bracket1.remove();
			bracket2.remove();
			while(equation.length > 0){
				selectedele[0].parentNode.parentNode.insertBefore(equation[equation.length - 1],selectedele[0].parentNode.nextSibling);
				if(selectedele[0].parentNode.nextSibling != undefined){
					if(selectedele[0].parentNode.nextSibling.childNodes[0].innerHTML == '+' 
					|| selectedele[0].parentNode.nextSibling.childNodes[0].innerHTML == '-'){
						var mult = selectedele[0].parentNode.cloneNode(true);
						console.log(mult);
						mult.childNodes[0].setAttribute("id","item"+index);
						mult.childNodes[0].setAttribute("onclick","select('item"+index+"')");
						index++;
						selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode.nextSibling.nextSibling);
						var num = selectedele[0].parentNode.previousSibling.cloneNode(true);
						selectedele[0].parentNode.parentNode.insertBefore(num,selectedele[0].parentNode.nextSibling.nextSibling);
					}
				}
			}
			inner.remove();
		}
		selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(doc,menu)){
				finishGame(menu);
			}
		}
	}

	//need to test in testlist
	static preformRemoveBrackets(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		let selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformRemoveBrackets",mequation.test);
		}
		let inside = selectedele[0].parentNode.nextSibling.childNodes[0];
		let top = selectedele[0].parentNode.parentNode.parentNode.parentNode;
		if(inside.nodeName == "SPAN"){
			while (top.firstChild) {
    				top.removeChild(top.lastChild);
  			}
			top.appendChild(inside);
		//
		}else if((inside.classList.contains(gamePlusMinusName))&&(top.parentNode.parentNode.classList.contains(gamePlusMinusName))){
			while(inside.childNodes[0].childNodes.length > 0){
				top.parentNode.insertBefore(inside.childNodes[0].childNodes[0],top);
			}
			top.parentNode.removeChild(top);
		//deal with inside is multiply and outside is multiply
		}else if((inside.classList.contains(gameMultiplyName))&&(top.parentNode.parentNode.classList.contains(gameMultiplyName))){
			while(inside.childNodes[0].childNodes.length > 0){
				top.parentNode.insertBefore(inside.childNodes[0].childNodes[0],top);
			}
			top.parentNode.removeChild(top);
		//deal with if we are a multiply and we are contained in something else
		}else if(inside.classList.contains(gameMultiplyName)){
			while (top.firstChild) {
    				top.removeChild(top.lastChild);
  			}
			top.appendChild(inside);
		}
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//make more tests in testlist
	static preformMultiply(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		//leaves behind a td
		let selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformMultiply",test);
		}
		let savedparent = selectedele[0].parentNode.parentNode;
		//deal with multiplied zero on right
		if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		//deal wiht multiplied zero on the left
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		//deal with multiplied 1 on the left
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '1'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		//deal with multiplied 1 on the right
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '1'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		//deal with two multiplied numbers
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
			var num1 = Number(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
			var num2 = Number(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data);
			var result = num1 * num2;
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = result;
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		//deal with two multiplied variables
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
		selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
			let node = selectedele[0].parentNode.nextSibling.childNodes[0];
			let nodesquared = createTd(mequation,createExponent(mequation,createGameSpan(mequation,'2'),node));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
		//deal with two multiplied functions
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
			let node = selectedele[0].parentNode.nextSibling.childNodes[0];
			let nodesquared = createTd(mequation,createExponent(mequation,createGameSpan(mequation,'2'),node));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
		//deal with function multiplied with same base exponent on the right
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(!selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent"))
		&&(!selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
			let node = selectedele[0].parentNode.nextSibling;
			let nodesquared = createTd(mequation,createExponent(mequation,createGameSpan(mequation,'2'),node));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
		//deal with function multiplied with same base exponent on the left
		}else if((!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
		&&(!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
			let node = selectedele[0].parentNode.nextSibling;
			let nodesquared = createTd(mequation,createExponent(mequation,createGameSpan(mequation,'2'),node));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent"))){
			//todo this might empty the multiplication element if so please remove that multiplication element
			var exponent1 = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
			var exponent2 = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
			var base = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			var exponent = createTd(mequation,createExponent(mequation,createBrackets(mequation,createPlusDouble(mequation,exponent1,exponent2)),base));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent")){
			//todo this might empty the multiplication element if so please remove that multiplication element
			var exponent1 = createGameSpan(mequation,'1');
			var exponent2 = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
			var base = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			var exponent = createTd(mequation,createExponent(mequation,createBrackets(mequation,createPlusDouble(mequation,exponent2,exponent1)),base));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")){
			//todo this might empty the multiplication element if so please remove that multiplication element
			var exponent1 = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
			var exponent2 = createGameSpan(mequation,'1');
			var base = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			var exponent = createTd(mequation,createExponent(mequation,createBrackets(mequation,createPlusDouble(mequation,exponent1,exponent2)),base));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
			let topleft = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let topright = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let topmult = createBrackets(mequation,createMultiplyDouble(mequation,topleft,topright));
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].appendChild(topmult);
			let bottomleft = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[2].childNodes[0].childNodes[0];
			let bottomright = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[2].childNodes[0].childNodes[0];
			let bottommult = createBrackets(mequation,createMultiplyDouble(mequation,bottomleft,bottomright));
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[2].childNodes[0].appendChild(bottommult);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide")){
			//todo
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide")){
			//todo
		}
		//todo note we will have to deal with the case where a multiplication is on top and bottom. those need to be made flat

		//used to remove mulitply tables in the dom that are empty

		if(savedparent.childNodes.length == 1){
			savedparent.parentNode.parentNode.replaceChild(savedparent.childNodes[0].childNodes[0],savedparent.parentNode);
		}

		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//need to build
	static preformDivide(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformDivide",selectedele,mequation.test);	
		}
		if((!isNaN(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data))
		&&(!isNaN(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data))){
			var num1 = Number(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].innerHTML);
			var num2 = Number(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].textContent);
			var result = num2 / num1;
			selectedele[0].parentNode.parentNode.parentNode.parentNode.appendChild(createGameSpan(mequation,result));
			selectedele[0].parentNode.parentNode.parentNode.parentNode.removeChild(selectedele[0].parentNode.parentNode.parentNode.parentNode.firstChild);
		}else if((isNaN(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data))
		&&(isNaN(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data == 
		selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data)
		&&(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data !== undefined)){
			selectedele[0].parentNode.parentNode.parentNode.parentNode.appendChild(createGameSpan(mequation,"1"));
			selectedele[0].parentNode.parentNode.parentNode.parentNode.removeChild(selectedele[0].parentNode.parentNode.parentNode.parentNode.firstChild);
		}

		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}



	//done
	static preformAdd(mequation){
		if(!mequation.test){
			disablerules(mequation);	
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformAdd",mequation.test);
		}
		let savedparent = selectedele[0].parentNode.parentNode;
		if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			//add zero right
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			//add zero left
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			if((selectedele[0].parentNode.nextSibling.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.nextSibling.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			}else{
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			}
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
			//add two numbers
			let sign = 1;
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				sign = -1;
			}
			let num1 = sign * Number(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data);
			let num2 = Number(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
			var result = num1 + num2;
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = result;
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			if((selectedele[0].parentNode.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			}else{
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			};
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
		selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
			//add two variables
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
			{
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '0';
			
			}else{
				let next = createTd(mequation,createMultiply(mequation,'2',selectedele[0].parentNode.nextSibling.childNodes[0]));
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);			
			}
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
			//add variable to number multiplied with variable on the left
			let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let leftTable = getInBracketList(selectedele,false);			
			insertNewMultipliedElement(mequation,selectedele,leftTable,createGameSpan(mequation,'1'),focus,false);
		}else if((isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))){
			//add variable to number multiplied with variable on the right
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,createGameSpan(mequation,'1'),rightTable,focus,false);
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
			//add two brackets
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.insertBefore(createTd(mequation,createGameSpan(mequation,'0')),selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling.nextSibling);
			}else{
				let next = createTd(mequation,createMultiply(mequation,'2',selectedele[0].parentNode.nextSibling.childNodes[0]));
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);		
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
			//add two multiplies
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let leftTable = getInBracketList(selectedele,false);
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,leftTable,rightTable,focus,false);
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
			//add two functions where the right is multiplied with a number
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,createGameSpan(mequation,'1'),rightTable,focus,false);
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName)){
			//add two functions where the left is multiplied with a number
			let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
			let leftTable = getInBracketList(selectedele,false);
			insertNewMultipliedElement(mequation,selectedele,leftTable,createGameSpan(mequation,'1'),focus,false);
		//deal with added fractions
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
			let left = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let right = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let newvalue;
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
				newvalue = createBrackets(mequation,createPlusDouble(mequation,createMultiply(mequation,'-1',left),right));
			}else{
				newvalue = createBrackets(mequation,createPlusDouble(mequation,left,right));
			}
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].appendChild(newvalue);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}

		//if the above addition table object has only one element then splice it out of the equation tree 
		if(savedparent.childNodes.length == 1){
			if(savedparent.parentNode.parentNode.nodeName == 'SPAN'){
				savedparent.parentNode.parentNode.replaceChild(savedparent.childNodes[0].childNodes[0],savedparent.parentNode);
			}else{
				savedparent.parentNode.parentNode.parentNode.replaceChild(savedparent.childNodes[0],savedparent.parentNode.parentNode);
			}
		}

		clearselection(selectedele);
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//todo need to test
	static preformSubtract(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformSubtract",mequation.test);
		}
		let savedparent = selectedele[0].parentNode.parentNode;
		if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			if((selectedele[0].parentNode.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				//deal with possible negative variable
			}else if(isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data)){
				let num = createTd(mequation,createMultiply(mequation,'-1',selectedele[0].parentNode.nextSibling.childNodes[0]));
				selectedele[0].parentNode.parentNode.appendChild(num);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			}else{
				let num = -1 * Number(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = num;
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			}
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))){
			let sign = 1;
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				sign = -1;
				selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			}
			let num1 = sign * Number(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data);
			let num2 = Number(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
			var result = num1 - num2;
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = result;
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			if((selectedele[0].parentNode.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			}else{
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			};
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
		selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)){
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '0';
			}else{
				let next = createTd(mequation,createGameSpan(mequation,'0'));
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);		
			}
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
			let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let leftTable = getInBracketList(selectedele,false);
			insertNewMultipliedElement(mequation,selectedele,leftTable,createGameSpan(mequation,'1'),focus,true);
		}else if((isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))){
			//todo
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,createGameSpan(mequation,'1'),rightTable,focus,true);
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				let next = createTd(mequation,createMultiply(mequation,'2',selectedele[0].parentNode.nextSibling.childNodes[0]));
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);
			}else{
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
				selectedele[0].parentNode.parentNode.insertBefore(createTd(mequation,createGameSpan(mequation,'0')),selectedele[0].parentNode.nextSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling.nextSibling);
				selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName))){
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
			let leftTable = getInBracketList(selectedele,false);
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,leftTable,rightTable,focus,true);
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
			let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
			let rightTable = getInBracketList(selectedele,true);
			insertNewMultipliedElement(mequation,selectedele,createGameSpan(mequation,'1'),rightTable,focus,true);
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains(gameMultiplyName)){
			let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
			let leftTable = getInBracketList(selectedele,false);
			insertNewMultipliedElement(mequation,selectedele,leftTable,createGameSpan(mequation,'1'),focus,true);
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
			let left = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let right = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			let newvalue;
			if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-')){
				selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
				newvalue = createBrackets(mequation,createSubtractionDouble(mequation,createMultiply(mequation,'-1',left),right));
			}else{
				newvalue = createBrackets(mequation,createSubtractionDouble(mequation,left,right));
			}
			selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].appendChild(newvalue);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}
		if(savedparent.childNodes.length == 1){
			if(savedparent.parentNode.parentNode.nodeName == 'SPAN'){
				savedparent.parentNode.parentNode.replaceChild(savedparent.childNodes[0].childNodes[0],savedparent.parentNode);
			}else{
				savedparent.parentNode.parentNode.parentNode.replaceChild(savedparent.childNodes[0],savedparent.parentNode.parentNode);
			}
		}
		clearselection(selectedele);
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//done
	static preformDoubleNegative(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformDoubleNegative",mequation.test);
		}
		if(selectedele[0].innerHTML === '-'){
			selectedele[0].innerHTML = '+';
		}else if(selectedele[0].innerHTML === '+'){
			selectedele[0].innerHTML = '-';
		}

		if(!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data)){
			//if number then change that number to negative
			let num = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data;
			if(num.startsWith('-')){
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = num.substring(1);
			}else{
				selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '-'+num;
			}
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
			//if a multiply group then add a multiplied negative 1 to the group
			let mult = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0];
			let first = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0];
			let newnum = createTd(createGameSpan('-1'));
			let newmult = createTd(createGameSpan('\u00B7'));
			mult.insertBefore(newmult,first)
			mult.insertBefore(newnum,newmult)
		}else{
			//if anything else than a number or multiply group then create a multiply group with a multiplied negative 1
			let mult = createTd(createMultiply('-1',selectedele[0].parentNode.nextSibling));
			selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		}	
	
		clearselection(selectedele);
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//done
	static performMultiNegative(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("performMultiNegative",mequation.test);
		}
		selectedele[0].innerHTML = '+'
		if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains(gameMultiplyName)){
			//todo same as in double negative. make into one function.
			let mult = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0];
			let first = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0];
			let newnum = createTd(createGameSpan(menu,'-1',test));
			let newmult = createTd(createGameSpan(menu,'\u00B7',test));
			mult.insertBefore(newmult,first)
			mult.insertBefore(newnum,newmult)
		}else{
			let mult = createTd(createMultiply(menu,'-1',selectedele[0].parentNode.nextSibling.childNodes[0],test));
			selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling.nextSibling);
		}

		clearselection(selectedele);
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}

	//todo need to test
	static preformRemoveZero(mequation){
		if(!mequation.test){
			disablerules(mequation);
		}
		var selectedele = mequation.document.querySelectorAll("#"+mequation.menu+" #"+mequation.selected);
		if(mequation.isMultiplayer){
			sendCommand("preformRemoveZero",mequation.test);
		}
		selectedele[0].parentNode.nextSibling.remove();
		selectedele[0].parentNode.remove();
		mequation.selected = undefined;
		if((!mequation.isMultiplayer)&&(!mequation.test)){
			if(checkfinishgame(mequation)){
				finishGame(mequation);
			}
		}
	}
}
/**************************************************/

function clearGame(menu){
	var rightdiv = document.querySelector("#"+menu+" #rightdiv");
	var leftdiv = document.querySelector("#"+menu+" #leftdiv");
	clearChildren(rightdiv);
	clearChildren(leftdiv);
}

function clearChildren(node){
	while (node.lastChild) {
        	node.removeChild(node.lastChild);
    	}
}

function checkfinishgame(mequation){
	var rightdiv = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
	var leftdiv = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");

	var rightendvalue;
	if(rightdiv.childNodes.length == 1){
		if(rightdiv.childNodes[0].childNodes.length == 1){
			rightendvalue = rightdiv.childNodes[0].childNodes[0].data;
		}else{
			return false;
		}
	}else{
		return false;
	}
	var leftendvalue;
	if(leftdiv.childNodes.length == 1){
		if(leftdiv.childNodes[0].childNodes.length == 1){
			leftendvalue = leftdiv.childNodes[0].childNodes[0].data;
		}else{
			return false;
		}
	}else{
		return false;
	}
	
	if((rightendvalue == 'x')&&(!isNaN(leftendvalue))){
		return true;
	}else if((leftendvalue == 'x')&&(!isNaN(rightendvalue))){
		return true;
	}
	return false;	
}
	

function finishGame(mequation){
	menuState = 1;
	nextMenu = "Finish";

	var finishproblemrightdiv = mequation.document.querySelector("#FinishProblem #rightdiv");
	clearChildren(finishproblemrightdiv);

	var finishproblemleftdiv = mequation.document.querySelector("#FinishProblem #leftdiv");
	clearChildren(finishproblemleftdiv);

	GenerateFromString(mequation.variable,mequation.document,"FinishProblem",true,false,globalThis.currentEquation);
	var rightdiv = mequation.document.querySelector("#"+mequation.menu+" #rightdiv");
	var finishrightdiv = mequation.document.querySelector("#FinishSolution #rightdiv");
	clearChildren(finishrightdiv);
	finishrightdiv.appendChild(rightdiv.childNodes[0]);
	var leftdiv = mequation.document.querySelector("#"+mequation.menu+" #leftdiv");
	var finishleftdiv = mequation.document.querySelector("#FinishSolution #leftdiv");
	clearChildren(finishleftdiv);
	finishleftdiv.appendChild(leftdiv.childNodes[0]);
	clearChildren(rightdiv);
	clearChildren(leftdiv);

	if(globalThis.currentLesson !== undefined){
		let postObj = { lesson: globalThis.currentLesson };
		postInfo("lesson",postObj)

		let lessonbutton = document.getElementById("lesson_"+globalThis.currentLesson);
		lessonbutton.style.backgroundColor="lightgreen";
	}else if(globalThis.currentChallengecurrentLesson !== undefined){
		let postObj = { lesson: globalThis.currentChallenge, equation: globalThis.currentEquation};
		postInfo("challenge",postObj)
		//todo update challenge number

	}
	globalThis.currentChallenge = undefined;
	globalThis.currentLesson = undefined;
	globalThis.currentEquation = undefined;
}


function sendSelect(selectedele,test){
	if((globalThis.websocketconnection != null)&&(!test)){
		let action = {};
		action.name = "select";
		action.selected = selectedele;
		globalThis.websocketconnection.socket.send(JSON.stringify(action));
	}
}

function sendCommand(name,test){
	if((globalThis.websocketconnection != null)&&(!test)){
		let action = {};
		action.name = name;
		globalThis.websocketconnection.socket.send(JSON.stringify(action));
	}
}

function sendCommandWithNumber(name,nc,vc,test){
	if((globalThis.websocketconnection != null)&&(!test)){
		let action = {};
		action.name = name;
		action.extra = {"numberCreatorText":nc,"variableCreatorButton":vc}
		globalThis.websocketconnection.socket.send(JSON.stringify(action));
	}
}

function getAllFunctions(){ 
	var allfunctions=[];
	for ( var i in window) {
		if((typeof window[i]).toString()=="function"){
			allfunctions.push(window[i].name);
		}
	}
}

const moduleOutput = {GenerateFromString,GenerateFromAdvancedString,MathemagicianRuleList,MathemagicianPerformList,select,checkfinishgame}

try {
   module.exports = exports = moduleOutput;
} catch (e) {}