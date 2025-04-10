
function addContent(form) {
	const formAdded = form.itemToAdd.value || "daffy"

	// add a list of items to the content div
	console.log("I'm gonna add some content now!")
    let items = ["hewey", "dewey", "louie", formAdded];
	
	// build the html string for a <ul> list
    let items_html = "<ul>";
    for (let i=0; i < items.length; i++) {
		item = items[i];
		items_html += "<li>" + item + "</li>";
	};
	items_html += "</ul>";

	document.getElementById('content').innerHTML = items_html;
	console.log("There should be ducks now");

	
	document.createElement("div").innerHTML = items_html;
	console.log("more ducks?")
	
	// using javascript
	// 1. find the content div
	// 2. modify its html attribute by adding items_html

}

