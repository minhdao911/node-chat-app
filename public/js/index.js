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
