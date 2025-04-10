var score = 0;
const express = require('express');
const path = require('path');
const MongoClient = require('mongodb-legacy').MongoClient;
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// MongoDB setup
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'profiles';
const galleryDBName = 'imageGalleryDB'; 
const eventDBName = 'eventDB';
var db, galleryDB, eventDB;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'example' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Start the DB connection
connectDB();
// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbname);
    galleryDB = client.db(galleryDBName);
    eventDB = client.db(eventDBName); 

    // Start the server after DB connection
    app.listen(8080, () => {
      console.log('Listening on port 8080');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

// Index page
app.get('/', (req, res) => {
  res.render('pages/index', {session: req.session});
});

// Stars page
app.get('/stars', (req, res) => {
  res.render('pages/stars', {session: req.session});
});

// Planets page
app.get('/planets', (req, res) => {
  res.render('pages/planets', {session: req.session});
});

// Grownups page
app.get('/grownups', (req, res) => {
  res.render('pages/grownups', {session: req.session});
});

//Games page
app.get('/games', (req, res) => {
  res.render('pages/games', {
    session: req.session,
    score: req.session.currentuser
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('pages/login', { 
    session: req.session
  });
});

// Profile page
app.get('/profile', (req, res) => {
  const uname = req.session.currentuser;

  db.collection('people').findOne({ "login.username": uname }, (err, userResult) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.redirect('/login');
    }

    if (!userResult) {
      console.log("User not found:", uname);
      return res.redirect('/login');
    }

    res.render('pages/profile', {
      user: userResult,
      session: req.session,
    });
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout error:", err);
    }
    console.log("session destroyed, redirecting to login")
    res.redirect('/login');
  });
});

// Handle login POST request
app.post('/dologin', (req, res) => {
  const { username, password, highscore } = req.body;

  // Check if the user exists in the database
  db.collection('people').findOne({ "login.username": username }, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.redirect('/login');
    }
    
    if (!result || result.login.password !== password) {
      console.log("Invalid credentials for:", username);
      return res.redirect('/login');
    }

    // Set session data upon successful login
    req.session.loggedin = true;
    req.session.currentuser = username;
    score = highscore;
    console.log("User logged in successfully:", username);

    // Redirect user to their profile
    res.redirect('/profile');
  });
});

// Add User POST request
app.post('/adduser', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    console.log("Username, password, and email are required.");
    return res.redirect('/login'); 
  }

  // Check if username already exists
  db.collection('people').findOne({ "login.username": username }, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.redirect('/login');
    }

    if (result) {
      console.log("Username already exists");
      return res.redirect('/login');  
    }

    // Create new user object with highscore set to 0
    const newUser = {
      login: {
        username,
        password, 
        email,
      },
      highscore: 0, // Initialize highscore to 0
    };

    // Insert the new user into the database
    db.collection('people').insertOne(newUser, (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.redirect('/login');
      }

      console.log("New user added to database");

      req.session.loggedin = true;
      req.session.currentuser = username;

      // Redirect user to their profile after successful account creation
      res.redirect('/profile');
    });
  });
});

// change password POST request
app.post('/passwordChange', async (req, res) => {
  const username = req.session.currentuser;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  //check if all the fields are filled in
  if (!currentPassword || !newPassword || !confirmPassword){
    console.log("All fields are required");
    return res.redirect('/profile');
  }

  //check if the new password and the confirm password are matching
  if (newPassword !== confirmPassword){
    console.log("New password do not match.");
    return res.redirect('/profile');
  }

  try{
    //finding the user in the database
    const user = await db.collection('people').findOne({"login.username":username});

    //checking if the password is correct
    if (!user || user.login.password !== currentPassword){
      console.log("Incorrect current password.");
      return res.redirect('/profile');
    }

    //update the password
    await db.collection('people').updateOne(
      {"login.username":username},
      {$set: {"login.password":newPassword}}
    );

    console.log("Password updated successfully!");
    return res.redirect('/profile');
  } catch(error){
    console.log("Error updating password:" , error);
    return res.redirect('/profile');
  }
})

// adding image to gallery POST request
app.post('/addimage', async (req, res) => {
  const { imageUrl, title, description } = req.body;
  const username = req.session.currentuser;

  let userGallery = await galleryDB.collection('galleries').findOne({ username });

  if (!userGallery) { // If gallery isn't created
    userGallery = {
      username,
      images: []
    };
  }

  // Check if the image already exists 
  const imageExists = userGallery.images.some(image => image.imageUrl === imageUrl);

  if (imageExists) {
    // Redirect to gallery page
    return res.redirect('/gallery');
  }

  // Adds the new image to the gallery
  userGallery.images.push({ imageUrl, title, description });

  // Save the updated gallery to the DB
  await galleryDB.collection('galleries').updateOne(
    { username },
    { $set: { images: userGallery.images } },
    { upsert: true }
  );

  res.redirect('/gallery');  // Redirect to the gallery page
});

app.get('/gallery', async (req, res) => {
  if (!req.session.loggedin) {
    return res.redirect('/login');
  }

  const username = req.session.currentuser;  // Get the username from session

  // gets trieve the user's gallery from the new image gallery DB
  const userGallery = await galleryDB.collection('galleries').findOne({ username });

  const gallery = userGallery ? userGallery.images : [];

  res.render('pages/gallery', { 
    gallery,
    session: req.session 
  });
});

app.post('/deleteimage', async (req, res) => {
  if (!req.session.loggedin) {
    return res.redirect('/login');
  }

  const username = req.session.currentuser; 
  const { imageUrl } = req.body;  

  // Retrieve the user's gallery from the database
  const userGallery = await galleryDB.collection('galleries').findOne({ username });

  if (!userGallery) {
    return res.redirect('/gallery');
  }

  // Filters out the image with the matching URL
  const updatedGallery = userGallery.images.filter(image => image.imageUrl !== imageUrl);

  // Update the user's gallery in the database
  await galleryDB.collection('galleries').updateOne(
    { username },
    { $set: { images: updatedGallery } }
  );

  res.redirect('/gallery');  // Redirect back to the gallery page after deletion
});

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.currentuser) {
      return next(); 
  } else {
      res.redirect('/login'); 
  }
}

// Route to add an interested event
app.post('/addInterestedEvent', isAuthenticated, (req, res) => {
  const { eventId, eventTitle, eventDescription } = req.body;

  console.log("is the user logged in: " + req.session.loggedin);
  // Save the event to the database or session
  if (!req.session.loggedin) {
    res.redirect('/login');
  } else {
    db.collection('interestedEvents').insertOne({ eventId, eventTitle, eventDescription })
    .then(result => {
        res.status(200).send('Event added to your interested list');
    })
    .catch(error => {
        res.status(500).send('Error adding event');
    });
  }
});


app.get('/interestevents', async (req, res) => {

  const username = req.session.currentuser;  // Get the username from session

  res.render('pages/interestevent', { 
    session: req.session 
  });
});