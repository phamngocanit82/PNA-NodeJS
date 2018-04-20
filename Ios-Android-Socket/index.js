var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");	
});
console.log("server is running");
var arrayUser = [];
var exits = true;

io.sockets.on('connection', function(socket){
	console.log("Device connected");
	socket.on('client register user', function(data){
		if(arrayUser.indexOf(data) == -1){
			arrayUser.push(data);
			exits = false;
			socket.un = data;
			io.sockets.emit('server send user',{userlist:arrayUser});
			console.log("registered successful: "+data);
		}else{
			console.log("registered successful: "+data);
			exits = true;
		}
		socket.emit('server send result',{result:exits})
		
	});
	socket.on('client send chat', function(data){
		io.sockets.emit('server send chat',{chatcontent:socket.un + ": " + data});
	});
	socket.on('client send sound', function(data){
		
		io.sockets.emit('server send chat',{sound:data});
	});
	socket.on('ios position send', function(data){
	console.log("registered successful: "+data);
		io.sockets.emit('ios position receive',data);
	});
});
