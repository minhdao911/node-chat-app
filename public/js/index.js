var socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnect from server");
});

socket.on('newMess', (mess) => {
  console.log(mess);
  jQuery("#messages").append(
    `
      <li>${mess.from}: ${mess.text}</li>
    `
  );
});

jQuery("#message-form").on("submit", function(e){
  e.preventDefault();
  var input = jQuery('input[name=message]');
  socket.emit('createMess',{
    from: 'User',
    text: input.val()
  }, function(data){

  });
  input.val("");
});
