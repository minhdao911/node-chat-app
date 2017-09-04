var socket = io();

function scrollToBottom(){
  var messages = $("#messages");
  var newMessages = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessagesHeight = newMessages.innerHeight();
  var lastMessagesHeight = newMessages.prev().innerHeight();

  if(clientHeight + scrollTop + newMessagesHeight +lastMessagesHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", () => {
  var params = jQuery.deparam(window.location.search);
  if(params.room !== 'simsimi'){
    socket.emit('join', params, function(err){
      if(err){
        alert(err);
        window.location.href = '/';
      }else{
        console.log('No error');
      }
    });
  }else{
    socket.emit('simsimi', params);
  }

});

socket.on("disconnect", () => {
  console.log("Disconnect from server");
});

socket.on('updateUserList', (users) => {
  var ol = $('<ol></ol>');
  users.forEach(function(user){
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
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
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function(){
      locButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location');
    });
  });
});
