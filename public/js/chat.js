var socket = io();

var typing = false;
var timeout = undefined;
var $currentInput = $('input[name=message]');

function timeoutFunction(){
  typing = false;
  socket.emit("typing", false);
}

$currentInput.keydown(function(e){
    if (e.which !== 13) {
      if (typing === false && $currentInput.is(":focus")) {
        typing = true;
        socket.emit("typing", true);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1000);
      }
    }
  });

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

socket.on("isTyping", function(data) {
    if (data.typing) {
      if ($("#"+data.username+"").length === 0) {
        $("#messages").append(`
            <li id="${data.username}" class="message">
              <div class="message__title">
                <h4>${data.username}</h4>
                <span class="isTyping">is typing</span>
              </div>
            </li>
          `);
        timeout = setTimeout(timeoutFunction, 1000);
      }
    } else {
      $("#"+data.username+"").remove();
    }
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

  $("#"+mess.from+"").remove();
   clearTimeout(timeout);
   timeout = setTimeout(timeoutFunction, 0);
});

socket.on('newNoti', (noti) => {
  var template = $('#message-notification').html();
  var newNoti = noti.text;
  var html = Mustache.render(template, {
    noti: newNoti
  });
  $("#messages").append(html);
  scrollToBottom();
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
});

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
