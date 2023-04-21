var id = 0;
var index = 0;
var increaseleft = 1;
var increaseright = 1;
var selected;

var leftSideValue = 0;
var rightSideValue = 0;

/*
* generate equation from string
*/
//todo add sqrt,log,ln,cos,sin,tan,arccos,arcsin,arctan

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

function createGameSpan(menu,text,test){
	index++;
	return createGameSpanWithIndex(menu,index,text,test);
}

function createGameSpanWithIndex(menu,i,text,test){
	let valspan = document.createElement("span");
	valspan.setAttribute("id","item"+i);
	if(!test){
		valspan.setAttribute("onclick","select(\""+menu+"\",\"item"+i+"\")");
	}
	var valt = document.createTextNode(text);
	valspan.appendChild(valt);
	return valspan;
}

function createTable(equation){
	var valtd = document.createElement("table");
	valtd.appendChild(equation);
	return valtd;
}

function createTr(equation){
	var valtd = document.createElement("tr");
	valtd.appendChild(equation);
	return valtd;
}

function createTd(equation){
	var valtd = document.createElement("td");
	valtd.style.textAlign = "center";
	valtd.style.margin = "auto";
	valtd.style.borderSpacing = "0 auto";
	valtd.appendChild(equation);
	return valtd;
}

function GenerateFromString(menu,equation,test)
{
   //todo add the ability to invoke a procedural function
   index = 0;
   var start = 0;
   var end = equation.length;
   var eq = recursion(equation,start,end);

   var left = document.querySelector("#"+menu+" #leftdiv");
   var right = document.querySelector("#"+menu+" #rightdiv");

   var lefteq = instantiate(menu,eq[0],test);
   left.appendChild(lefteq);
   var righteq = instantiate(menu,eq[2],test);
   right.appendChild(righteq);
}

function upgradeToTable(node){
   if(node.tagName != "TABLE"){
	var table = document.createElement("table");
	var tr = document.createElement("tr");
	table.appendChild(tr)
	var td = document.createElement("td");
	tr.appendChild(td)
	td.appendChild(node)
	return table;
   }
   return node;
}

function recursion(string,start,end){
	//todo deal with size differences
	//todo make a string of additions one element
	//todo make a string of multiplications one element
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
			return [recursion(string,start+1,end-1),'()']
		}else{
			return string.substring(start,end);
		}
	}else{
   		return [recursion(string,start,largestPiorityIndex),largestPiorityCharacter,recursion(string,largestPiorityIndex+1,end)];
	}
   }else{
	return largestPiorityCharacter;
   }
}

/*
* generate procedural algorithm
*/

function instantiate(menu,equation,test){
	if(!Array.isArray(equation)){
		return createGameSpan(menu,equation,test);
	}

	if(equation[1] == '()'){
		return instantiateBracket(menu,equation,test);
	}else if((equation[1] == '+')||(equation[1] == '-')){
		return instantiatePlusMinus(menu,equation[1],equation,test);
	}else if(equation[1] == '*'){
		return instantiateMultiply(menu,equation,test);
	}else if(equation[1] == '/'){
		return instantiateDivide(menu,equation,test);
	}else if(equation[1] == '^'){
		return instantiateExponent(menu,equation,test);
	}
}

function instantiateBracket(menu,equation,test){
	index++;
	var currentIndex = index;
	var valTable = document.createElement("table");
	valTable.style.margin = "auto";
	valTable.classList.add("gameBrackets");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(createGameSpanWithIndex(menu,currentIndex,'(',test)));
	valtr.appendChild(createTd(instantiate(menu,equation[0],test)));
	valtr.appendChild(createTd(createGameSpanWithIndex(menu,currentIndex,')',test)));	
	return valTable;
}

function createBrackets(menu,equation,test){
	index++;
	var currentIndex = index;
	var valTable = document.createElement("table");
	valTable.style.margin = "auto";
	valTable.classList.add("gameBrackets");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(createGameSpanWithIndex(menu,currentIndex,'(',test)));
	valtr.appendChild(createTd(equation));
	valtr.appendChild(createTd(createGameSpanWithIndex(menu,currentIndex,')',test)));	
	return valTable;
}

function instantiatePlusMinus(menu,symbol,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gamePlusMinus");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(instantiate(menu,equation[0],test)));
	valtr.appendChild(createTd(createGameSpan(menu,symbol,test)));
	if((Array.isArray(equation[2]))&&((equation[2][1] == '+')||(equation[2][1] == '-'))){
		let currentEquationPart = equation[2];
		while((Array.isArray(currentEquationPart))&&((currentEquationPart[1] == '+')||(currentEquationPart[1] == '-'))){
			valtr.appendChild(createTd(instantiate(menu,currentEquationPart[0],test)));
			valtr.appendChild(createTd(createGameSpan(menu,currentEquationPart[1],test)));
			currentEquationPart = currentEquationPart[2];
		}
		valtr.appendChild(createTd(instantiate(menu,currentEquationPart,test)));
	}else{
		valtr.appendChild(createTd(instantiate(menu,equation[2],test)));
	}
	return valTable;
}

function createPlusDouble(menu,equation1,equation2,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gamePlusMinus");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(equation1));
	valtr.appendChild(createTd(createGameSpan(menu,"+",test)));
	valtr.appendChild(createTd(equation2));
	return valTable;
}

function createPlus(menu,value,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gamePlusMinus");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(equation));
	valtr.appendChild(createTd(createGameSpan(menu,"+",test)));
	valtr.appendChild(createTd(createGameSpan(menu,value,test)));
	return valTable;
}

function createSubtractionDouble(menu,equation1,equation2,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gamePlusMinus");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(equation1));
	valtr.appendChild(createTd(createGameSpan(menu,"-",test)));
	valtr.appendChild(createTd(equation2));
	return valTable;
}

function createSubtraction(menu,value,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gamePlusMinus");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(equation));
	valtr.appendChild(createTd(createGameSpan(menu,"-",test)));
	valtr.appendChild(createTd(createGameSpan(menu,value,test)));
	return valTable;
}

