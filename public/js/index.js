var socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnect from server");
});

socket.on('newMess', (mess) => {
  console.log(mess);
  $("#messages").append(
    `
      <li>${mess.from}: ${mess.text}</li>
    `
  );
});

socket.on('newLocationMess', (mess) => {
  $("#messages").append(
    `
      <li>${mess.from}: <a target="_blank" href="${mess.url}">My current location</a></li>
    `
  );
})

$("#message-form").on("submit", function(e){
  e.preventDefault();
  var input = $('input[name=message]');
  socket.emit('createMess',{
    from: 'User',
    text: input.val()
  }, function(data){

  });
  input.val("");
});

$("#send-location").on('click', function(){
  if(!navigator.geolocation){
    return alert("Geolocation not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
    socket.emit("createLocationMess", {
      from: 'User',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function(){
      alert('Unable to fetch location');
    });
  });
});
