const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const {generateMess, generateLocationMess} = require("./utils/message");
const {isRealString} = require('./utils/validation');
const{User} = require('./utils/user');
const{Room} = require('./utils/room');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new User();
var rooms = new Room();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  // socket.emit('newMess', generateMess('Admin', 'Welcome to the app chat'));
  //
  // socket.broadcast.emit('newMess', generateMess('Admin', 'New user joined'));

  socket.emit('updateRoomList', rooms.roomList);

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback("Name and room name are required!");
    }

    rooms.addRoom(params.room);
    console.log(rooms.roomList);

    io.emit('updateRoomList', rooms.roomList);

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // console.log(users.getUserList(params.room));

    socket.emit('newMess', generateMess('Admin', 'Welcome to the app chat'));
    socket.broadcast.to(params.room).emit('newMess', generateMess('Admin', `${params.name} joined`));

    callback();
  });

  socket.on('simsimi', (params) => {
    socket.emit('newMess', generateMess('Admin', 'Welcome, you can now start talking with Simsimi. Have fun!'));
  });

  socket.on('createMess', (mess, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(mess.text)){
      io.to(user.room).emit('newMess', generateMess(user.name, mess.text));
    }
    if(!user){
      socket.emit('newMess', generateMess('You', mess.text));
    }

    callback();
  });

  socket.on('createLocationMess', (mess) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMess', generateMess(user.name, mess.latitude, mess.longitude));
    }
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMess', generateMess('Admin', `${user.name} has left the room`));
      if(users.getUserList(user.room).length === 0){
        rooms.removeRoom(user.room);
        console.log(rooms.roomList);
        io.emit('updateRoomList', rooms.roomList);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is starting on port ${port}`);
});