function instantiateMultiply(menu,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameMultiply");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(instantiate(menu,equation[0],test)));
	valtr.appendChild(createTd(createGameSpan(menu,"\u00B7",test)));
	if((Array.isArray(equation[2]))&&(equation[2][1] == '*')){
		let currentEquationPart = equation[2];
		while((Array.isArray(currentEquationPart))&&(currentEquationPart[1] == '*')){
			valtr.appendChild(createTd(instantiate(menu,currentEquationPart[0],test)));
			valtr.appendChild(createTd(createGameSpan(menu,"\u00B7",test)));
			currentEquationPart = currentEquationPart[2];
		}
		valtr.appendChild(createTd(instantiate(menu,currentEquationPart,test)));
	}else{
		valtr.appendChild(createTd(instantiate(menu,equation[2],test)));
	}
	return valTable;
}

function createMultiply(menu,value,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameMultiply");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(createGameSpan(menu,value,test)));
	valtr.appendChild(createTd(createGameSpan(menu,"\u00B7",test)));
	valtr.appendChild(createTd(equation));
	return valTable;
}

function createMultiplyDouble(menu,equation1,equation2,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameMultiply");
	var valtr = document.createElement("tr");
	valTable.appendChild(valtr);
	valtr.appendChild(createTd(equation1));
	valtr.appendChild(createTd(createGameSpan(menu,"\u00B7",test)));
	valtr.appendChild(createTd(equation2));
	return valTable;
}

function instantiateDivide(menu,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameDivide");

	var valtr1 = document.createElement("tr");
	valtr1.appendChild(createTd(instantiate(menu,equation[0],test)));
	valTable.appendChild(valtr1);

	var valtr2 = document.createElement("tr");
	var valtd2 = document.createElement("td");
	var valhr2 = document.createElement("hr");
	index++;
	valhr2.setAttribute("id","item"+index);
	if(!test){
		valhr2.setAttribute("onclick","select(\""+menu+"\",\"item"+index+"\")");
	}
	valtd2.appendChild(valhr2);
	valtr2.appendChild(valtd2);
	valTable.appendChild(valtr2);

	var valtr3 = document.createElement("tr");
	valtr3.appendChild(createTd(instantiate(menu,equation[2],test)));
	valTable.appendChild(valtr3);

	return valTable;
}

function createDivide(menu,value,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameDivide");
	var valtr1 = document.createElement("tr");
	var valtd1 = document.createElement("td");
	var valt1 = equation;
	valtd1.appendChild(valt1);
	valtr1.appendChild(valtd1);
	valTable.appendChild(valtr1);

	var valtr2 = document.createElement("tr");
	var valtd2 = document.createElement("td");
	var valhr2 = document.createElement("hr");
	valhr2.setAttribute("id","item"+index);
	if(!test){
		valhr2.setAttribute("onclick","select(\""+menu+"\",\"item"+index+"\")");
	}
	index++;
	valtd2.appendChild(valhr2);
	valtr2.appendChild(valtd2);
	valTable.appendChild(valtr2);

	var valtr3 = document.createElement("tr");
	var valtd3 = document.createElement("td");
	var valspan3 = document.createElement("span");
	valspan3.setAttribute("id","item"+index);
	if(!test){
		valspan3.setAttribute("onclick","select(\""+menu+"\",\"item"+index+"\")");
	}
	index++;
	var valt3 = document.createTextNode(value);
	valspan3.appendChild(valt3);
	valtd3.appendChild(valspan3);
	valtr3.appendChild(valtd3);
	valTable.appendChild(valtr3);

	return valTable;
}

function instantiateExponent(menu,equation,test){
	var valTable = document.createElement("table");
	valTable.classList.add("gameExonent");
	var valtr1 = document.createElement("tr");
	var valtd1 = document.createElement("td");
	valtd1.setAttribute("rowspan","2");
	var valt1 = instantiate(menu,equation[0],test);
	valtd1.appendChild(valt1);
	valtr1.appendChild(valtd1);
	var valtd12 = document.createElement("td");
	valtd12.setAttribute("style","display: inline-flex;horizontal-align:left;vertical-align:top;");
	var valspan12 = document.createElement("span");
	valspan12.setAttribute("style","display: inline-block;font-size: 50%;");
	var valt12 = instantiate(menu,equation[2],test);
	valspan12.appendChild(valt12);
	valtd12.appendChild(valspan12);
	valtr1.appendChild(valtd12);
	valTable.appendChild(valtr1);
	
	var valtr2 = document.createElement("tr");
	var valtd2 = document.createElement("td");
	var valt2 = document.createTextNode(" ");
	valtd2.appendChild(valt2);
	valtr2.appendChild(valtd2);
	valTable.appendChild(valtr2);

	return valTable;
}

function createExponent(menu,value,equation,test){
	//todo doesnt work with equational exponents
	var valTable = document.createElement("table");
	valTable.classList.add("gameExonent");
	var valtr1 = document.createElement("tr");
	var valtd1 = document.createElement("td");
	valtd1.setAttribute("rowspan","2");
	var valt1 = equation;
	valtd1.appendChild(valt1);
	valtr1.appendChild(valtd1);
	var valtd12 = document.createElement("td");
	valtd12.setAttribute("style","display: inline-flex;horizontal-align:left;vertical-align:top;");
	var valspan12 = document.createElement("span");
	valspan12.setAttribute("style","display: inline-block;font-size: 50%;");
	var valt12 = value;
	valspan12.appendChild(valt12);
	valtd12.appendChild(valspan12);
	valtr1.appendChild(valtd12);
	valTable.appendChild(valtr1);
	

	var valtr2 = document.createElement("tr");
	var valtd2 = document.createElement("td");
	var valt2 = document.createTextNode(" ");
	valtd2.appendChild(valt2);
	valtr2.appendChild(valtd2);
	valTable.appendChild(valtr2);

	return valTable;
}

/*
*main functions
*/

