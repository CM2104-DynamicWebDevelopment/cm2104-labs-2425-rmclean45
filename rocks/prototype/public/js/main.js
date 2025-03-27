//This is never used
function getCalorieFromImage(){
    var formData = new FormData();
    formData.append('file', $('#imagefile')[0].files[0]);
    $.ajax({
        method: 'POST',
        url: 'https://api.calorieninjas.com/v1/imagetextnutrition',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function(result) {
            console.log(result);
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}




// ---------- Animations for Dropdown Menu ---------- 
var moved = true; //Allows the menu to move back to its original position when clicked again
var logIn=false;//check if the user is login
$( "#moveprofile" ).on( "click", function() {

        if (moved) {
            $("#moveprofile").animate({
                top: "+=600",
                height: "-=30"
            }, 150, function () {
                // Animation complete.
                moved = false;

            });
        } else {
            $("#moveprofile").animate({
                top: "-=600",
                height: "+=30"
            }, 150, function () {
                // Animation complete.
                moved = true;
            })
        }
        if (moved) {
            $("#help").animate({
                top: "+=600",
                height: "-=30"
            }, 150, function () {
                // Animation complete.
                moved = false;

            });
        } else {
            $("#help").animate({
                top: "-=600",
                height: "+=30"
            }, 150, function () {
                // Animation complete.
                moved = true;
            })

        }

        $("#login").slideToggle(150, function () {
        });

});

// ---------- Tracker Popup ---------- 

$("#show-tracker").on("click", function(){

    $(".popup").removeClass("active");
    $("#track").addClass("active");

})


// ---------- New Meal Popup ---------- 
$("#show-newMeal").on("click", function(){

    $(".popup").removeClass("active");
    $("#newMeal").addClass("active");

})



// ---------- Login Popup ---------- 
///popup login
$("#show-login").on("click", function(){
//shows the popup login
    $(".popup").removeClass("active");
    $("#log").addClass("active");


})
$("#show-sign").on("click", function(){
    //shows the popSign up

    $(".popup").removeClass("active");
    $("#sign").addClass("active");


})

$(".popup .close-btn").on("click", function(){
    //when popup is being closed
    $(".popup").removeClass("active");
})
//login button
$("#LoginButton").on("click", function(){
    $(".popup").removeClass("active");
    logIn=true;

    //moove tha banner back so we can click on the banner and we can go to the usr account when loged in
    $("#moveprofile").animate({
        top: "-=600",
        height: "+=30"
    }, 150, function () {
        // Animation complete.
        moved = true;
    })
    $("#help").animate({
        top: "-=600",
        height: "+=30"
    }, 150, function () {
        // Animation complete.
        moved = true;
    })
    $("#login").slideToggle("fast", function () {
    });

})

//sign in button
$("#SignInButton").on("click", function(){
    $(".popup").removeClass("active");
    window.location.href = 'login.html';


})
//forgotbutoon
$("#forgotPsswd").on("click", function(){
    $(".popup").removeClass("active");
    $("#forgot").addClass("active");
})
//send security coded
$("#SendSecurity").on("click", function(){

    $(".popup").removeClass("active");
    
})

//Buttons on the Site
$("button").on("click",function (){
    console.log("A button was clicked")
    let idButton=$(this).attr('id');
    console.log(idButton);
    switch(idButton){
        case "caloriesButt":
            $('html, body').animate({

                    scrollTop:$("#macros").offset().top

                },
                800);
            break;
        case "alergens" :
            $('html, body').animate({

                    scrollTop:$("#macros").offset().top

                },
                800);
            break;
        case "tracker" :
            showMacrosOnEnter()
            window.location.href = 'Tracker.html';
            showMacrosOnEnter()
            break;
        case "facts" :
            $('html, body').animate({

                    scrollTop:$("#macros").offset().top

                },
                800);
            break;
        case "Search":
            console.log("This works")

            var searchTerms = $("#food").val();
            console.log("This works")
            getCallories(searchTerms);
            $(".infoMacrosAdd").addClass("active");
            $('html, body').animate({
                    scrollTop:$("#Submit").offset().top
            },
            800);
//        default:
//            break;
    }


})



// ---------- Ingredients Dropdown ---------- 

$("#ingredientTitle").on("click", function(){     

    $(".ingredientsList").toggle("display");

})


//Probably will be deleted
//tracker enter pressed
// $(function(){
//     $("form").submit(function() { return false; });
//     $("#search-Tracker").on("keypress",async function(e){
//         var searchTerms = $("#food").val();
//         var grams = $("#grams").val();
        

//         showMacrosOnEnter()
//         if(e.keyCode == 13){

//             if(searchTerms == ""){
//                 return;
//             }
//             showMacrosOnEnter()
//             console.log("This works")
//             await getCallories(searchTerms);
//             addToTrackerSearch(searchTerms, grams);
//             $('html, body').animate({
//                     scrollTop:$("#remainigFat").offset().top + 100
//                 },
//                 400);
//             }
//         })

//     })

function addToTrackerSearch(searchTerms, grams){

    $("#SearchName").text(searchTerms+"");

    $("#caloriesT").text( calories/100 * grams + "kcal");
    console.log(calories);
    $("#proteinT").text( protein/100 * grams + "g");
    console.log(protein);
    $("#fatT").text(fat_total/100 * grams+"g");
    console.log(fat_total)
}
function showMacrosOnEnter(){
    $("#remainigCallories").text(totalCalories+"/1200");
    $("#remainigProtein").text(totalProtein+"/180g");
    $("#remainigFat").text(totalFat+"g/150g");

}
$("#logFood").on("click",function(){
    totalCalories+=calloriesTracker;
    totalProtein+=proteinTracker;
    totalFat+=fatTracker;
    $("#remainigCallories").text(totalCalories+"/1200");
    $("#remainigProtein").text(totalProtein+"/180g");
    $("#remainigFat").text(totalFat+"g/150g");

})

//rocky function
$(window).scroll(function() {       

    if($(window).scrollTop() >= 1500 && $(window).scrollTop() <= 2500) {
        $(".speechbubblecontainercal").removeClass("active");
        $("#speechcal").addClass("active");
    }
    else{
        $(".speechbubblecontainer").removeClass("active");
        $(".speechbubblecontainercal").removeClass("active");
    }
});

function displayMacros(){
    const grams = document.getElementById('gramsInput');
    console.log(grams.value);
        $("#caloriesM").text((calories/100 * grams.value).toFixed(1) + "kcal");
        console.log(calories);
        $("#proteinM").text((protein/100 * grams.value).toFixed(1) + "g");
        console.log(protein);
        $("#fatM").text((fat_total/100 * grams.value).toFixed(1) +"g");
        console.log(fat_total)
}


