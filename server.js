const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
var util = require('util');
const ws = require('ws');
const mysql = require('mysql');
const logger = require('morgan');
const session = require('express-session');
const mysqlSession = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const stateM = require('./lib/webSocketState.js');
const queueM = require('./lib/queue.js');
const metaDataM = require('./lib/metaData.js');
const modeData = require('./lib/mode.js');
const databaseConnection = require('./lib/database.js');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
/******************************
certificate
*******************************/
//todo this doesnt work. cant figure out why.
var options = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
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
helpers
*******************************/

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

var getClientIp = function(req) {
    return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
           req.client.remoteAddress;
};


function onSocketError(err) {
  console.error(err);
}
/******************************
routes
*******************************/

var indexRouter = require('./routes/index');
var testRouter = require('./routes/tests');
var wsRouter = require('./routes/multiplayer');

var app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.set('trust proxy', 1);

const sessionDBaccess = new mysqlSession(databaseConnection);

const secret = 'cat beast';
var sessionParser = session({
  secret: secret,
  store: sessionDBaccess,
  name: 'MathemagicianCookie',
  resave: true,
  saveUninitialized: false
});
app.use(sessionParser);

// view engine setup
app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: '*'
}));

app.use('/', indexRouter);
app.use('/test',testRouter);
app.use('/ws',wsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Error',{mode: modeData});
});

var connectionIndex = 0;
var connectionList = new Map();
var queue = new queueM();
const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(options,app);
const wsServer = new ws.Server({ clientTracking: false, noServer: true });
wsServer.MathemagicainConnectionList = connectionList;
wsServer.MathemagicianQueue = queue;

serverHTTP.on('upgrade', (req, socket, head) => {
  socket.on('error', onSocketError);
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    wsServer.emit('connection', socket, req);
  });
});

serverHTTPS.on('upgrade', (req, socket, head) => {
  socket.on('error', onSocketError);
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    wsServer.emit('connection', socket, req);
  });
});

wsServer.on('connection', (socket,req) => {
	socket.MathemagicianStateMachine = new stateM(wsServer,db,socket);
	socket.MathemagicianMetaData = new metaDataM();

	let interval = setInterval(()=> getSelPos(ws,socket), 1000);

  	socket.on('message', (message) => {
		socket.MathemagicianStateMachine.applyMessage(message.toString());
	});
});

const getSelPos = async(ws,socket) =>{
    let currentstate = socket.MathemagicianStateMachine.state;
    if(currentstate != null){
    	currentstate.currentTime++;
	socket.MathemagicianStateMachine.applyTick();
    	if(currentstate.currentTime >= currentstate.timeout){
		socket.MathemagicianStateMachine.applyTimeOut();
    	}
    }
}

const porthttp = modeData.portHTTP;
serverHTTP.listen(porthttp, function () {
  console.log('Listening on http://localhost:'+porthttp);
});

const porthttps = modeData.portHTTPS;
serverHTTPS.listen(porthttps, function () {
  console.log('Listening on https://localhost:'+porthttps);
});

module.exports = app;
//module.exports = server;
console.log("server running");

