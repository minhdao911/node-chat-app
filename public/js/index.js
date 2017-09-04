var socket = io();

socket.on('updateRoomList', (rooms) => {
  console.log(rooms);
  var ul = $('<ul></ul>');
  var roomList = $('#room-list');
  rooms.forEach(function(room){
    ul.append($('<li></li>').text(room));
  });
  roomList.html(ul);
});

$('#room-list').on('click', 'li', function(){
  var room = $(this).text();
  $('input[name=room]').val(room);
  $('.form-field:nth-child(4)').css("display", "none");
});

$('body').on('click', function(e){
  if(e.target.id !== "room-list" && e.target.id !== "room-input"){
    $('.form-field:nth-child(4)').css("display", "none");
  }
});

$('input[name=room]').on('focus', function(){
  $('.form-field:nth-child(4)').css("display", "block");
});

var roomInput = $('input[name=room]');
roomInput.keydown(function(){
  if($(this).val().length>1){
    $('.form-field:nth-child(4)').css("display", "none");
  }else{
    $('.form-field:nth-child(4)').css("display", "block");
  }
});
