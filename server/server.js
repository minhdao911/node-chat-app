const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const {generateMess, generateLocationMess} = require("./utils/message");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMess', generateMess('Admin', 'Welcome to the app chat'));

  socket.broadcast.emit('newMess', generateMess('Admin', 'New user joined'));

  socket.on('createMess', (mess, callback) => {
    console.log(mess);
    io.emit('newMess', generateMess(mess.from, mess.text));
    callback('This is from the server');
  });

  socket.on('createLocationMess', (mess) => {
    io.emit('newLocationMess', generateLocationMess(mess.from, mess.latitude, mess.longitude));
  });

  socket.on('disconnect', () => {
    console.log("New user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is starting on port ${port}`);
});
