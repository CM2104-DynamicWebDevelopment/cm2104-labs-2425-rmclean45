var express = require('express');
var app = express();
var SpotifyWebApi = require('spotify-web-api-node');
app.use(express.static('public'))

var spotifyApi = new SpotifyWebApi({
    clientId: '6c4317c68c284464ac108260191741b6',
    clientSecret: 'e7976ebdc9514ae79e525c67c4b5dadc'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
        console.log(
            'Something went wrong when retrieving an access token',
            err.message
        );
    }
);

//root route
app.get('/', function (req, res) {
    res.send("Hello world! by express");
});

//route for love in tracks, artists and albums
app.get('/searchLove', function (req, res) {
    getTracks('love', res);
});

//route for searching in tracks, artists and albums
app.get('/search', function (req, res) {
    var searchterm = req.query.searchterm;
    getTracks(searchterm, res);
});

//route for searching in tracks, artists and albums
app.get('/toptracks', function (req, res) {
    var artistID = req.query.artist;
    getTopTracks(artistID, res);
});

//route for searching in tracks, artists and albums
app.get('/searchAPI', function (req, res) {
    var searchterm = req.query.searchterm;
    getTracksAPI(searchterm, res);
});

//route for searching but only within tracks
app.get('/searchTrack', function (req, res) {
    var searchterm = 'track:' + req.query.track;
    getTracks(searchterm, res);
});

//add the code to do a search for artists

async function getTracksAwait(searchterm, res) {
    var data = await spotifyApi.searchTracks(searchterm);
    console.log(data);
    res.send(data.body);
}


async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
        .then(function (data) {
            //console.log(data);
            //res.send(JSON.stringify(data.body)); //sending raw JSON

            
            //if we want to format use the code below

            //first lets get the tracks. these are stored in the JSON under an array called Items
            var tracks = data.body.tracks.items
            //console.log(tracks);
            //lets set up a empty string to act as the response
            var HTMLResponse = "";
            //now lets run through all the items
            //this is a for loop (you could use a for each loop if you like.)
            for(var i=0; i<tracks.length;i++){
                
                var track = tracks[i];

                console.log(track.artists);

                HTMLResponse = HTMLResponse + 
                "<div>" +
                    "<h2>"+track.name+"</h2>"+
                    "<h4>"+track.artists[0].name+"</h4>"+
                    "<img src='"+track.album.images[0].url +"'>"+
                    "<a href='/toptracks?artist="+track.artists[0].id+"'> Top Tracks </a>"+
                    "<a href='"+track.external_urls.spotify+"'> Track Details </a>"+
                "</div>"
                //console.log(HTMLResponse);
            }
            res.send(HTMLResponse)
        }, function (err) {
            console.error(err);
        });
}
async function getTracksAPI(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
        .then(function (data) {
            //res.send(JSON.stringify(data.body)); //sending raw JSON

            //first lets get the tracks. these are stored in the JSON under an array called Items
            var tracks = data.body.tracks.items
            //lets set up a empty json array to act as the response
            var JSONResponse = [];
            //now lets run through all the items
            //this is a for loop (you could use a for each loop if you like.)
            for(var i=0; i<tracks.length;i++)
            {
                var track = tracks[i];
                //here we push the details we need about this track
                //to the
                JSONResponse.push(
                {
                    trackname:track.name,
                    artist:track.artists[0].name,
                    image:track.album.images[0].url,
                    url:track.external_urls.spotify,
                }
                );
            }
            res.send(JSONResponse)
        }, function (err) {
            console.error(err);
        });
}

async function getTopTracks(artist, res) {
    spotifyApi.getArtistTopTracks(artist, 'GB')
        .then(function (data) {
            res.send(data.body);

        }, function (err) {
            console.log('Something went wrong!', err);
        });

}

async function getRelated(artist, res) {
    spotifyApi.getArtistRelatedArtists(artist)
        .then(function (data) {
            console.log(data.body);
        }, function (err) {
            dconsole.log('Something went wrong!', err);
        });

}

app.listen(8080);



