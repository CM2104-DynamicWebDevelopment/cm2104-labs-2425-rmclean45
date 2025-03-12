var socket = io();

$('#form').submit(function () {
    var message = $('#input').val();
    if (message) {
        socket.emit('chat message', message);
        $("#input").val("");
    }
    return false; 
})

socket.on('chat message', function(msg) {
    $('#messages').append("<li>"+msg+"</li>");
    window.scrollTo(0, document.body.scrollHeight);
 });