function drawScale(){
      var canvas = document.getElementById('scale');
      if(canvas == null){
	return;
      }
      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(leftSideValue == rightSideValue){
		ctx.strokeStyle = 'rgba(0, 200, 0, 0.5)';
	}else{
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
	}

	ctx.beginPath();
	ctx.moveTo(50, 90);
    	ctx.lineTo(100, 90);
	ctx.moveTo(75, 90);
	ctx.lineTo(75, 30);

	var balance = 0;
	if(leftSideValue > rightSideValue){
		balance = 10;
	}else if(leftSideValue < rightSideValue){
		balance = -10;
	}

	ctx.moveTo(25,30+balance);

	ctx.lineTo(20,70+balance);
	ctx.lineTo(30,70+balance);
	ctx.lineTo(25,30+balance);

	ctx.lineTo(125,30-balance);

	ctx.lineTo(120,70-balance);
	ctx.lineTo(130,70-balance);
	ctx.lineTo(125,30-balance);

    	ctx.closePath();
	ctx.stroke();

      }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev,target) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dragelement = document.getElementById(data);
    var dropelement = document.getElementById(target); 

    var increase;
    if(hasClass(ev.target,"left")){
	increase = increaseleft;
    }else{
	increase = increaseright;
    }

	//add multiply
    if(hasClass(dragelement,"multiply")){

	var value = dragelement.textContent.substr(1);

	var org_html = dropelement.childNodes;

	var multtable = document.createElement("table");
	var multtr = document.createElement("tr");
	multtable.appendChild(multtr);

	var multtd1 = document.createElement("td");
	multtd1.setAttribute("align","center");
	var multspan1 = document.createElement("span");
	var multt1 = document.createTextNode(value);
	multspan1.appendChild(multt1);
	multtd1.appendChild(multspan1);
	multtr.appendChild(multtd1);

	var multtd2 = document.createElement("td");
	multtd2.setAttribute("align","center");
	var multspan2 = document.createElement("span");
	multspan2.setAttribute("id","item"+index);
	multspan2.setAttribute("onclick","select(\"item"+index+"\")");
	//multspan2.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");");
	var multt2 = document.createTextNode("\u00B7");
	multspan2.appendChild(multt2);
	multtd2.appendChild(multspan2);
	multtr.appendChild(multtd2);

	var multtd3 = document.createElement("td");
	multtd3.setAttribute("align","center");
	var multspan3 = document.createElement("span");
	multspan3.setAttribute("id","bracket"+index+"");
	multspan3.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	multspan3.setAttribute("onclick","select(\"bracket"+index+"\")");
	var multt3 = document.createTextNode("(");
	multspan3.appendChild(multt3);
	multtd3.appendChild(multspan3);
	multtr.appendChild(multtd3);

	var multtd4 = document.createElement("td");
	multtd4.setAttribute("align","center");
	while(org_html.length > 0){
		multtd4.appendChild(org_html[0]);
	}
	multtr.appendChild(multtd4);

	var multtd5 = document.createElement("td");
	multtd5.setAttribute("align","center");
	var multspan5 = document.createElement("span");
	multspan5.setAttribute("id","bracket"+index+"");
	multspan5.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	multspan5.setAttribute("onclick","select(\"bracket"+index+"\")");
	var multt5 = document.createTextNode(")");
	multspan5.appendChild(multt5);
	multtd5.appendChild(multspan5);
	multtr.appendChild(multtd5);

	dropelement.appendChild(multtable);
	index ++;
	if(dropelement.id == "leftdiv"){
		leftSideValue = leftSideValue*value;
	}else if(dropelement.id == "rightdiv"){
		rightSideValue = rightSideValue*value;
        }
	drawScale();
    }else if(hasClass(dragelement,"divide")){
	      
        var value = dragelement.textContent.substr(1);

	var org_html = dropelement.childNodes;

	var divtable = document.createElement("table");
	var divtr = document.createElement("tr");
	divtable.appendChild(divtr);

	var divtd1 = document.createElement("td");
	divtd1.setAttribute("align","center");
	var divspan1 = document.createElement("span");
	divspan1.setAttribute("id","bracket"+index+"");
	divspan1.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	divspan1.setAttribute("onclick","select(\"bracket"+index+"\")");
	var divt1 = document.createTextNode("(");
	divspan1.appendChild(divt1);
	divtd1.appendChild(divspan1);
	divtr.appendChild(divtd1);

	var divtd2 = document.createElement("td");
	divtd2.setAttribute("align","center");
	while(org_html.length > 0){
		divtd2.appendChild(org_html[0]);
	}
	divtr.appendChild(divtd2);

	var divtd3 = document.createElement("td");
	divtd3.setAttribute("align","center");
	var divspan3 = document.createElement("span");
	divspan3.setAttribute("id","bracket"+index+"");
	divspan3.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	divspan3.setAttribute("onclick","select(\"bracket"+index+"\")");
	var divt3 = document.createTextNode(")");
	divspan3.appendChild(divt3);
	divtd3.appendChild(divspan3);
	divtr.appendChild(divtd3);

	var divtrhr = document.createElement("tr");
	divtable.appendChild(divtrhr);


	var divtdhr = document.createElement("td");
	divtdhr.setAttribute("colspan","3");
	divtdhr.setAttribute("align","center");
	divtrhr.appendChild(divtdhr);
	var divhr = document.createElement("hr");
	divhr.setAttribute("id","item"+index);
	divhr.setAttribute("onclick","select(\"item"+index+"\")");
	divtdhr.appendChild(divhr);


	var divtrvalue = document.createElement("tr");
	divtable.appendChild(divtrvalue);
	var divtdvalue = document.createElement("td");
	divtdvalue.setAttribute("colspan","3");
	divtdvalue.setAttribute("align","center");
	divtrvalue.appendChild(divtdvalue);
	var divspanvalue = document.createElement("span");
	divtdvalue.appendChild(divspanvalue);
	var divtvalue = document.createTextNode(value);
	divspanvalue.appendChild(divtvalue);

	dropelement.appendChild(divtable);
	index ++;
	if(hasClass(ev.target,"left")){
	    increaseleft += 3;
        }else{
	    increaseright+= 3;
        }  
	if(dropelement.id == "leftdiv"){
		leftSideValue = leftSideValue/value;
	}else if(dropelement.id == "rightdiv"){
		rightSideValue = rightSideValue/value;
        }
	drawScale();
	//add add
    }else if(hasClass(dragelement,"adder")){

	var value = dragelement.textContent.substr(1);

	var org_html = dropelement.childNodes;

	var addtable = document.createElement("table");
	var addtr = document.createElement("tr");
	addtable.appendChild(addtr);


	var addtd1 = document.createElement("td");
	addtd1.setAttribute("align","center");
	var addspan1 = document.createElement("span");
	addspan1.setAttribute("id","bracket"+index+"");
	addspan1.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	addspan1.setAttribute("onclick","select(\"bracket"+index+"\")");
	var addt1 = document.createTextNode("(");
	addspan1.appendChild(addt1);
	addtd1.appendChild(addspan1);
	addtr.appendChild(addtd1);

	var addtd2 = document.createElement("td");
	addtd2.setAttribute("align","center");
	while(org_html.length > 0){
		addtd2.appendChild(org_html[0]);
	}
	addtr.appendChild(addtd2);

	var addtd3 = document.createElement("td");
	addtd3.setAttribute("align","center");
	var addspan3 = document.createElement("span");
	addspan3.setAttribute("id","bracket"+index+"");
	addspan3.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	addspan3.setAttribute("onclick","select(\"bracket"+index+"\")");
	var addt3 = document.createTextNode(")");
	addspan3.appendChild(addt3);
	addtd3.appendChild(addspan3);
	addtr.appendChild(addtd3);


	var addtd4 = document.createElement("td");
	addtd4.setAttribute("align","center");
	var addspan4 = document.createElement("span");
	addspan4.setAttribute("id","item"+index);
	addspan4.setAttribute("onclick","select(\"item"+index+"\")");
	var addt4 = document.createTextNode("+");
	addspan4.appendChild(addt4);
	addtd4.appendChild(addspan4);
	addtr.appendChild(addtd4);

	var addtd5 = document.createElement("td");
	addtd5.setAttribute("align","center");
	var addspan5 = document.createElement("span");
	var addt5 = document.createTextNode(value);
	addspan5.appendChild(addt5);
	addtd5.appendChild(addspan5);
	addtr.appendChild(addtd5);

	dropelement.appendChild(addtable);

	index ++;
	if(dropelement.id == "leftdiv"){
		leftSideValue = leftSideValue+value;
	}else if(dropelement.id == "rightdiv"){
		rightSideValue = rightSideValue+value;
        }
	drawScale();
    }else if(hasClass(dragelement,"subtractor")){

	var value = dragelement.textContent.substr(1);

	var org_html = dropelement.childNodes;

	var minustable = document.createElement("table");
	var minustr = document.createElement("tr");
	minustable.appendChild(minustr);

	var minustd1 = document.createElement("td");
	minustd1.setAttribute("align","center");
	var minusspan1 = document.createElement("span");
	minusspan1.setAttribute("id","bracket"+index+"");
	minusspan1.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	minusspan1.setAttribute("onclick","select(\"bracket"+index+"\")");
	var minust1 = document.createTextNode("(");
	minusspan1.appendChild(minust1);
	minustd1.appendChild(minusspan1);
	minustr.appendChild(minustd1);

	var minustd2 = document.createElement("td");
	minustd2.setAttribute("align","center");
	while(org_html.length > 0){
		minustd2.appendChild(org_html[0]);
	}
	minustr.appendChild(minustd2);

	var minustd3 = document.createElement("td");
	minustd3.setAttribute("align","center");
	var minusspan3 = document.createElement("span");
	minusspan3.setAttribute("id","bracket"+index+"");
	minusspan3.setAttribute("style","display:inline-block;transform:scale(1,"+increase+");"); 
	minusspan3.setAttribute("onclick","select(\"bracket"+index+"\")");
	var minust3 = document.createTextNode(")");
	minusspan3.appendChild(minust3);
	minustd3.appendChild(minusspan3);
	minustr.appendChild(minustd3);


	var minustd4 = document.createElement("td");
	minustd4.setAttribute("align","center");
	var minusspan4 = document.createElement("span");
	minusspan4.setAttribute("id","item"+index);
	minusspan4.setAttribute("onclick","select(\"item"+index+"\")");
	var minust4 = document.createTextNode("-");
	minusspan4.appendChild(minust4);
	minustd4.appendChild(minusspan4);
	minustr.appendChild(minustd4);

	var minustd5 = document.createElement("td");
	minustd5.setAttribute("align","center");
	var minusspan5 = document.createElement("span");
	var minust5 = document.createTextNode(value);
	minusspan5.appendChild(minust5);
	minustd5.appendChild(minusspan5);
	minustr.appendChild(minustd5);

	dropelement.appendChild(minustable);
	index ++;
	if(dropelement.id == "leftdiv"){
		leftSideValue = leftSideValue-value;
	}else if(dropelement.id == "rightdiv"){
		rightSideValue = rightSideValue-value;
        }
	drawScale();
    }     
    document.getElementById(data).remove();
}

