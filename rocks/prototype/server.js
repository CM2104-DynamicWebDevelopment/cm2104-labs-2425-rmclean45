//database 
//before running do this: mongoimport --db profiles --collection people --drop --file people.json

const MongoClient = require('mongodb-legacy').MongoClient; //npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017'; // the url of our database
const client = new MongoClient(url); // create the mongo client
const dbname = 'profiles'; // the data base we want to access

//express
var express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var path = require('path');
var app = express();
//express sesion

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))


app.use(session({ 
   secret: 'example', 
   resave: false,
   saveUninitialized: true

}));



app.use(express.static('public'))
//to spceify css because it didnt want to go to public folder
app.use(express.static(path.join(__dirname, 'public')));


// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
   extended: true
 }))

//socket.io stuff
//const http = require('http').Server(app); 
//const io = require('socket.io')(http);

//holds db
var db;

connectDB();
//this is our connection to the mongo db, ts sets the variable db as our database
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}

// use res.render to load up an ejs view file
// index page 
app.get('/', function(req, res) {
   res.render('pages/index.ejs');
});
// about page 
app.get('/register', function(req, res) {
   res.render('pages/register.ejs');
});
app.get('/contactus', function(req, res) {
    res.render('pages/contactus.ejs');
 });
 app.get('/meals', function(req, res) {
   res.render('pages/meals.ejs');
});
app.get('/chat', function(req, res) {
   //to direct to sign in

   if(!req.session.loggedin){

      res.redirect('/register');return;

   };

   res.render('pages/chatRoom.ejs');

});
/*
io.on('connection', function (socket) { 
   console.log('a user connected'); 
   socket.on('disconnect', function () { 
       console.log('user disconnected'); 
   });
   socket.on('chat message', function (msg) { 
       io.emit('chat message', msg); 
   }); 
});

*/

app.post('/loginUser',function(req,res){

   console.log(JSON.stringify(req.body))
   var uname = req.body.username;
   var pword = req.body.password;

   console.log("0"+uname+ pword);

   db.collection('people').findOne({"username":uname}, function(err, result) {
      if (err) throw err;
  
      console.log("1"+uname+pword);
      console.log(result);
      if(!result){
         console.log("2"+uname+pword);
         res.redirect('/register');   
      }
  
      if(result.password == pword){ 
         req.session.loggedin = true; 
         res.redirect('/chat');
         console.log("3"+uname+pword);
      }
  
      else{
         res.redirect('/register')
         console.log("3"+uname+ pword);
      }
    });

});
app.post('/registerUser',function(req,res){

   console.log(JSON.stringify(req.body))

   console.log("0"+req.body.email+ req.body.password);

   var datatostore = {
      "username": req.body.username,
      "email": req.body.email,
      "password": req.body.password,
      "photo": req.body.photo
   }

   db.collection('people').insertOne(datatostore, function(err,result) {
      if(err) throw err;
      console.log('saved to database')
      console.log(db.collection('people').find({username:result}))
      res.redirect('/test')
   })
});
app.post('/test', function(req, res) {
   console.log('Test route hit');
   res.send('Test successful');
 });

//app.listen(8080);
console.log('8080 is the magic port');
