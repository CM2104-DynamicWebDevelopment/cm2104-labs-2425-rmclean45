//calorie ninja api D7c6zFY8aQbjClQf9Dz9gA==mRcxEJ6HDEucHljN
var calories,fiber,servingsize,sodium,fat_satur,fat_total,protein;
var calloriesTracker,proteinTracker,fatTracker;
var totalCalories=0,totalProtein=0,totalFat=0;
var data=[];
var ninjaFound = false;
function getCallories(item) {
    var query = item;
    $.ajax({
        method: 'GET',
        cache: false,
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
        headers: {'X-Api-Key': 'D7c6zFY8aQbjClQf9Dz9gA==mRcxEJ6HDEucHljN'},
        contentType: 'application/json',
        success: function (result) {
            console.log(result);
            document.getElementsByClassName("ContainerHeaderExtras")[0].innerHTML="<b>Macros</b>";
            ninjaFound = false;
            if(result.items && result.items.length > 0) {
                ninjaFound = true;
                calories = result.items[0].calories;
                protein = result.items[0].protein_g;
                fat_total = result.items[0].fat_saturated_g
                fiber = result.items[0].fiber_g;
                servingsize = result.items[0].serving_size_g;
                sodium = result.items[0].sodium_mg;
                fat_satur = result.items[0].fat_saturated_g;
                calloriesTracker = parseInt(calories);
                proteinTracker = parseInt(protein);
                fatTracker = parseInt(fat_total);

                try{
                $(".servingSize").text("Serving Size: " + servingsize + " g");
                $(".calories").text(calories);
                $(".protein").text("Protein: " + protein + "g");
                $(".saturatedFat").text("Saturated Fat: " + fat_satur + "g");
                $(".sodium").text("Sodium: " + sodium + "mg");
                $(".fiber").text("Fiber: " + fiber + "g");
                }catch(err){
                    console.log("Bad idea");
                }

            }else{
                //If the api can't find the given result
                //This is for the main page
                try{
                    document.getElementsByClassName("ContainerHeaderExtras")[0].innerHTML="<b>We don't have " + query + " in our database.</b>";
                    $(".servingSize").text("");
                    $(".calories").text(" ");
                    $(".protein").text(" ");
                    $(".saturatedFat").text(" ");
                    $(".sodium").text(" ");
                    $(".fiber").text(" ");
                }
                catch(err){
                    console.log("Bad idea");
                }
                //This is for tracker page
                try{
                    $("#SearchName").text("Couldn't find Info For: " + query)
                    $("#caloriesT").text(" ");
                    $("#proteinT").text(" ");
                    $("#fatT").text(" ");
                }
                catch(err){
                    console.log("Bad Idea")
                }
            }
        },
        error: function ajaxError(jqXHR) {
            ninjaFound = false;
            return console.error('Error: ', jqXHR.responseText);
        }

    });
}

