
let items = ["hewey", "dewey", "louie"];

function addContent () {
	// add a list of items to the content div
	let newItem = document.getElementById('element').value;

	if (newItem !== ""){
		items[items.length] = newItem;
		document.getElementById('element').value = '';
	}
	
	// build the html string for a <ul> list
    let items_html = "<ul>";
    for (let i=0; i < items.length; i++) {
		item = items[i];
		items_html += "<li>" + item + "</li>";
	};
	items_html += "</ul>";

	function del(items){
		delete(items[items.length]);
	}
	
	// using javascript
	// 1. find the content div
	// 2. modify its html attribute by adding items_html
	document.getElementById('content').innerHTML = items_html;


}

