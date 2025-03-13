/**
 * @Author: John Isaacs <john>
 * @Date:   12-Mar-182018
 * @Filename: main.js
 * @Last modified by:   john
 * @Last modified time: 12-Mar-182018
 */

$(function () {
  // when page ready
  //ask for json from our twitter JSON
  //getNiceTweets();
  //getTracks();

});

//tie the submit button to the click
$('#submit').click(handleClick);

function handleClick() {
  var nametosend = $('#name').val();
  getTracks(nametosend);
  return false; // prevent further bubbling of event
}

function getTracks(name) {

  $.getJSON("/searchAPI?searchterm=" + name, function (data) {
    console.log(data);
    $('#tracksdisplay').empty(); //clears the div
    //display the last updated time.
    $('#tracksdisplay').append("<H3> Last Updated " + Date() + " </h3>");
    //for every track create a div and append to the page

    for (var t = 0; t < data.length; t++) {
      var trackoutput = "<div>";
      trackoutput += "<h2>" + data[t].trackname + "</h2>";
      trackoutput += "<p>" + data[t].artist + "</p>";
      trackoutput += "<img src='" + data[t].image + "'>";
      trackoutput += "</div>";
      $('#tracksdisplay').append(trackoutput);
    }
  });
}

function getNiceTracks(name) {

  $.getJSON("/searchAPI?searchterm=" + name, function (data) {
    //console.log(data);
    $('#tracksdisplay').empty(); //clears the div
    //display the last updated time.
    $('#tracksdisplay').append("<H3> Last Updated " + Date() + " </h3>");
    //for every tweet create a div and append to the page
    console.log(data.length);
    for (var t = 0; t < data.length; t++) {
      var trackoutput = "<article class='card'>";
      trackoutput += "<header class='card__title'><h3>" + data[t].trackname + "</h3></header>";
      trackoutput += "<main class='card__description'>" + data[t].artist + "<img src='" + data[t].image + "'>"+"</main>";
      trackoutput += "</article>";
      $('#card-container').append(trackoutput);
    }

  });
}




// function getNiceTweets() {
//   $.getJSON("/tweetsjson", function(data) {
//     $('#tweetsdisplay').empty(); //clears the div
//     //display the last updated time.
//     $('#tweetsdisplay').append("<H3> Last Updated "+Date()+ " </h3>");
//     //for every tweet create a div and append to the page
//     for (var t = 0; t < data.length; t++) {
//       var tweetoutput = "<article class='card'>";
//       tweetoutput += "<header class='card__title'><h3>" + data[t].name + "<h3></header>";
//       tweetoutput += "<main class='card__description'>" + data[t].text + "</main>";
//       tweetoutput += "</article>";
//       $('#card-container').append(tweetoutput);
//     }

//   });
// }