function trash(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    document.getElementById(data).remove();
}

function createNumeratorDrag(){  
    var nc = document.getElementById("numeratorCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }
    var element = document.getElementById("workspace");

    var item = document.createElement("span");
    item.setAttribute("id","element"+id);
    item.setAttribute("class","boardered multiply");
    item.setAttribute("draggable","true");
    item.setAttribute("ondragstart","drag(event)");
    
    var t = document.createTextNode("\u00d7"+nc.value);
    item.appendChild(t);

    element.appendChild(item);
    id ++;
}

function createNumeratorBoth(menu){
    var nc = document.querySelector("#"+menu+" #numberCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }

   var left = document.querySelector("#"+menu+" #leftdiv");
   var leftchild = left.childNodes[0];
   clearChildren(left);
   left.appendChild(createMultiply(nc.value,createBrackets(leftchild)));
   var right = document.querySelector("#"+menu+" #rightdiv");
   var rightchild = right.childNodes[0];
   clearChildren(right);
   right.appendChild(createMultiply(nc.value,createBrackets(rightchild)));

}

function createDenominatorDrag(){
  
    var nc = document.getElementById("denominatorCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }
    var element = document.getElementById("workspace");

    var item = document.createElement("span");
    item.setAttribute("id","element"+id);
    item.setAttribute("class","boardered divide");
    item.setAttribute("draggable","true");
    item.setAttribute("ondragstart","drag(event)");
    var t = document.createTextNode("\u00f7"+nc.value);
    item.appendChild(t);

    element.appendChild(item);
    id ++;
}

function createDenominatorBoth(menu){
    var nc = document.querySelector("#"+menu+" #numberCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }

   var left = document.querySelector("#"+menu+" #leftdiv");
   var leftchild = left.childNodes[0];
   clearChildren(left);
   left.appendChild(createDivide(nc.value,createBrackets(leftchild)));
   var right = document.querySelector("#"+menu+" #rightdiv");
   var rightchild = right.childNodes[0];
   clearChildren(right);
   right.appendChild(createDivide(nc.value,createBrackets(rightchild)));
}

function createAdderDrag(){
  
    var nc = document.getElementById("adderCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }
    var element = document.getElementById("workspace");

    var item = document.createElement("span");
    item.setAttribute("id","element"+id);
    item.setAttribute("class","boardered adder");
    item.setAttribute("draggable","true");
    item.setAttribute("ondragstart","drag(event)");
    var t = document.createTextNode("+"+nc.value);
    item.appendChild(t);

    element.appendChild(item);
    id ++;
}

function createAdderBoth(menu,test){
    var nc = document.querySelector("#"+menu+" #numberCreatorText");
    var vc = document.querySelector("#"+menu+" #variableCreatorButton");
    //todo might need to remove zero check
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }

   var left = document.querySelector("#"+menu+" #leftdiv");
   var leftchild = left.childNodes[0];
   clearChildren(left); 
   let newvalueleft;
   if(vc.checked == true){
	newvalueleft = createMultiply(menu,nc.value,createGameSpan('x'),test);
   }else{
   	newvalueleft = createGameSpan(nc.value);
   }
   left.appendChild(createPlusDouble(createBrackets(leftchild),newvalueleft));

   var right = document.querySelector("#"+menu+" #rightdiv");
   var rightchild = right.childNodes[0];
   clearChildren(right);
   let newvalueright;
   if(vc.checked == true){
	newvalueright = createMultiply(nc.value,createGameSpan('x'));
   }else{
   	newvalueright = createGameSpan(nc.value);
   }
   right.appendChild(createPlusDouble(createBrackets(rightchild),newvalueright));
}

function createSubtractorDrag(){
 
    var nc = document.getElementById("subtractorCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }
    var element = document.getElementById("workspace");

    var item = document.createElement("span");
    item.setAttribute("id","element"+id);
    item.setAttribute("class","boardered subtractor");
    item.setAttribute("draggable","true");
    item.setAttribute("ondragstart","drag(event)");
    var t = document.createTextNode("-"+nc.value);
    item.appendChild(t);

    element.appendChild(item);
    id ++;
}

function createSubtractorBoth(menu){
    var nc = document.querySelector("#"+menu+" #numberCreatorText");
    var vc = document.querySelector("#"+menu+" #variableCreatorButton");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }

   var left = document.querySelector("#"+menu+" #leftdiv");
   var leftchild = left.childNodes[0];
   clearChildren(left);
   let newvalueleft;
   if(vc.checked == true){
	newvalueleft = createMultiply(nc.value,createGameSpan('x'));
   }else{
   	newvalueleft = createGameSpan(nc.value);
   }
   left.appendChild(createSubtractionDouble(createBrackets(leftchild),newvalueleft ));

   var right = document.querySelector("#"+menu+" #rightdiv");
   var rightchild = right.childNodes[0];
   clearChildren(right);
   let newvalueright;
   if(vc.checked == true){
	newvalueright = createMultiply(nc.value,createGameSpan('x'));
   }else{
   	newvalueright = createGameSpan(nc.value);
   }
   right.appendChild(createSubtractionDouble(createBrackets(rightchild),newvalueright));
}


function createExponentBoth(menu){
    var nc = document.querySelector("#"+menu+" #numberCreatorText");
    if(Number(nc.value) == 0){
    	nc.value = 1;
    }

   var left = document.querySelector("#"+menu+" #leftdiv");
   var leftchild = left.childNodes[0];
   clearChildren(left);
   left.appendChild(createExponent(nc.value,createBrackets(leftchild)));
   var right = document.querySelector("#"+menu+" #rightdiv");
   var rightchild = right.childNodes[0];
   clearChildren(right);
   right.appendChild(createExponent(nc.value,createBrackets(rightchild)));
}

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

function select(menu,item){
	if(selected != null){
		var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
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
	var ele = document.querySelectorAll("#"+menu+" #"+item);
	for(var i = 0; i < ele.length;i++){
		ele[i].style.color = "#ff0000";
		ele[i].style.webkitTextStroke = "2px red";
		if(ele[i].tagName.toLowerCase() == 'hr'){
			ele[i].style.backgroundColor = "#f00";
		}
	}
	selected = item;
	checkrules();
}

function checkrules(){
	if(selected != null){
		var selectedele = document.querySelectorAll("#"+selected);
		ruleRemoveBrackets(selectedele);
		ruleCommunitive(selectedele);
		ruleDistributive(selectedele);
		ruleDoubleNegative(selectedele);
		ruleSTMNegative(selectedele)
		ruleMultiply(selectedele);
		ruleDivide(selectedele);
		ruleAdd(selectedele);	
		ruleSubtract(selectedele);
		//ruleZero(selectedele);
	}
}

function disablerules(){
	//todo change this to a loop
	document.getElementById("removeBrackets").disabled = true;
	document.getElementById("commutativeRule").disabled = true;
	document.getElementById("distributiveRule").disabled = true;
	
	document.getElementById("doubleNegative").disabled = true;
	document.getElementById("multiply").disabled = true;
	document.getElementById("divide").disabled = true;
	document.getElementById("add").disabled = true;
	document.getElementById("subtract").disabled = true;
	document.getElementById("doubleNegative").disabled = true;
	//document.getElementById("removezero").disabled = true;
}

/************************
 *rules
 *************************/
//done
function ruleRemoveBrackets(selectedele){
    	document.querySelectorAll("#removeBrackets").forEach(function(elem, idx) {elem.disabled = true});
	if(selectedele[0].innerHTML !== '(' && selectedele[0].innerHTML !== ')' ){
		return;
	}
	if(selectedele[0].parentNode.parentNode.parentNode.parentNode.previousSibling != null){
	if(selectedele[0].parentNode.parentNode.parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].data === '-'){
		return;
	}
	}

	if((!selectedele[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("gameMultiply"))
		||(!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gamePlusMinus")))
	{
		document.querySelectorAll("#removeBrackets").forEach(function(elem, idx) {elem.disabled = false});
	}  		
}

//done
function ruleCommunitive(selectedele){
	document.querySelectorAll("#commutativeRule").forEach(function(elem, idx) {elem.disabled = true});
	
	if((selectedele[0].innerHTML === '-') && (selectedele[0].parentNode.previousSibling.previousSibling != null)){
		document.querySelectorAll("#commutativeRule").forEach(function(elem, idx) {elem.disabled = false});
	}else if(selectedele[0].innerHTML === '+' || selectedele[0].innerHTML === '·' || selectedele[0].innerHTML === '\u00B7'){
		document.querySelectorAll("#commutativeRule").forEach(function(elem, idx) {elem.disabled = false});
	}
}

function ruleDistributive(selectedele){
	//need to fix
	document.querySelectorAll("#distributiveRule").forEach(function(elem, idx) {elem.disabled = true});
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
						document.querySelectorAll("#distributiveRule").forEach(function(elem, idx) {elem.disabled = false});
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
						document.querySelectorAll("#distributiveRule").forEach(function(elem, idx) {elem.disabled = false});
						return;
					}
				}
			}
		}
	}
}

<!--todo-->
function ruleAddFractions(selectedele){
}

//done
function ruleDoubleNegative(selectedele){
	document.querySelectorAll("#doubleNegative").forEach(function(elem, idx) {elem.disabled = true});
	if(selectedele[0].innerHTML === '+' || selectedele[0].innerHTML === '-' ){
		document.querySelectorAll("#doubleNegative").forEach(function(elem, idx) {elem.disabled = false});
	}	
}

//done
function ruleSTMNegative(selectedele){
	document.querySelectorAll("#MultNegative").forEach(function(elem, idx) {elem.disabled = true});
	if(selectedele[0].innerHTML === '-' ){
		document.querySelectorAll("#MultNegative").forEach(function(elem, idx) {elem.disabled = false});
	}	
}

//done
function ruleMultiply(selectedele){
	document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = true});

	if((selectedele[0].innerHTML !== '·')&&(selectedele[0].innerHTML !== '\u00B7')){
		return;
	}

	if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined))
	{
		if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '1'){
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '1'){
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
		{
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
				selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
		{
			document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
		{
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}

		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(!selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent"))){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets"))){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")))
		{	
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent")){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0]))
			{
				document.querySelectorAll("#multiply").forEach(function(elem, idx) {elem.disabled = false});
			}
		}		
	}	
}

