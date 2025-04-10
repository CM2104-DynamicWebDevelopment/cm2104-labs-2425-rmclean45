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
        printJSON(jsondata)
    });

};

function printJSON(jsondata){
    var normal = JSON.stringify(jsondata);
    $("#resultsbox").append("<p>"+normal+"</p>");
}

function addItemToList(item){
    $("#results").append("<li>"+item+"</li>");
}