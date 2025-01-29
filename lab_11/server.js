var express = require('express');
var knockknock = require('knock-knock-jokes');
var app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

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

app.get('/getform', function(req, res){
    var name = req.query.name;
    var quest = req.query.quest;
    res.send("Hi "+name+" I am sure you will "+quest) ;
});

app.post('/postform', function(req, res){
    var name = req.body.name;
    var quest = req.body.quest;
    res.send("Hi "+name+" I am sure you will "+quest) ;
});

app.get('/user/:userID/books/:bookID', function(req, res){
    var userID = req.params.userID;
    var bookID = req.params.bookID;
    res.send("UserID: " + userID + " BookID: " + bookID);
});

app.listen(8080);