function ruleDivide(selectedele){
	//broken
	document.querySelectorAll("#divide").forEach(function(elem, idx) {elem.disabled = true});

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
	document.querySelectorAll("#divide").forEach(function(elem, idx) {elem.disabled = false});
}	

function ruleAdd(selectedele){
	//todo
	//look at tripple add situation
	document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = true});

	if(selectedele[0].innerHTML !== '+'){
		return;
	}
	if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined))
	{
		if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
		{
			document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
				selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
		{
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0]))
			{
				document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
		{
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0]))
			{
				document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild,
					    selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild)){
				document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
			if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0],
					    selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0])){
				document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply")){
			if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0],
					    selectedele[0].parentNode.nextSibling.childNodes[0])){
				document.querySelectorAll("#add").forEach(function(elem, idx) {elem.disabled = false});
			}
		}
	}
}

function ruleSubtract(selectedele){
	document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = true});

	if(selectedele[0].innerHTML !== '-'){
		return;

	}
	if((selectedele[0].parentNode.nextSibling.childNodes[0] != undefined)&&
		(selectedele[0].parentNode.previousSibling.childNodes[0] != undefined))
	{
		if(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == '0'){
			document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
		}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
		{
			document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
		}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 
				selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
		{
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0]))
			{
				document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
		{
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0]
				,selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0]))
			{
				document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
			if(isStructureEqual(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild,
					    selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild)){
				document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
			if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0],
					    selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0])){
				document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
			}
		}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply")){
			if(isStructureEqual(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0],
					    selectedele[0].parentNode.nextSibling.childNodes[0])){
				document.querySelectorAll("#subtract").forEach(function(elem, idx) {elem.disabled = false});
			}
		}
	}
}

