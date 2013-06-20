// Where UI-related JS and other general JS goes

// Document Hooks
$(document).ready(function(){
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var stepThreeScreen = $('#step-three');
  var progressBar = $('#progress-bar > .bar');
  var progressBarContainer = $('#progress-bar-container');
  var selfLat;
  var selfLong;

  stepTwoScreen.hide();
  stepThreeScreen.hide();
  $("#search-btn").click(function(){
    slideScreen(stepOneScreen, stepTwoScreen);
    progressBar.css('width', '20%');
  });
  $("#continue-btn").click(function(){
    slideScreen(stepTwoScreen, stepThreeScreen);
    progressBarContainer.removeClass('span6 offset3');
    progressBarContainer.addClass('span12');
    progressBar.css('width', '70%');
  });
  $('#back-btn').click(function(){
    slideScreen(stepTwoScreen, stepOneScreen);
    progressBar.css('width', '20%');
  });
}); 

// Feed in DOM elements to switch between two div screens
var slideScreen = function(curr, next) {
  curr.hide();
  next.css("visibility", "visible");
  next.fadeIn();
};

// Find geolocation
var getCoords = function() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(returnCoords);
  }
  else {
    alert("Geolocation is not supported by this browser.");
  }
}
var returnCoords = function(position) {
  selfLat = position.coords.latitude;
  selfLong = position.coords.longitude;
}

// convert to radians
var toRad = function(degrees){
  return degrees * Math.PI / 180;
}

// convert to degrees
var toDeg = function(radians){
  return radians * 180 / Math.PI;
}

var distance = function(lat1, long1, lat2, long2){
  var R = 3959; // miles
    var dLat = toRad(lat2-lat1);
    var dLong = toRad(long2-long1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLong/2) * Math.sin(dLong/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}