function getRecipe(item) {
    var query = item
    $.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/recipe?query=' + query,
        headers: {'X-Api-Key': 'D7c6zFY8aQbjClQf9Dz9gA==mRcxEJ6HDEucHljN'},
        contentType: 'application/json',
        success: function(result) {
            console.log(result);
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}
//Search Function
//Happens when search bar has been pressed with enter
$(function(){
    $("form").submit(function() { return false; });
    $("#search-bar").on("keypress",async function(e){

        var searchTerms = $("#search").val();

        if(e.keyCode === 13){

            if(searchTerms == ""){
                alert("Please add something to the search bar!");
                return;
            }
            for(var i = 0; i < searchTerms.length; i++){
                if(searchTerms.charCodeAt(i) >= 33 && searchTerms.charCodeAt(i) <= 47 ||
                    searchTerms.charCodeAt(i) >= 58 && searchTerms.charCodeAt(i) <= 64 ||
                    searchTerms.charCodeAt(i) >= 91 && searchTerms.charCodeAt(i) <= 96){
                    alert("Contains invalid characters")
                    return;
                };
            };
            getImageFromMealDB(searchTerms);
            
            $(".contentAfterSearch").addClass("active");

            $('html, body').animate({
                scrollTop:$(".contentAfterSearch").offset().top + 100
            },
                1000);
        }

    })
})


function getImageFromMealDB(searchTerms){
    var url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchTerms;
    var url2 = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
    //Ingredient function
    $.when($.getJSON(url),$.getJSON(url2)).done(function(result,result2){
        empty(document.getElementById("ingredientList"));
        resetDisplay();
        var title = document.getElementById("foodTitle");
        console.log(result);
        console.log(result2);
        //Make the data easier to use
        var mealData = result[0];
        var ingredients = result2[0];

        //Regex pattern
        var regexObj = new RegExp(searchTerms, "i")
        console.log(regexObj)
        console.log(ingredients.meals.length)
        //Boolean if they find the ingredient
        var found = false;
        //Finds the ingredient
        for(var i = 0; i <ingredients.meals.length; i++){
            if(regexObj.test(ingredients.meals[i].strIngredient) && ingredients.meals[i].strIngredient.length < searchTerms.length + 3){
                console.log(ingredients.meals[i].strIngredient)
                title.innerHTML = "<b>" + ingredients.meals[i].strIngredient + "</b>";
                $(".itemImage").attr("src", "https://www.themealdb.com/images/ingredients/" + ingredients.meals[i].strIngredient + ".png");
                summonImage();
                summonMacros();
                summonUnexpected()
                getCallories(ingredients.meals[i].strIngredient,0)
                found = true;
                break;
            }
        }

        //Gets out when having found ingredient
        if(found){
            return;
        }

        
        //If found no ingredient and no meal is connected to that string, return rock to user
        if(mealData.meals == null && found == false){
            console.log("What")
            title.innerHTML = "<b>Oopsie Can't find: " + searchTerms +"</b>";
            $(".itemImage").attr("src", "images/image-placeholder.png");
            summonImage();
            // console.log(ninjaFound);
            // if(ninjaFound){
            //     getCallories(searchTerms);
            //     summonMacros();
            // }
            return;
        }
        //Otherwise find meal
        console.log(mealData)
        console.log(regexObj)
        summonImage();
        summonMacros();
        summonIngredient();
        summonUnexpected()
        //Find meal
        for(var i = 0; i <mealData.meals.length; i++){
            if(regexObj.test(mealData.meals[i].strMeal) && mealData.meals[i].strMeal.length < searchTerms.length + 30){
                console.log(mealData.meals[i].strMeal)
                title.innerHTML = "<b>" + mealData.meals[i].strMeal + "</b>";
                $(".itemImage").attr("src", mealData.meals[i].strMealThumb);
                getCallories(mealData.meals[i].strMeal)
                break;
            }
        }
        //Put mealData ingredients into a map
        const meal = new Map();
        //Sets all ingredients and measurments to readable map
        for(var i = 1; i < 21; i++){
            var ingredient = "mealData.meals[0].strIngredient" + i;
            var measure = "mealData.meals[0].strMeasure" + i;
            meal.set(eval(ingredient) ,eval(measure));
        }
        console.log(meal);

        // Add ingredients to a list
        meal.forEach((measure,ingredient ) => {
            if(ingredient == null || ingredient == ""){
                console.log("Just don't print")
            }else{
                const node = document.createElement("li");
                const textnode = document.createTextNode(ingredient+": "+measure);
                node.appendChild(textnode)
                document.getElementById("ingredientList").appendChild(node);
                
            }
        });
    })
}

//Empties a list element
function empty(element){
    while(element.firstElementChild){
        element.firstElementChild.remove();
    }
}
//Summon objects to user depending on what state the action is in
//Reset page
function resetDisplay(){
    for(var i = 0 ; i < 3; i++){
        document.getElementsByClassName("container")[i].style.display = "none";
        document.getElementsByClassName("devider")[i].style.display = "none";
    }

    document.getElementById("ContainerIngredient").style.display = "none";
}
//Summon image to user 
function summonImage(){
    document.getElementsByClassName("container")[0].style.display = "block";
    document.getElementsByClassName("devider")[0].style.display = "block";
    document.getElementsByClassName("devider")[1].style.display = "block";
}
//Summon macro info with tracker
function summonMacros(){
    document.getElementsByClassName("container")[1].style.display = "block";

    
    //summonTracker();
}
// Summon tracker
// function summonTracker(){
//     document.getElementsByClassName("devider")[1].style.display = "block";

//     document.getElementsByClassName("container")[1].style.display = "block";
//     document.getElementsByClassName("devider")[1].style.display = "block";
// }
//Summon ingredient
function summonIngredient(){
    document.getElementById("ContainerIngredient").style.display = "inline-block";
}

//Summon Unexpected
function summonUnexpected(){
    document.getElementsByClassName("container")[2].style.display = "block";

}