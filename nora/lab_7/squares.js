$(function(){
	// usual main starting point when web page loads
	
	// simple CSS class switcher
	// find all divs
	// bind to click events
	// alter the CSS of the specific clicked div element
	$("div").click(function(){
		// $(this) is a shortcut for the element we just selected
		// using $("div")
		/*if ($(this).hasClass("red")) {
			$(this).addClass("blue").removeClass("red");
		}
		else if ($(this).hasClass("blue")) {
			$(this).addClass("green").removeClass("blue");
		}
		else if ($(this).hasClass("green")) {
			$(this).addClass("red").removeClass("green");
		}*/

		//$(".red").toggleClass(".blue",);

		//trying out effects
		$(this).css("position", "absolute");
		$(this).animate({left :"+=360"}, 1000, function(){})

		$(this).fadeOut("slow");
	});
	
});