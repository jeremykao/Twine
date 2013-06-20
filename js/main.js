// Where UI-related JS and other general JS goes

// Document Hooks
$(document).ready(function(){
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var stepThreeScreen = $('#step-three');
  var finishScreen = $('#finished');
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
  $('#send-btn').click(function(){
    slideScreen(stepThreeScreen, finishScreen);
    progressBar.css('width', '100%');
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

//Distance between coords
var distance = function(lat1, long1, lat2, long2){
  theta = toRad(long1-long2);
  lat1 = toRad(lat1);
  long1 = toRad(long1);
  lat2 = toRad(lat1);
  long2 = toRad(long2);
  dist = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(theta);
  dist = toDeg(Math.acos(dist)) * 60 * 1.1515 * 1.609344 * 1000;
  return dist;
}
