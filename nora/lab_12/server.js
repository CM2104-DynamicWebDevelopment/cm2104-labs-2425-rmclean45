var express = require('express');
var app = express();

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: '04d54380020e40298bcf5073d0b386aa',
    clientSecret: '762d52c7eb764aa492cc7258d1191521'
});

//retrieve an access token
spotifyApi.clientCredentialsGrant().then( //connect to API
    function(data){ //once connected, the data variable contains the token we need
        console.log('The access token expires in ' + data.body['expires_in']); //we print out some detauls about the token to the console
        console.log('The access token is ' + data.body['access_token']);

        //save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']); // we set the 'access_token' for the API
    },

    function (err) {
        console.log(
            'Something went wrong when retrieving an access token',
            err.message //abort if any error is detected
        );
    }
);

async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
        .then(function(data){
            var tracks = data.body.tracks.items
            //lets set up an empty string to act as the response
            var HTMLResponse = "";
            //now lets run through all the items
            //this is a for loop
            for (var i=0; i<tracks.length; i++){
                var track = tracks[i];
                console.log(track.name);

                HTMLResponse = HTMLResponse + 
                "<div>" + 
                    "<h2>" + track.name + "</h2>" + 
                    "<h4>" + track.artists[0].name + "</h4>" + 
                    "<img src='" + track.album.images[0].url + "'>" + 
                    "<a href='" + track.external_urls.spotify + "'> Track Details </a>" + 
                    //"Top tracks from this artist: " + track.artist[0].getTopTracks
                "</div>";
                console.log(HTMLResponse);
            }
            res.send(HTMLResponse);
        }, function(err){
            console.log(err);
    });  
}

async function getTopTracks(artist,res) {
    spotifyApi.getArtistTopTracks(artist, 'GB')
        .then(function(data){
            console.log(data.body);
        }, function(err){
            console.log('Something went wrong!',err);
        });
}

app.use(express.static('public'));

app.get('/', function(req,res){
    res.send("Hello world! by express");
});

//route for love in tracks, artists and albums
app.get('/searchLove', function(req,res){
    getTracks('love', res);
});

//route for searching in tracks, artists and albums
app.get('/search', function(req,res){
    var searchterm = req.query.searchterm;
    getTracks(searchterm, res);
});

app.listen(8080);