$(function(){
    $('.event').click(function () { 
        //hiding all details
        $('.details').slideUp();

        //show details on click if they are not already visible
        const details = $(this).find(".details");
        if (!details.is(":visible")) {
            details.slideDown();
        }
        
    });

})