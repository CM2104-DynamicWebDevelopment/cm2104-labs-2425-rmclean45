$(document).ready(function () {
    $("#searchform").submit(function (e) { 
        e.preventDefault();
        var searchterms = $("#searchterms").val();
        addItemToList(searchterms);
        return false;
        
    });
});

function addItemToList(item){
    $("#results").append("<li>"+item+"</li>");
}