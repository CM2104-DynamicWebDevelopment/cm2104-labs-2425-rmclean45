$(document).ready(function () {
    $("#searchform").submit(function (e) { 
        e.preventDefault();
        addItemToList("exampleItem")
        return false
    });
});

function addItemToList(item){
    $("#results").append("<li>"+item+"</li>");
}