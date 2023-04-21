var express = require('express');
var router = express.Router();
const querystring = require("querystring");
const mysql = require('mysql');
const { v4: uuidv4 } = require("uuid");
const modeData = require('../lib/mode.js');
const databaseConnection = require('../lib/database.js');

/******************************
helpers
*******************************/

//creates a simple hash from string
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/******************************
database
*******************************/
const db = mysql.createPool(databaseConnection);

db.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});

/******************************
create tables
*******************************/


//create extension "uuid-ossp";


const queryCreateUserTable = `
CREATE TABLE IF NOT EXISTS users (
    userName varchar(500) primary key,
    password varchar(500) not null,
    email varchar(500) not null,
    creationDate DATE NOT NULL DEFAULT(CURRENT_DATE),
    premium boolean
);
`;

const queryCreatePromoTable = `
CREATE TABLE IF NOT EXISTS promo (
    code varchar(500) not null,
    userName varchar(500) not null,
    CONSTRAINT fk_user_promo
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateLessonsTable = `
CREATE TABLE IF NOT EXISTS lessons (
    userName varchar(500),
    lesson varchar(100),
    CONSTRAINT fk_user_lesson
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateChallengeTable = `
CREATE TABLE IF NOT EXISTS challenges (
    userName varchar(500),
    challenge varchar(100),
    equation varchar(500),
    result boolean,
    whentime DATE NOT NULL DEFAULT(CURRENT_DATE),
    CONSTRAINT fk_user_challenges
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateEquationTable = `
CREATE TABLE IF NOT EXISTS equation (
    id BINARY(16) NOT NULL primary key,
    userName varchar(500),
    equationname varchar(500),
    equation varchar(500),
    CONSTRAINT fk_user_equation
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateScoreTable = `
CREATE TABLE IF NOT EXISTS score (
    userName varchar(500),
    score int,
    CONSTRAINT fk_user_score
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryDeleteEquationDefaultTrigger = `
DROP TRIGGER IF EXISTS equation_uuiddefault;
`;

const queryCreateEquationDefaultTrigger = `
CREATE TRIGGER equation_uuiddefault
BEFORE INSERT ON equation
FOR EACH ROW
SET NEW.id = UUID_TO_BIN(UUID());
`;

const queryDeleteEquationTrigger = `
DROP TRIGGER IF EXISTS equation_uuidtable;
`;

const queryCreateEquationTrigger = `
CREATE TRIGGER equation_uuidtable
AFTER INSERT ON equation
FOR EACH ROW
SET @last_uuid = NEW.id;
`;

const queryCreateMatchHistoryTable =`
CREATE TABLE IF NOT EXISTS history (
	playerName varchar(500),
	opponentName varchar(500),
	playerEquation varchar(500),
	opponentEquation varchar(500),
	gameMode varchar(100),
	result varchar(100),
	whentime DATE NOT NULL DEFAULT(CURRENT_DATE),
	CONSTRAINT fk_user_player
          FOREIGN KEY(playerName) 
	    REFERENCES users(userName),
        CONSTRAINT fk_user_opponent
          FOREIGN KEY(opponentName) 
	    REFERENCES users(userName)
);
`;

const queryCreateFunctionUtoB = `
  CREATE FUNCTION IF NOT EXISTS UUID_TO_BIN(_uuid BINARY(36))
        RETURNS BINARY(16)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
    RETURN
        UNHEX(CONCAT(
            SUBSTR(_uuid, 15, 4),
            SUBSTR(_uuid, 10, 4),
            SUBSTR(_uuid,  1, 8),
            SUBSTR(_uuid, 20, 4),
            SUBSTR(_uuid, 25) ));
`;

const queryCreateFunctionBtoU = `
    CREATE FUNCTION IF NOT EXISTS BIN_TO_UUID(_bin BINARY(16))
        RETURNS BINARY(36)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
    RETURN
        LCASE(CONCAT_WS('-',
            HEX(SUBSTR(_bin,  5, 4)),
            HEX(SUBSTR(_bin,  3, 2)),
            HEX(SUBSTR(_bin,  1, 2)),
            HEX(SUBSTR(_bin,  9, 2)),
            HEX(SUBSTR(_bin, 11))
                 ));
`;

/******************************
sql queries
*******************************/

const userExistsQuery = 'Select userName from users where userName = ?';
const userLoginQuery = 'Select userName from users where userName = ? and password = ?';
const userAllLessonQuery = 'Select lesson from lessons where userName = ?';
const userLessonQuery = 'Select lesson from lessons where userName = ? and lesson = ?';
const userChallengeQuery = 'Select challenge,equation,result,when from challenges where userName = ? order by when decending';
const userEquationQuery = 'Select equationname,equation,id from equation where userName = ?';
 
const createUserInsert = 'Insert into users(email,userName,password) values (?,?,?)';
const LessonInsert = 'Insert into lessons(userName,lesson) values (?,?)';
const challengeInsert = 'Insert into challenges(userName,challenge,equation,result,when) values(?,?,?,?,?)';
const equationInsert = 'Insert into equation(userName,equationname,equation) values(?,?,?);';
const createEquationGetLast = 'select BIN_TO_UUID(@last_uuid) as uuid;';

const equationUpdate = 'Update equation set equationname = ?, equation = ? where userName = ? and id = ?';

const equationDelete = 'Delete from equation where userName = ? and id = ?';
/******************************
init database
*******************************/

try {
    db.query(queryCreateFunctionUtoB);
    db.query(queryCreateFunctionBtoU);

    db.query(queryCreateUserTable);
    db.query(queryCreateLessonsTable);
    db.query(queryCreateChallengeTable);
    db.query(queryCreateEquationTable);
    db.query(queryCreateScoreTable);
    db.query(queryCreateMatchHistoryTable);

    db.query(queryDeleteEquationDefaultTrigger);
    db.query(queryCreateEquationDefaultTrigger);
    db.query(queryDeleteEquationTrigger);
    db.query(queryCreateEquationTrigger);

    console.log('Tables are successfully created');
} catch (err) {
    console.log(err);
}

/******************************
new users
*******************************/

let tempUserID = [];

function tempUserIDExists(testID){
	for(let i = 0; i < tempUserID.length; i++){
		if(tempUserID[i].uuid == testID){
			return true
		}
	}
	return false;
}

/******************************
routes
*******************************/

router.get('/', function(req, res, next) {
  if (req.session.user) {
  	res.redirect('mathematician');
  }else{
	res.render('Login',{url: req.hostname, mode: modeData});
  }
});

router.get('/mathematician',function(req, res, next) {
  if (req.session.user) {
	//todo get info to render page
	
	//todo account data 
	let data = {};


	//todo get lesson list
	let lessons = [];
	let query = mysql.format(userAllLessonQuery,[req.session.user.trim()]);
	db.query(query,[req.session.user.trim()],(err, result)=>{
		if(err){
			console.log('db error loading lessons');
			console.log(err);
		}else{
			for(let i = 0; i < result.length; i++){	
				lessons.push(result[i].lesson);
			}
			let equations = [];
			let query2 = mysql.format(userEquationQuery,[req.session.user.trim()]);
			db.query(query2,(err, result)=>{
					if(err){
						console.log('db error loading equations');
						console.log(err);
					}else{
						for(let i = 0; i < result.length; i++){	
							equations.push({id: result[i].id, eq: result[i].equation,name: result[i].equationname});
						}

						//todo get score graph
						let scoregraphlist = [{index:1,user:'test'},{index:2,user:'test1'},{index:3,user:'test2'},{index:4,user:'test3'}];
  						res.render('Menu',{ accountdata: data, lessonlist: lessons, equationlist: equations, scoregraph: scoregraphlist,url: req.hostname, mode: modeData});
					}
			});
		}
	});
  }else{
	res.redirect('Login');
  }
});

/******************************
routes create
*******************************/
router.get('/create',function(req, res, next) {
	res.render('Create');
});

router.post('/create', function(req, res, next) {
  if(req.body.username.trim() == ''){
	let responsevalue = {'message':"<font color='red'>User name field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.password.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Password field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.email.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Email field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }

  let query = mysql.format(userExistsQuery,[req.body.username.trim()]);
  db.query(query,(err, result)=>{
		if(err != null){
			console.log(err);
			let responsevalue = {'message': "<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
			return;
		}else if(result.length == 0){
			let input = [
				req.body.email.trim(),
				req.body.username.trim(),
				req.body.password.trim().hashCode()
			];
			let query2 = mysql.format(createUserInsert,input);
			db.query(query2,(err, result)=>{
				if(err == null){
					let responsevalue = {
						'message':"<font color='green'>User succesfully created</font>"
					};
					res.end(JSON.stringify(responsevalue));
				}else{
					let responsevalue = {
						'message':"<font color='red'>Database error</font>"
					}
					res.end(JSON.stringify(responsevalue));
				}
			});	
		}else{
			let responsevalue = {
				'message':"<font color='red'>Username already exists</font>"
			};
			res.end(JSON.stringify(responsevalue));
		}
  });
});
/******************************
routes forgot
*******************************/
//todo this doesnt have a working page and the system isnt set up yet.
router.get('/forgot',function(req, res, next) {
	res.render('Forgot');
});

/******************************
routes login
*******************************/
router.get('/login', function(req, res, next) {
  if (req.session.user) {
  	res.redirect('mathematician');
  }else{
	res.render('Login',{url: req.hostname,mode: modeData});
  }
});

router.post('/login', function(req, res, next) {
  console.log("login test");
  if(req.body.username.trim() == ''){
	let responsevalue = {'message':"<font color='red'>User name field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }
  if(req.body.password.trim() == ''){
	let responsevalue = {'message':"<font color='red'>Password field empty.</font>"}
	res.end(JSON.stringify(responsevalue));
	return;
  }

  try{
  let query = mysql.format(userLoginQuery,[req.body.username.trim(),req.body.password.trim().hashCode()]);
  db.query(query,(err, result)=>{
	if(err){
		let responsevalue = {'message':"<font color='red'>Database error</font>"};
		console.log("login db error");
		console.log(err);
		res.end(JSON.stringify(responsevalue));
	}else if(result.length == 0){
		console.log("login no user");
		let responsevalue = {'message':"<font color='red'>No match found for username and password combination</font>"};
		res.end(JSON.stringify(responsevalue));
	}else{
		console.log("session created");
		let uuid = uuidv4();
		req.session.sessionID = uuid;
		req.session.user = result[0].userName;
    		req.session.save(function (err) {
      			if (err) return next(err)
			console.log("saved");
			let responsevalue = {
				'session': req.session.sessionID,
				'username': req.session.user,
				'message':"<font color='green'>Login succesfull</font>"
			};
			res.end(JSON.stringify(responsevalue));
    		});

	}
  });
  }catch(err){
	  console.log(err);
	  let responsevalue = {'message':"<font color='red'>Database error</font>"};
	  res.end(JSON.stringify(responsevalue));
  }
});

/******************************
routes logout
*******************************/
router.get('/logout', function(req, res, next) {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
	  console.log("logout error");
      } else {
          console.log("logout succesful");
      }
    });
  }

  res.render('Logout');
});

router.post('/logout',function(req, res, next) { 
  console.log("logout");
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
	  let responsevalue = {'message': "<font color='red'>Unable to log out</font>"};
	  res.end(JSON.stringify(responsevalue));
      } else {
          let responsevalue = {'message': "<font color='green'>Logout succesfull</font>"};
  	  res.end(JSON.stringify(responsevalue));
      }
    });
  } else {
    let responsevalue = {'message': "<font color='green'>Logout succesfull</font>"};
    res.end(JSON.stringify(responsevalue));
  }

});

/******************************
change log
*******************************/

router.get('/changelog', function(req, res, next) {
  res.render('ChangeLog');
});

/******************************
lesson
*******************************/
router.post('/lesson', function(req, res, next) {
  if (req.session.user) {
	let query = mysql.format(userLessonQuery,[req.session.user.trim(),req.body.lesson.trim()]);
  	db.query(query,(err, result)=>{
		if(err){
			console.log(err);
			let responsevalue = {'message':"<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
		}else if(result.length == 0){
			  	db.query(LessonInsert,[req.session.user.trim(),req.body.lesson.trim()],(err, result)=>{
					if(err){
						console.log(err);
						let responsevalue = {'message':"<font color='red'>Database error</font>"};
						res.end(JSON.stringify(responsevalue));
					}else{
    						let responsevalue = {'message': "<font color='green'>Lesson saved</font>"};
    						res.end(JSON.stringify(responsevalue));
					}
				});
		}else{
    			let responsevalue = {'message': "<font color='green'>Lesson already saved</font>"};
    			res.end(JSON.stringify(responsevalue));
		}
	});
  }else{
    let responsevalue = {'message': "<font color='red'>Error: Not logged in.</font>"};
    res.end(JSON.stringify(responsevalue));
  }
});

router.post('/challenge', function(req, res, next) {
  if (req.session.user) {
	let query = mysql.format(challengeInsert,[req.session.user.trim(),req.body.challenge.trim(),req.body.equation.trim(),req.body.result.trim(),now]);
	db.query(query,(err, result)=>{
		if(err){
			console.log(err);
			let responsevalue = {'message':"<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
		}else{
    			let responsevalue = {'message': "<font color='green'>Lesson saved</font>"};
    			res.end(JSON.stringify(responsevalue));
		}
	});
  }else{
    let responsevalue = {'message': "<font color='red'>Error: Not logged in.</font>"};
    res.end(JSON.stringify(responsevalue));
  }

});

/******************************
equation
*******************************/
//todo change id to uuid
router.post('/equation', function(req, res, next) {
  if (req.session.user) {
	console.log('test equation');
	if(typeof req.body.delete !== "undefined"){
		let query = mysql.format(equationDelete,[req.session.user.trim(),req.body.id.trim()]);
		db.query(query,(err, result)=>{
			if(err){
				console.log(err);
				let responsevalue = {'message':"<font color='red'>Database error</font>"};
				res.end(JSON.stringify(responsevalue));
			}else{
    				let responsevalue = {'message': "<font color='green'>Equation deleted</font>"};
    				res.end(JSON.stringify(responsevalue));
			}
		});
	}else if(typeof req.body.id !== "undefined"){
		console.log('update equation');
		let query = mysql.format(equationUpdate,[req.body.equationname.trim(),req.body.equation.trim(),req.session.user.trim(),req.body.id]);
		db.query(query,(err, result)=>{
			if(err){
				console.log(err);
				let responsevalue = {'message':"<font color='red'>Database error</font>"};
				res.end(JSON.stringify(responsevalue));
			}else{
    				let responsevalue = {'message': "<font color='green'>Equation updated</font>"};
    				res.end(JSON.stringify(responsevalue));
			}
		});
	}else{
		let query = mysql.format(equationInsert,[req.session.user.trim(),req.body.equationname.trim(),req.body.equation.trim()]);
		db.query(query,(err, result)=>{
			if(err){
				console.log(err);
				let responsevalue = {'message':"<font color='red'>Database error</font>"};
				res.end(JSON.stringify(responsevalue));
			}else{
				let query2 = mysql.format(createEquationGetLast);
				db.query(query2,(err, result)=>{
					console.log(result);
    					let responsevalue = {'message': "<font color='green'>Equation saved</font>",'newid':result[0].id};
    					res.end(JSON.stringify(responsevalue));
				});
			}
		});
	}
  }else{
    let responsevalue = {'message': "<font color='red'>Error: Not logged in.</font>"};
    res.end(JSON.stringify(responsevalue));
  }
});

module.exports = router;