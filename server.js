// ========================================
// server.js
// ========================================

// ========================================
//SETUP SERVER
// ========================================

var express    = require('express');
var app = require('express')();
var http        = require('http').Server(app);
var io = require('socket.io')(http);
var swig = require('swig');

// ========================================
// SETUP TEMPLATE ENGINE WITH SWIG
// ========================================
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


// ========================================
// CONFIG CONNECTION OF SOCKET IO
// ========================================


io.on('connection', function(socket){
	console.log('Se ha conectado un usuario...XD');

	//EACH SOCKET CAN RUN DISCONECT EVENT
	socket.on('disconnect', function(){
		console.log('El usuario se ha desconectado...X(')
	});

});


app.get("/", function(req, res, next){
	res.render('index');
});

// ====================================================== //
// == APP STARTUP
// ====================================================== //
if (process.env.OPENSHIFT_NODEJS_IP && process.env.OPENSHIFT_NODEJS_PORT) {
	http.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP, function() {
  		console.log('Listening at openshift on port: ' + process.env.OPENSHIFT_NODEJS_PORT);
	});
}
else {
	http.listen(3000, function () {
  		console.log('Listing on port: 80')
	});
}