function ruleZero(selectedele){
	document.querySelectorAll("#removezero").forEach(function(elem, idx) {elem.disabled = true});

	if((selectedele[0].innerHTML !== '-')&&(selectedele[0].innerHTML !== '+')){
		return;

	}
	if(selectedele[0].parentNode.nextSibling.childNodes[1] != undefined){
		console.log("zero 2");
				
		if(selectedele[0].parentNode.nextSibling.childNodes[1].childNodes[0].data == 0){
			document.querySelectorAll("#removezero").forEach(function(elem, idx) {elem.disabled = false});
		}
	}else if(selectedele[0].parentNode.nextSibling.childNodes[0] != undefined){
		console.log("zero 1"+selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
		if(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data == 0){
			document.querySelectorAll("#removezero").forEach(function(elem, idx) {elem.disabled = false});
		}
	}

}

/************************
 *actions
 *************************/
//done
function preformCommutativeRule(menu,test){
	if(!test){
		disablerules();
	}
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);

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
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

function preformDistributiveRule(menu,test){
	if(!test){
		disablerules();
	}
	
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
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
	if(!test){
		checkfinishgame(menu);
	}
}

//need to test in testlist
function preformRemoveBrackets(menu,test){
	if(!test){
		disablerules();
	}

	let selectedele = document.querySelectorAll("#"+menu+" #"+selected);
	let inside = selectedele[0].parentNode.nextSibling.childNodes[0];
	let top = selectedele[0].parentNode.parentNode.parentNode.parentNode;
	if(inside.nodeName == "SPAN"){
		while (top.firstChild) {
    			top.removeChild(top.lastChild);
  		}
		top.appendChild(inside);
	//
	}else if((inside.classList.contains("gamePlusMinus"))&&(top.parentNode.parentNode.classList.contains("gamePlusMinus"))){
		while(inside.childNodes[0].childNodes.length > 0){
			top.parentNode.insertBefore(inside.childNodes[0].childNodes[0],top);
		}
		top.parentNode.removeChild(top);
	//deal with inside is multiply and outside is multiply
	}else if((inside.classList.contains("gameMultiply"))&&(top.parentNode.parentNode.classList.contains("gameMultiply"))){
		while(inside.childNodes[0].childNodes.length > 0){
			top.parentNode.insertBefore(inside.childNodes[0].childNodes[0],top);
		}
		top.parentNode.removeChild(top);
	//deal with if we are a multiply and we are contained in something else
	}else if(inside.classList.contains("gameMultiply")){
		while (top.firstChild) {
    			top.removeChild(top.lastChild);
  		}
		top.appendChild(inside);
	}
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//make more tests in testlist
function preformMultiply(menu,test){
	if(!test){
		disablerules();
	}
	//leaves behind a td
	let selectedele = document.querySelectorAll("#"+menu+" #"+selected);
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
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
	{
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
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
	{
		let node = selectedele[0].parentNode.nextSibling.childNodes[0];
		let nodesquared = createTd(createExponent(menu,createGameSpan(menu,'2',test),node,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
	//deal with two multiplied functions
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
	{
		let node = selectedele[0].parentNode.nextSibling.childNodes[0];
		let nodesquared = createTd(createExponent(menu,createGameSpan(menu,'2',test),node,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
	//deal with function multiplied with same base exponent on the right
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
			&&(!selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")))
	{
		let node = selectedele[0].parentNode.nextSibling;
		let nodesquared = createTd(createExponent(menu,createGameSpan(menu,'2',test),node,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
	//deal with function multiplied with same base exponent on the left
	}else if((!selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
	{
		let node = selectedele[0].parentNode.nextSibling;
		let nodesquared = createTd(createExponent(menu,createGameSpan(menu,'2',test),node,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.replaceChild(nodesquared,selectedele[0].parentNode);
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent"))
			&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")))
	{
		//todo this might empty the multiplication element if so please remove that multiplication element
		var exponent1 = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
		var exponent2 = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
		var base = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		var exponent = createTd(createExponent(menu,createBrackets(menu,createPlusDouble(menu,exponent1,exponent2,test),test),base,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameExonent")){
		//todo this might empty the multiplication element if so please remove that multiplication element
		var exponent1 = createGameSpan(menu,'1',test);
		var exponent2 = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
		var base = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		var exponent = createTd(createExponent(menu,createBrackets(menu,createPlusDouble(menu,exponent2,exponent1,test),test),base,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameExonent")){
		//todo this might empty the multiplication element if so please remove that multiplication element
		var exponent1 = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
		var exponent2 = createGameSpan(menu,'1',test);
		var base = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		var exponent = createTd(createExponent(menu,createBrackets(menu,createPlusDouble(menu,exponent1,exponent2,test),test),base,test));
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.replaceChild(exponent,selectedele[0].parentNode);
	}

	//used to remove mulitply tables in the dom that are empty

	if(savedparent.childNodes.length == 1){
		savedparent.parentNode.parentNode.replaceChild(savedparent.childNodes[0].childNodes[0],savedparent.parentNode);
	}

	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//need to build
function preformDivide(menu,test){
	if(!test){
		disablerules();
	}
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
	
	if((!isNaN(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data)))
	{
		var num1 = Number(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].innerHTML);
		var num2 = Number(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].textContent);
		var result = num2 / num1;
		selectedele[0].parentNode.parentNode.parentNode.parentNode.appendChild(createGameSpan(menu,result,test));
		selectedele[0].parentNode.parentNode.parentNode.parentNode.removeChild(
		selectedele[0].parentNode.parentNode.parentNode.parentNode.firstChild);
	}else if((isNaN(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data))
			&&(isNaN(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data))
			&&(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data == 
				selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data)
			&&(selectedele[0].parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].data !== undefined)
			&&(selectedele[0].parentNode.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].data !== undefined))
	{
		selectedele[0].parentNode.parentNode.parentNode.parentNode.appendChild(createGameSpan(menu,"1",test));
		selectedele[0].parentNode.parentNode.parentNode.parentNode.removeChild(
		selectedele[0].parentNode.parentNode.parentNode.parentNode.firstChild);
	}
	/*
	if(isDescendant(document.getElementById("leftdiv"),selectedele)){
	    increaseleft -= 3;
	    changeAllBrackets("leftdiv");
        }else{
	    increaseright -= 3;
            changeAllBrackets("rightdiv");
        } 
	*/
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

function changeAllBrackets(parentname){
	console.log(parentname);
	var parentNode = document.getElementById(parentname);
	for(var i=0; i < index; i++) {
		var bracket = document.querySelectorAll("#bracket"+i);
		for(var j=0; j < bracket.length;j++){
			if(bracket[j] != null){
				if(isDescendant(parentNode,bracket[j])){
					var value = bracket[j].style.transform.match(new RegExp(",(.*)\\)"));
					value = Number(value[1]) - 3;
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

//done
function preformAdd(menu,test){
	if(!test){
		disablerules();
	}

	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
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
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
	{
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
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
	{
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '0';
			
		}else{
			let next = createTd(createMultiply(menu,'2',selectedele[0].parentNode.nextSibling.childNodes[0],test));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);			
		}
	}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
		let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,createGameSpan(menu,'1',test),leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,leftTable,createGameSpan(menu,'1',test),test),test),focus,test));
			
		}

		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);

	}else if((isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))){
		//todo
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,rightTable,createGameSpan(menu,'1',test),test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,createGameSpan(menu,'1',test),rightTable,test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);

	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
	{
		//add two brackets
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.insertBefore(createTd(createGameSpan('0')),selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling.nextSibling);
		}else{
			let next = createTd(createMultiply(menu,'2',selectedele[0].parentNode.nextSibling.childNodes[0],test));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);		
		}
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
		//add two multiplies
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		
		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,rightTable,leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,leftTable,rightTable,test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
		//add two functions where the right is multiplied with a number
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,rightTable,createGameSpan(menu,'1',test),test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(meun,createBrackets(menu,createPlusDouble(menu,createGameSpan(menu,'1',test),rightTable,test),teset),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply")){
		//add two functions where the left is multiplied with a number
		let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			//selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,createGameSpan(menu,'1',test),leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,leftTable,createGameSpan(menu,'1',test),test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	//deal with added fractions
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
		let left = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		let right = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		let newvalue;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			newvalue = createBrackets(menu,createPlusDouble(menu,createMultiply(menu,'-1',left,test),right,test),test);
		}else{
			newvalue = createBrackets(menu,createPlusDouble(menu,left,right,test),test);
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
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//todo need to test
function preformSubtract(menu,test){
	if(!test){
		disablerules();
	}
	//todo designed to work with plus. must make work with subtraction


	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
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
			let num = createTd(createMultiply(menu,'-1',selectedele[0].parentNode.nextSibling.childNodes[0],test));
			selectedele[0].parentNode.parentNode.appendChild(num);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}else{
			let num = -1 * Number(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data);
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = num;
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
		}
	}else if((!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
			&&(!isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data)))
	{
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
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined))
	{
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '0';
			
		}else{
			let next = createTd(createGameSpan(menu,'0',test));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);		
		}
	}else if((isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
		let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,createGameSpan(menu,'1',test),leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,leftTable,createGameSpan(menu,'1',test),test),test),focus,test));
			
		}

		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);

	}else if((isNaN(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].data !== undefined)
		&&(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))){
		//todo
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '-';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,rightTable,createGameSpan(menu,'1',test),test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,createGameSpan(menu,'1',test),rightTable,test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameBrackets"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameBrackets")))
	{
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.insertBefore(createTd(createGameSpan(menu,'0',test)),selectedele[0].parentNode.nextSibling);
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling.nextSibling);
		}else{
			let next = createTd(createMultiply(menu,'2',selectedele[0].parentNode.nextSibling,test));
			selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
			selectedele[0].parentNode.parentNode.replaceChild(next,selectedele[0].parentNode);		
		}
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply"))){
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0]
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}
		
		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '-';
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,rightTable,leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,leftTable,rightTable,test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
		let focus = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
		let rightlist = []
		for(let i = 0; i < selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			rightlist.push(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let rightTable;
		if(rightlist.length > 1){
			rightTable = document.createElement("table");
			rightTable.classList.add("gameMultiply");
			let righttr = document.createElement("tr");
			rightTable.appendChild(righttr);
			for(let i = 0; i < rightlist.length;i++){
				righttr.appendChild(rightlist[i]);
			}
		}else{
			rightTable = rightlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			mult = createTd(createMultiplyDouble(createBrackets(createSubtractionDouble(rightTable,createGameSpan('1'))),focus));
		}else{
			mult = createTd(createMultiplyDouble(createBrackets(createPlusDouble(createGameSpan('1'),rightTable)),focus));
			
		}
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameMultiply")){
		let focus = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].lastChild.childNodes[0];
		let leftlist = []
		for(let i = 0; i < selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes.length - 2; i++){
			leftlist.push(selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[i]);
		}

		let leftTable;
		if(leftlist.length > 1){
			leftTable = document.createElement("table");
			leftTable.classList.add("gameMultiply");
			let lefttr = document.createElement("tr");
			leftTable.appendChild(lefttr);
			for(let i = 0; i < leftlist.length;i++){
				leftlist[i].remove();
				lefttr.appendChild(leftlist[i]);
			}
		}else{
			leftTable = leftlist[0].childNodes[0];
		}

		let mult;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createSubtractionDouble(menu,createGameSpan(menu,'1',test),leftTable,test),test),focus,test));
		}else{
			mult = createTd(createMultiplyDouble(menu,createBrackets(menu,createPlusDouble(menu,leftTable,createGameSpan(menu,'1',test),test),test),focus,test));
			
		}
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.previousSibling);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode);
		selectedele[0].parentNode.parentNode.removeChild(selectedele[0].parentNode);
	}else if((selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameDivide"))
		&&(selectedele[0].parentNode.previousSibling.childNodes[0].classList.contains("gameDivide"))){
		let left = selectedele[0].parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		let right = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		let newvalue;
		if((selectedele[0].parentNode.previousSibling.previousSibling != null)
			&&(selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data == '-'))
		{
			selectedele[0].parentNode.previousSibling.previousSibling.childNodes[0].childNodes[0].data = '+';
			newvalue = createBrackets(menu,createSubtractionDouble(menu,createMultiply(menu,'-1',left,test),right,test),test);
		}else{
			newvalue = createBrackets(menu,createSubtractionDouble(menu,left,right,test),test);
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
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//done
function preformDoubleNegative(menu,test){
	if(!test){
		disablerules();
	}
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
	if(selectedele[0].innerHTML === '-'){
		selectedele[0].innerHTML = '+';
	}else if(selectedele[0].innerHTML === '+'){
		selectedele[0].innerHTML = '-';
	}

	if(!isNaN(selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data))
	{
		//if number then change that number to negative
		let num = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data;
		if(num.startsWith('-')){
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = num.substring(1);
		}else{
			selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].data = '-'+num;
		}
	}else if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
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
		selectedele[0].parentNode.parentNode.insertBefore(selectedele[0].parentNode,mult);
	}	
	
	clearselection(selectedele);
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//done
function performMultiNegative(menu,test){
	if(!test){
		disablerules();
	}
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);

	selectedele[0].innerHTML = '+'
	if(selectedele[0].parentNode.nextSibling.childNodes[0].classList.contains("gameMultiply")){
		//todo same as in double negative. make into one function.
		let mult = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0];
		let first = selectedele[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0];
		let newnum = createTd(createGameSpan('-1'));
		let newmult = createTd(createGameSpan('\u00B7'));
		mult.insertBefore(newmult,first)
		mult.insertBefore(newnum,newmult)
	}else{
		let mult = createMultiply('-1',selectedele[0].parentNode.nextSibling);
		selectedele[0].parentNode.parentNode.insertBefore(mult,selectedele[0].parentNode.nextSibling);
	}

	clearselection(selectedele);
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
	}
}

