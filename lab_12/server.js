var express = require('express');
 var app = express();
 var SpotifyWebApi = require('spotify-web-api-node')
 app.use(express.static('public'))

 var spotifyApi = new SpotifyWebApi({
    clientId: 'c37f4400e0d040fdbc70d0075edb659f',
    clientSecret: 'f2e64e265fa14317bc5b7a2f746b5e1d'
 })

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

async function getTracks(searchterm, res) {

    spotifyApi.searchTracks(searchterm)
        .then(function (data) {
            res.send(JSON.stringify(data.body));
        }, function (err) {
            console.error(err);
        });

}

//route for love in tracks, artists and albums
app.get('/searchLove', function (req, res) {
    getTracks('love', res);
});


 app.get('/', function(req, res){
    res.send("Hello world! by express");
 });

app.listen(8080);
