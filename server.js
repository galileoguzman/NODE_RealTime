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
// ADD BODY PARSER TO APP
// ========================================
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));


// ========================================
// DATABASE SETUP
// ========================================
var pg = require('pg');
var conString = "postgres://userrealtime:real_time00@localhost/realdb";


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

// testing
app.get("/hellow", function(req, res, next){
	var data = {
		name : "Galileo",
		surname: "Guzmán",
		age : 26,
	};

	res.json(data);
});

// ====================================================== //
// == USER LOGIN
// ====================================================== //
app.post("/login", function(req, res, next){
	console.log("Login Function Init");
	
	// get vars from request
	var reqData = req.body;
	var reqUsername = reqData['username'];
	var reqPassword = reqData['password'];

	// query on postgresql db
	var results = [];

	pg.connect(conString, function(err, client, done) {
		// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err});
		}

		// SQL Query > Select Data
		var query = client.query("SELECT name, surname FROM users WHERE username=($1) AND password=($2)", [reqUsername, reqPassword]);

		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		// After all data is returned, close connection and return results
		query.on('end', function() {
			done();
			//return res.json(results);
		});
	});


	console.log(results);

	// Set response
	//res.setHeader('Content-Type', 'application/json');
   	res.json(results);
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