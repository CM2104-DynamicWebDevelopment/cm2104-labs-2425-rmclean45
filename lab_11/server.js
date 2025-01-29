var express = require('express');
var knockknock = require('knock-knock-jokes');
var app = express();

app.use(express.static('/public'));

app.get('/', function(req, res){
    res.send("Hello world! by express");
});

app.get('/test', function(req, res){
    res.send("this is route 2");
});

app.get('/joke', function(req, res){
    randomJoke = knockknock()
    res.send(randomJoke);
});

app.get('/add', function(req, res){
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    res.send("X + Y="+(x+y));
});

app.get('/calc', function(req, res){
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    var operator = req.query.operator;
    var output = 0;
    var symbol = "";
    if (operator == "add"){
        symbol = "+";
        output = x+y;
    } else if (operator == "sub"){
        symbol = "-";
        output = x-y;
    } else if (operator == "mul"){
        symbol = "x";
        output = x*y;
    } else if (operator == "div"){
        symbol = "/";
        output = x/y;
    }
    res.send("X " + symbol + " Y = " + output);
});

/*app.get('/about', function(req, res){

});*/

app.listen(8080);