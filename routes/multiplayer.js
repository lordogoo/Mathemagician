var express = require('express');
var ws = require('ws');

class RouterWithWebSockets {
  constructor(router = express.Router()) {
    this.router = router;
  }

  ws(path, callback) {
    // set up a new WSS with the provided path/route to handle websockets
    const wss = new ws.WebSocketServer({
      noServer: true,
      path,
    });

    this.router.get(path, (req, res, next) => {
	console.log(req.headers);
	console.log(req.headers.upgrade);
      if (!req.headers.upgrade || path !== req.url) {
        next();
      } else {
	console.log(req.ws);
        req.ws.handled = true;
	console.log(req.ws.handled);
        wss.handleUpgrade(req, req.ws.socket, req.ws.head, (ws) => {
          	console.log('test4');
		callback(ws);
		console.log('test5');
        });
	console.log('test6');
      }
    });
  };
}

const routerWithWebSockets = new RouterWithWebSockets();

routerWithWebSockets.ws('/wsRoute1', (ws) => {
	console.log('test route');
	ws.on('message',(message)=>{
		console.log(message);
	});
});


module.exports = routerWithWebSockets.router;