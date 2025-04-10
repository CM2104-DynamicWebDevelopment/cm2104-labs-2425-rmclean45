$(document).ready(function () {
    alert("document ready")
    $("#searchform").submit(function (e) { 
        e.preventDefault();
        var searchterms = $("#searchterms").val();
        getResultsFromOMDB(searchterms);
        return false;
        
    });
});

function getResultsFromOMDB(searchterms) {
    var url = "http://www.omdbapi.com/?apikey=4164c89f&s=" + searchterms

    $.getJSON(url, function(jsondata){
        addResultTitles(jsondata)
    });

};


function addResultTitles(jsondata){
    var htmlstring = "";
    for (var i=0; i<10; i++){
        var title = jsondata.Search[i].Title;
        htmlstring += "<li>"+title+"</li>"
    }
    $("#results").html(htmlstring);
}

function prettyPrintJSON(jsondata){
    var pretty = JSON.stringify(jsondata,null,4);
    $("#resultsbox").append("<pre>"+pretty+"</pre>");
}

function printJSON(jsondata){
    var normal = JSON.stringify(jsondata);
    $("#resultsbox").append("<p>"+normal+"</p>");
}

function addItemToList(item){
    $("#results").append("<li>"+item+"</li>");
}