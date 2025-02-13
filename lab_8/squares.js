$(function () {
	// usual main starting point when web page loads

	// simple CSS class switcher
	// find all divs
	// bind to click events
	// alter the CSS of the specific clicked div element
	/*
	$("div").click(function(){
		// $(this) is a shortcut for the element we just selected
		// using $("div")
		if ($(this).hasClass("red")) {
			$(this).addClass("blue").removeClass("red");
		}
		else if ($(this).hasClass("blue")) {
			$(this).addClass("green").removeClass("blue");
		}
		else if ($(this).hasClass("green")) {
			$(this).addClass("red").removeClass("green");
		}
	});
	*/

	var count = 0;
	$("div").each(function () {
		var $thisDiv = $(this);
		var count = 0;
		$thisDiv.on("click", function () {
			count++;
			//$thisDiv.find("span").text("clicks: " + count);
			$thisDiv.toggleClass("red", count % 3 === 0);
		});
	});

});