$(document).ready(function(){
    var qualityResponse = $("#quality_response");
    if (qualityResponse.length) {
        setInterval(function() {
            qualityResponse.val( +qualityResponse.val() + 1);
        }, 1000);
    }
});