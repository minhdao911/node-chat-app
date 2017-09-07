const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const request = require('request');

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

var url = "http://sandbox.api.simsimi.com/request.p?key=c6cc73ca-c702-4661-bfe6-e9ce6eea06a6&lc=vn&ft=0.8&text=";

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
    socket.broadcast.to(params.room).emit('newNoti', generateMess('Admin', `${params.name} joined`));

    callback();
  });

  socket.on('simsimi', (params) => {
    socket.emit('newMess', generateMess('Admin', 'Welcome, you can now start talking with Simsimi. Have fun!'));
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (data) {
    var user = users.getUser(socket.id);
    socket.broadcast.to(user.room).emit('isTyping', {
      username: user.name,
      typing: data
    });
  });

  // // when the client emits 'stop typing', we broadcast it to others
  // socket.on('stop typing', function () {
  //   var user = users.getUser(socket.id);
  //   socket.broadcast.emit('stop typing', {
  //     username: user.name
  //   });
  // });

  socket.on('createMess', (mess, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(mess.text)){
      io.to(user.room).emit('newMess', generateMess(user.name, mess.text));
    }
    if(!user){
      socket.emit('newMess', generateMess('You', mess.text));
      url = url + encodeURIComponent(mess.text);
      request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
          var result = JSON.parse(body);
          socket.emit('newMess', generateMess('Simsimi', result.response));
        }
      });
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
      io.to(user.room).emit('newNoti', generateMess('Admin', `${user.name} has left the room`));
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
