/*
* generate procedural algorithm
*/
function proceduralEquation(){
	generateAdditiveLinearEquation();
}

function generateLinearEquation(){

}

function generateLinearEquation(){

}

function generateAdditiveLinearEquation(){
   var left = document.getElementById("leftdiv");
   var right = document.getElementById("rightdiv");
   var leftex = document.getElementById("leftex");
   var rightex = document.getElementById("rightex");
   var flip =  Math.floor(Math.random() * (2));
   console.log(flip);
   if(flip == 0){
        var valuea = Math.floor(Math.random() * (100 + 100 + 1)) - 100;

	var lefttable = document.createElement("table");
	var lefttr = document.createElement("tr");
	lefttable.appendChild(lefttr);
	var lefttd = document.createElement("td");
	var leftelement = document.createElement("span");
    	var leftt = document.createTextNode(valuea);
	leftelement.appendChild(leftt);
	lefttd.appendChild(leftelement);
	lefttr.appendChild(lefttd)
	left.appendChild(lefttable);
	left.removeChild(left.childNodes[0]);


	var lefttable = document.createElement("table");
	var lefttr = document.createElement("tr");
	lefttable.appendChild(lefttr);
	var lefttd = document.createElement("td");
	var leftelement = document.createElement("span");
    	var leftt = document.createTextNode(valuea);
	leftelement.appendChild(leftt);
	lefttd.appendChild(leftelement);
	lefttr.appendChild(lefttd)
	leftex.appendChild(lefttable);

	leftSideValue += valuea;
	var valueb = Math.floor(Math.random() * (100 + 100 + 1)) - 100;

	var righttable = document.createElement("table");
	var righttr = document.createElement("tr");
	righttable.appendChild(righttr);
	var righttd1 = document.createElement("td");
	var rightspan1 = document.createElement("span");
	var rightt1 = document.createTextNode("x");
	rightspan1.appendChild(rightt1);
	righttd1.appendChild(rightspan1);
	righttr.appendChild(righttd1);
	var righttd2 = document.createElement("td");
	var rightspan2 = document.createElement("span");
	rightspan2.setAttribute("id","item"+index);
	rightspan2.setAttribute("onclick","select(\"item"+index+"\")");
	var rightt2 = document.createTextNode("+");
	rightspan2.appendChild(rightt2);
	righttd2.appendChild(rightspan2);
	righttr.appendChild(righttd2);
	var righttd3 = document.createElement("td");
	var rightspan3 = document.createElement("span");
	var rightt3 = document.createTextNode(valueb);
	rightspan3.appendChild(rightt3);
	righttd3.appendChild(rightspan3);
	righttr.appendChild(righttd3);
	right.appendChild(righttable);
	right.removeChild(right.childNodes[0]);

	var righttable = document.createElement("table");
	var righttr = document.createElement("tr");
	righttable.appendChild(righttr);
	var righttd1 = document.createElement("td");
	var rightspan1 = document.createElement("span");
	var rightt1 = document.createTextNode("x");
	rightspan1.appendChild(rightt1);
	righttd1.appendChild(rightspan1);
	righttr.appendChild(righttd1);
	var righttd2 = document.createElement("td");
	var rightspan2 = document.createElement("span");
	var rightt2 = document.createTextNode("+");
	rightspan2.appendChild(rightt2);
	righttd2.appendChild(rightspan2);
	righttr.appendChild(righttd2);
	var righttd3 = document.createElement("td");
	var rightspan3 = document.createElement("span");
	var rightt3 = document.createTextNode(valueb);
	rightspan3.appendChild(rightt3);
	righttd3.appendChild(rightspan3);
	righttr.appendChild(righttd3);
	rightex.appendChild(righttable);

	index ++;
	rightSideValue += valueb;
	rightSideValue += valuea - valueb;
   }else{
        var valuea = Math.floor(Math.random() * (100 + 100 + 1)) - 100;

	var righttable = document.createElement("table");
	var righttr = document.createElement("tr");
	righttable.appendChild(righttr);
	var righttd = document.createElement("td");
	var rightelement = document.createElement("span");
    	var rightt = document.createTextNode(valuea);
	rightelement.appendChild(rightt);
	righttd.appendChild(rightelement);
	righttr.appendChild(righttd)
	right.appendChild(righttable);
	right.removeChild(right.childNodes[0]);

	var righttable = document.createElement("table");
	var righttr = document.createElement("tr");
	righttable.appendChild(righttr);
	var righttd = document.createElement("td");
	var rightelement = document.createElement("span");
    	var rightt = document.createTextNode(valuea);
	rightelement.appendChild(rightt);
	righttd.appendChild(rightelement);
	righttr.appendChild(righttd)
	rightex.appendChild(righttable);

	rightSideValue += valuea;
	var valueb = Math.floor(Math.random() * (100 + 100 + 1)) - 100;

	var lefttable = document.createElement("table");
	var lefttr = document.createElement("tr");
	lefttable.appendChild(lefttr);
	var lefttd1 = document.createElement("td");
	var leftspan1 = document.createElement("span");
	var leftt1 = document.createTextNode("x");
	leftspan1.appendChild(leftt1);
	lefttd1.appendChild(leftspan1);
	lefttr.appendChild(lefttd1);
	var lefttd2 = document.createElement("td");
	var leftspan2 = document.createElement("span");
	leftspan2.setAttribute("id","item"+index);
	leftspan2.setAttribute("onclick","select(\"item"+index+"\")");
	var leftt2 = document.createTextNode("+");
	leftspan2.appendChild(leftt2);
	lefttd2.appendChild(leftspan2);
	lefttr.appendChild(lefttd2);
	var lefttd3 = document.createElement("td");
	var leftspan3 = document.createElement("span");
	var leftt3 = document.createTextNode(valueb);
	leftspan3.appendChild(leftt3);
	lefttd3.appendChild(leftspan3);
	lefttr.appendChild(lefttd3);
	left.appendChild(lefttable);
	left.removeChild(left.childNodes[0]);

	var lefttable = document.createElement("table");
	var lefttr = document.createElement("tr");
	lefttable.appendChild(lefttr);
	var lefttd1 = document.createElement("td");
	var leftspan1 = document.createElement("span");
	var leftt1 = document.createTextNode("x");
	leftspan1.appendChild(leftt1);
	lefttd1.appendChild(leftspan1);
	lefttr.appendChild(lefttd1);
	var lefttd2 = document.createElement("td");
	var leftspan2 = document.createElement("span");
	var leftt2 = document.createTextNode("+");
	leftspan2.appendChild(leftt2);
	lefttd2.appendChild(leftspan2);
	lefttr.appendChild(lefttd2);
	var lefttd3 = document.createElement("td");
	var leftspan3 = document.createElement("span");
	var leftt3 = document.createTextNode(valueb);
	leftspan3.appendChild(leftt3);
	lefttd3.appendChild(leftspan3);
	lefttr.appendChild(lefttd3);
	leftex.appendChild(lefttable);

	index ++;
	leftSideValue += valueb;
	leftSideValue += valuea - valueb;
   }
   console.log("left value: "+leftSideValue);
   console.log("right value: "+rightSideValue);
}