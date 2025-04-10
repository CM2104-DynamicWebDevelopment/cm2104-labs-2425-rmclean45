var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//route 1
app.get('/', function(req,res){
    res.send("Hello world! by express");
});

//route 2
app.get('/test',function(req,res){
    res.send("this is route 2");
});

//route 3
app.get('/joke', function(req,res){
    var randomJoke = knockknock();
    res.send(randomJoke);
});

//route 4
app.get('/add', function(req,res){
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    res.send("X + Y = " + (x+y)); 
})

//route 5
app.get('/calc',function(req,res){
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    var op = req.query.operator;
    int = 0;
    if (op == "add"){
        int = (x+y);
    }else if (op == "sub"){
        int = (x%y);
    }else if (op == "mul"){
        int = (x*y);
    }else if (op == "div"){
        int = (x/y);
    }
    res.send("" + int);
});

//route 6
app.get('/getform', function(req,res){
    var name = req.query.name;
    var quest = req.query.quest;
    res.send("Hi " + name + " I am sure you will " + quest);
});

//route 7
app.post('/postform', function(req,res){
    var name = req.body.name;
    var quest = req.body.quest;
    res.send("Hi " + name + " I am sure you will " + quest);
})

app.listen(8080);