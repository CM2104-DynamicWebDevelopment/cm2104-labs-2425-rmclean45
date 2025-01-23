
var http = require('http');

http.createServer(function (req, res) {
    //this is my best comment

 res.writeHead(200, {'Content-Type': 'text/html'});
 res.write('Hello World!');
 res.end();
 
}).listen(8080);