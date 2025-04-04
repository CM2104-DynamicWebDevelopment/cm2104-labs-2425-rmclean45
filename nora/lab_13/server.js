const MongoClient = require('mongodb-legacy').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'star_wars_quotes';

//code to link the express module
const express = require('express');
const app = express();

//code to define the public
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

var db;



//adding all quotes route
app.get('/all', function(req,res){
    db.collection('quotes').find().toArray(function(err, result){
        if (err) throw err;

        var output = "<h1>All the quotes</h1>";

        for (var i = 0; i < result.length; i++){
            output += "<div>";
            output += "<h3>" + result[i].name + "</h3>";
            output += "<p>" + result[i].quote + "</p>";
            output += "</div>";
        }
        res.send(output);
    });
});




app.post('/quotes', function(req,res){
    db.collection('quotes').insertOne(req.body, function(err, result){
        if (err) throw err;
        console.log('saved to database');
        res.redirect('/');
    });
});

app.post('/search', function(req, res){
    db.collection('quotes').find(req.body).toArray(function(err, result){
        if (err) throw err;
        var output = "<h1>All the quotes</h1>";

        for (var i = 0; i < result.length; i++){
            output += "<div>";
            output += "<h3>" + result[i].name + "</h3>";
            output += "<p>" + result[i].quote + "</p>";
            output += "</div>"; 
        }
        console.log(output);
        res.send(output);
    });
});

app.post('/delete', function(req,res){
    db.collection('quotes').deleteOne(req.body, function(err,result){
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/update', function(req,res){
    var query = {quote: req.body.quote};
    var newvalues = {$set: {name: req.body.newname, quote: req.body.newquote}};

    db.collection('quotes').updateOne(query,newvalues, function(err, result){
        if (err) throw err;
        res.redirect('/');
    });
});

//run the connect method
connectDB();

async function connectDB() {
    //Use connect method to connect to the server
    await client.connect();
    console.log('Connected succesfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
}