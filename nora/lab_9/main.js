//set the map and initial coodrinates
var mymap = L.map('mapid').setView([0,0],1);

var Esri_WorldGrayCanvas = 
L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ', maxZoom: 16 });

Esri_WorldGrayCanvas.addTo(mymap);

var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
//OpenTopoMap.addTo(mymap);

//when the button is clicked
$('#shakey').click(function(){
    console.log("getting quakes");

    $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(result){
        console.log(result);

        result.features.forEach(function(quake) {
            //for each earthquake
            //get its coordinates
            var lng = quake.geometry.coordinates[0];
            var lat = quake.geometry.coordinates[1];
            //and magnitude
            var mag = parseFloat(quake.properties.mag);

            //create a circle at that point
            //resize the circle based on magnitude
            var circle = L.circle([lat, lng], mag * 10000,{
                //style the cirle
                color: 'red',
                opacity: 0,
                fillColor: 'red',
                fillOpacity: 0.8
            })
            //and add it to the map
            circle.addTo(mymap);
        })

    });
});

//when the other button is clicked
$('#dopey').click(function(){
    console.log("getting meteors");

    $.getJSON("https://data.nasa.gov/resource/gh4g-9sfh.json", function(result){
        console.log(result);

        result.forEach(function(meteor){
            var lng = meteor.reclat;
            var lat = meteor.reclong;

            var mass = meteor.mass;

            var circle = L.circle([lat, lng], mass*5 ,{
                //style the cirle
                color: 'blue',
                opacity: 0,
                fillColor: 'blue',
                fillOpacity: 0.8
            })
            circle.addTo(mymap).bindPopup(''+meteor.name+'');
        })
    });
});
