var socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnect from server");
});

socket.on('newMess', (mess) => {
  var formattedTime = moment(mess.createdAt).format("h:mm a");
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: mess.text,
    from: mess.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  // console.log(mess);
  // $("#messages").append(
  //   `
  //     <li>${mess.from} ${moment(mess.createdAt).format("h:mm a")}: ${mess.text}</li>
  //   `
  // );
});

socket.on('newLocationMess', (mess) => {
  var formattedTime = moment(mess.createdAt).format("h:mm a");
  var template = $("#message-location-template").html();
  var html = Mustache.render(template, {
    from: mess.from,
    url: mess.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  // $("#messages").append(
  //   `
  //     <li>${mess.from} ${moment(mess.createdAt).format("h:mm a")}: <a target="_blank" href="${mess.url}">My current location</a></li>
  //   `
  // );
})

$("#message-form").on("submit", function(e){
  e.preventDefault();
  var input = $('input[name=message]');
  socket.emit('createMess',{
    from: 'User',
    text: input.val()
  }, function(data){
    input.val("");
  });
});

var locButton = $("#send-location");
locButton.on('click', function(){
  if(!navigator.geolocation){
    return alert("Geolocation not supported by your browser");
  }

  locButton.attr("disabled", 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locButton.removeAttr('disabled').text('Send Location');
    socket.emit("createLocationMess", {
      from: 'User',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function(){
      locButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location');
    });
  });
});
