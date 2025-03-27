var socket = io();

$('#send-button').click(function () { 
    var message = $('#user-input').val(); 
    if (message) { 
                socket.emit('chat message', message); 
    $("#user-input").val(""); 
    } 
    return false;  
    })
    socket.on('chat message', function(msg) { 
        $('#message-container').append("<div class='message ai-message'>" + msg + "</div>" );
        window.scrollTo(0, document.body.scrollHeight);
       
    });