const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMess', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createAt: new Date().getTime()
  });

  socket.broadcast.emit('newMess', {
    from: 'Admin',
    text: "new user joined",
    createAt: new Date().getTime()
  });

  socket.on('createMess', (mess) => {
    console.log(mess);
    io.emit('newMess', {
      from: mess.from,
      text: mess.text,
      createAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log("New user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is starting on port ${port}`);
});
