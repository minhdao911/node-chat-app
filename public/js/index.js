var socket = io();

var roomsList = [];

socket.on('updateRoomList', (rooms) => {
  roomsList = [];
  var ul = $('<ul></ul>');
  rooms.forEach(function(room){
    ul.append($('<li></li>').text(room));
    roomsList.push(room);
  });
  $('#room-list').html(ul);
});

$('#random-room-btn').on('click', function(){
  if(roomsList.length>0){
    var randomNum = Math.floor(Math.random()*roomsList.length);
    var randomRoom = roomsList[randomNum];
    $('#sub-form').css('display', 'block');
    $('.container').addClass('dim');
    $('#sub-form_room-input').val(randomRoom);
  }else{
    alert('No active room at the moment');
  }
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

$('#cancel-btn').on('click', function(){
  $('#sub-form').css("display", "none");
  $('.container').removeClass('dim');
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
