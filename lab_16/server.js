const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var users = {};

//code to define the public "static" folder
app.use(express.static('public'))

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (username,msg) {
        io.emit('chat message',username, msg);
    });

    socket.on('room message', function (room, username, msg) {
        socket.join(room);
        io.to(room).emit('chat message',username, msg);
    });

    socket.on('set username', function(username){
        users[username] = socket.id;
        socket.emit('set username', 'username has been set to '+username);
    }); 

    socket.on('private message', function (recipient, username, msg) {
        var sendTo = users[recipient];
        io.to(sendTo).emit('private message',username, msg);
    });


});

http.listen(8080, function () {
    console.log('listening on *:8080');
});




// io.on('connection', function (socket) {
//     console.log('a user connected');
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });