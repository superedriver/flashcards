$(document).ready(function(){
    var qualityResponse = document.getElementById("quality_response");
    if (qualityResponse) {
        setInterval(function() {
            qualityResponse.value = +qualityResponse.value + 1;
        }, 1000);
    }
});