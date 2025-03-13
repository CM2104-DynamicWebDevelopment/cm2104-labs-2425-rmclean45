var http = require('http');
var currentdate = require('./mymodule');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("The data and time are currently: " + currentdate.myDateTime());
    res.end('Hello World!');
}).listen(8080); //server listens on port 8080 and responds with 'Hello World!'
