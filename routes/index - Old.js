var express = require('express');
var router = express.Router();
const querystring = require("querystring");
//const mysql = require('mysql');
const { Pool, Client } = require('pg');
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
const db = new Client(databaseConnection);

db.connect();

/******************************
create tables
*******************************/


//create extension "uuid-ossp";


const queryCreateUserTable = `
CREATE TABLE IF NOT EXISTS users (
    email varchar,
    userName varchar,
    password varchar,
    creationDate Date,
    premium boolean,
    PRIMARY KEY(userName)
);
`;
const queryCreatePromoTable = `
CREATE TABLE IF NOT EXISTS promo (
    code varchar,
    userName varchar,
    PRIMARY KEY(userName)
);
`;

const queryCreateLessonsTable = `
CREATE TABLE IF NOT EXISTS lessons (
    userName varchar,
    lesson varchar,
    CONSTRAINT fk_user_lesson
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateChallengeTable = `
CREATE TABLE IF NOT EXISTS challenges (
    userName varchar,
    challenge varchar,
    equation varchar,
    result boolean,
    whentime timestamp without time zone,
    CONSTRAINT fk_user_challenges
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateEquationTable = `
CREATE TABLE IF NOT EXISTS equation (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    userName varchar,
    equationname varchar,
    equation varchar,
    CONSTRAINT fk_user_equation
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateScoreTable = `
CREATE TABLE IF NOT EXISTS score (
    userName varchar,
    score int,
    CONSTRAINT fk_user_score
      FOREIGN KEY(userName) 
	  REFERENCES users(userName)
);
`;

const queryCreateMatchHistoryTable =`
CREATE TABLE IF NOT EXISTS history (
	playerName varchar,
	opponentName varchar,
	playerEquation varchar,
	opponentEquation varchar,
	gameMode varchar,
	result varchar,
	whentime timestamp without time zone,
	CONSTRAINT fk_user_player
          FOREIGN KEY(playerName) 
	    REFERENCES users(userName),
        CONSTRAINT fk_user_opponent
          FOREIGN KEY(opponentName) 
	    REFERENCES users(userName)
);
`;

/******************************
sql queries
*******************************/

const userExistsQuery = 'Select userName from users where userName = $1';
const userLoginQuery = 'Select userName from users where userName = $1 and password = $2';
const userAllLessonQuery = 'Select lesson from lessons where userName = $1';
const userLessonQuery = 'Select lesson from lessons where userName = $1 and lesson = $2';
const userChallengeQuery = 'Select challenge,equation,result,when from challenges where userName = $1 order by when decending';
const userEquationQuery = 'Select equationname,equation,id from equation where userName = $1';
 
const createUserInsert = 'Insert into users(email,userName,password) values ($1,$2,$3)';
const LessonInsert = 'Insert into lessons(userName,lesson) values ($1,$2)';
const challengeInsert = 'Insert into challenges(userName,challenge,equation,result,when) values($1,$2,$3,$4,$5)';
const equationInsert = 'Insert into equation(userName,equationname,equation) values($1,$2,$3) RETURNING id';

const equationUpdate = 'Update equation set equationname = $1, equation = $2 where userName = $3 and id = $4';

const equationDelete = 'Delete from equation where userName = $1 and id = $2';
/******************************
init database
*******************************/

try {
    db.query(queryCreateUserTable);
    db.query(queryCreateLessonsTable);
    db.query(queryCreateChallengeTable);
    db.query(queryCreateEquationTable);
    db.query(queryCreateScoreTable);
    db.query(queryCreateMatchHistoryTable);
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

router.post('/test',function(req, res, next){
	res.end("this is a test");
})

router.get('/mathematician',function(req, res, next) {
  if (req.session.user) {
	//todo get info to render page
	
	//todo account data 
	let data = {};


	//todo get lesson list
	let lessons = [];
	db.query(userAllLessonQuery,[req.session.user.trim()],(err, result)=>{
		if(err){
			console.log('db error loading lessons');
			console.log(err);
		}else{
			for(let i = 0; i < result.rows.length; i++){	
				lessons.push(result.rows[i].lesson);
			}
			let equations = [];
			db.query(userEquationQuery,[req.session.user.trim()],(err, result)=>{
					if(err){
						console.log('db error loading equations');
						console.log(err);
					}else{
						for(let i = 0; i < result.rows.length; i++){	
							equations.push({id: result.rows[i].id, eq: result.rows[i].equation,name: result.rows[i].equationname});
						}

						//todo get score graph
						let scoregraphlist = [{index:1,user:'test'},{index:2,user:'test1'},{index:3,user:'test2'},{index:4,user:'test3'}];
  						res.render('Menu',{ accountdata: data, lessonlist: lessons, equationlist: equations, scoregraph: scoregraphlist });
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

  db.query(userExistsQuery,[req.body.username.trim()],(err, result)=>{
		if(err != null){
			console.log(err);
			let responsevalue = {'message': "<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
			return;
		}else if(result.rows.length == 0){
			let input = [
				req.body.email.trim(),
				req.body.username.trim(),
				req.body.password.trim().hashCode()
			];
			db.query(createUserInsert,input,(err, result)=>{
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
  console.log("login test2 "+ req.body.username.trim()+" "+req.body.password.trim().hashCode());
  console.log(db);
  try{
  db.query(userLoginQuery,[req.body.username.trim(),req.body.password.trim().hashCode()],(err, result)=>{
	console.log("login test3");
	if(err){
		let responsevalue = {'message':"<font color='red'>Database error</font>"};
		console.log("login db error");
		console.log(err);
		res.end(JSON.stringify(responsevalue));
	}else if(result.rows.length == 0){
		console.log("login no user");
		let responsevalue = {'message':"<font color='red'>No match found for username and password combination</font>"};
		res.end(JSON.stringify(responsevalue));
	}else{
		console.log("session created");
		let uuid = uuidv4();
		req.session.sessionID = uuid;
		req.session.user = result.rows[0].username;
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
  	db.query(userLessonQuery,[req.session.user.trim(),req.body.lesson.trim()],(err, result)=>{
		if(err){
			console.log(err);
			let responsevalue = {'message':"<font color='red'>Database error</font>"};
			res.end(JSON.stringify(responsevalue));
		}else if(result.rows.length == 0){
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
	db.query(challengeInsert,[req.session.user.trim(),req.body.challenge.trim(),req.body.equation.trim(),req.body.result.trim(),now],(err, result)=>{
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
	console.log(req);
	if(typeof req.body.delete !== "undefined"){
		db.query(equationDelete,[req.session.user.trim(),req.body.id.trim()],(err, result)=>{
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
		db.query(equationUpdate,[req.body.equationname.trim(),req.body.equation.trim(),req.session.user.trim(),req.body.id],(err, result)=>{
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
		db.query(equationInsert,[req.session.user.trim(),req.body.equationname.trim(),req.body.equation.trim()],(err, result)=>{
			if(err){
				console.log(err);
				let responsevalue = {'message':"<font color='red'>Database error</font>"};
				res.end(JSON.stringify(responsevalue));
			}else{

				console.log(result);
    				let responsevalue = {'message': "<font color='green'>Equation saved</font>",'newid':result.rows[0].id};
    				res.end(JSON.stringify(responsevalue));
			}
		});
	}
  }else{
    let responsevalue = {'message': "<font color='red'>Error: Not logged in.</font>"};
    res.end(JSON.stringify(responsevalue));
  }
});

module.exports = router;