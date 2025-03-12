var socket = io();

$('#form').submit(function () {
    var message = $('#input').val();
    if (message) {
        socket.emit('chat message', message);
        $("#input").val("");
    }
    return false; 
})