//todo need to test
function preformRemoveZero(menu,test){
	if(!test){
		disablerules();
	}
	var selectedele = document.querySelectorAll("#"+menu+" #"+selected);
	selectedele[0].parentNode.nextSibling.remove();
	selectedele[0].parentNode.remove();
	selected = undefined;
	if(!test){
		checkfinishgame(menu);
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

function checkfinishgame(menu){
	if(leftSideValue != rightSideValue){
		return;
	}
	var rightdiv = document.querySelector("#"+menu+" #rightdiv");
	var leftdiv = document.querySelector("#"+menu+" #leftdiv");

	var rightendvalue;
	if(rightdiv.childNodes.length == 1){
		if(rightdiv.childNodes[0].childNodes.length == 1){
			rightendvalue = rightdiv.childNodes[0].childNodes[0].data;
		}else{
			return;
		}
	}else{
		return;
	}
	var leftendvalue;
	if(leftdiv.childNodes.length == 1){
		if(leftdiv.childNodes[0].childNodes.length == 1){
			leftendvalue = leftdiv.childNodes[0].childNodes[0].data;
		}else{
			return;
		}
	}else{
		return;
	}
	console.log(rightendvalue);
	console.log(leftendvalue);
	if((rightendvalue == 'x')&&(!isNaN(leftendvalue))){
		menuState = 1;
		nextMenu = "Finish";
		return;
	}
	if((leftendvalue == 'x')&&(!isNaN(rightendvalue))){
		menuState = 1;
		nextMenu = "Finish";
		return;
	}
}