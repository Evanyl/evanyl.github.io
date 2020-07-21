var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});
});

http.listen(port, () => {
	console.log(`listening on *:${port}`);
});