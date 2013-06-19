// Where UI-related JS and other general JS goes

// Document Hooks
$(document).ready(function(){
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var stepThreeScreen = $('#step-three');
  var progressBar = $('#progress-bar > .bar');
  var progressBarContainer = $('#progress-bar-container');

  stepTwoScreen.hide();
  stepThreeScreen.hide();
  $("#search-btn").click(function(){
    slideScreen(stepOneScreen, stepTwoScreen);
    progressBar.css('width', '20%');
  });
  $("#continue-btn").click(function(){
    slideScreen(stepTwoScreen, stepThreeScreen);
    progressBarContainer.removeClass('span6');
    progressBar.addClass('span12');
    progressBar.css('width', '70%');
  });
}); 

// Feed in DOM elements to switch between two div screens
var slideScreen = function(curr, next) {
  curr.hide();
  next.css("visibility", "visible");
  next.fadeIn();
};
