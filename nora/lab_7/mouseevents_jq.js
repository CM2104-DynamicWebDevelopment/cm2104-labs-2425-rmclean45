// JavaScript Document

$(function(){
	// usual main starting point when web page loads
	
	
	// use jquery to find the div with id button1
	// set the mouse enter and mouse leave functions, just like the onclick in the lecture
	// use the html attribute to set the text
	$("#button1").mouseenter(function(){
		$("#button1").html("Thank You");
	});

	// now you need to do the same for button1 for mouseleave
	$("#button1").mouseleave(function () { 
		$("#button1").html("Mouse Over Me");
	});
	
	
	// and mouseup, mousedown for button2
	$("#button2").mouseup(function () { 
		$("#button2").html("Thank you");
		$("#button2").css("background-color", "blue");
	});

	$("#button2").mousedown(function () { 
		$("#button2").html("Release Me");
		$("#button2").css("background-color", "green");
	});
	
});

