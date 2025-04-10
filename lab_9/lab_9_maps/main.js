var mymap = L.map('mapid').setView([0,0],1);

var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ', maxZoom: 16 });

Esri_WorldGrayCanvas.addTo(mymap);

var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//OpenTopoMap.addTo(mymap);

$("#shakey").click(function (e) { 
    e.preventDefault();
    console.log("starting to get quakes")
    $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        function (data, textStatus, jqXHR) {
            console.log(data)
            data.features.forEach(function(quake){
                //for each earthquake
                // get its coordinates
                var lng = quake.geometry.coordinates[0];
                var lat = quake.geometry.coordinates[1];
                var mag = parseFloat(quake.properties.mag);
                //need to multiple by mag by this much to see a diff
                var circle = L.circle([lat,lng],mag*100000,{
                    color: 'red',
                    opacity: 0,
                    fillColor: 'red',
                    fillOpacity: 0.8
                })
                circle.addTo(mymap)
            })
        }
    );
});

$("#dropey").click(function (e) { 
    e.preventDefault();
    console.log("starting to get meteors")
    $.getJSON("https://data.nasa.gov/resource/gh4g-9sfh.json",
        function (data, textStatus, jqXHR) {
            console.log(data)
            data.forEach(function(meteor){
                //for each meteor
                // get its coordinates
                var lng = meteor.geolocation.longitude //quake.geometry.coordinates[0];
                var lat = meteor.geolocation.latitude //quake.geometry.coordinates[1];
                console.log("lat: "+lat+", long: "+lng);
                var mass = parseInt(meteor.mass);
                //need to multiple by mag by this much to see a diff
                var circle = L.circle([lat,lng],mass*100,{
                    color: 'blue',
                    opacity: 0,
                    fillColor: 'blue',
                    fillOpacity: 0.8
                })
                circle.addTo(mymap).bindPopup(meteor.name + " " + mass)
            })
        }
    );
});

