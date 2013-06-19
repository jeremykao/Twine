// Where UI-related JS and other general JS goes

// Document Hooks
$(document).ready(function(){
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var stepThreeScreen = $('#step-three');

  stepTwoScreen.hide();
  stepThreeScreen.hide();
  $("#search-btn").click(function(){slideScreen(stepOneScreen, stepTwoScreen);});
  $("#continue-btn").click(function(){slideScreen(stepTwoScreen, stepThreeScreen);});
}); 

// Feed in DOM elements to switch between two div screens
var slideScreen = function(curr, next) {
  curr.hide();
  next.css("visibility", "visible");
  next.fadeIn();
};
