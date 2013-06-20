// Where UI-related JS and other general JS goes
var ENTER_KEYCODE = 13;

// Document Hooks
$(document).ready(function(){
  var stepZeroScreen = $('#step-zero');
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var stepThreeScreen = $('#step-three');
  var finishScreen = $('#finished');
  var progressBar = $('#progress-bar > .bar');
  var progressBarContainer = $('#progress-bar-container');
  var toInput = $('#input-to');
  var selfLat;
  var selfLong;

  $('#start-btn').click(function(e){
    e.preventDefault();
    slideScreen(stepZeroScreen, stepOneScreen);
    progressBar.css('width', '20%');
  });
  $('#search-bar').keyup(function(event){
    if (event.keyCode == ENTER_KEYCODE)
      $('#search-btn').click(); // Click handler for this button is in fb.js
  });
  $("#continue-btn").click(function(e){
    var emailList = '';
             $('li.todo-done').each(function(){emailList += ($(this).children('.todo-content').children('span').text() +',');});
                  $('#input-to').val(emailList); 
    slideScreen(stepTwoScreen, stepThreeScreen);
    progressBarContainer.removeClass('span6 offset3');
    progressBarContainer.addClass('span12');
    progressBar.css('width', '70%');
  });
  $('#back-btn').click(function(e){
    slideScreen(stepTwoScreen, stepOneScreen);
    progressBar.css('width', '20%');
  });
  $('#send-btn').click(function(e){
    var sendees = $("#input-to").attr("value");
    var subject = $("#input-subject").attr("value");
    var message = $("#input-msg").attr("value");
    $.ajax({
      type: 'POST',
      data: {
        sendees: sendees,
        subject: subject,
        message: message
      },
      url: '/send',
      success: function(response){
         $("#success-msg").html("Your message has been sent to " + response );
      }
    });

    e.preventDefault();
    slideScreen(stepThreeScreen, finishScreen);
    progressBar.css('width', '100%');
  });
  $('#reset-btn').click(function(e){
    slideScreen(finishScreen, stepOneScreen);
    progressBarContainer.addClass('span6 offset3');
    progressBarContainer.removeClass('span12');
    progressBar.css('width', '20%');
  });
}); 

// Feed in DOM elements to switch between two div screens
var slideScreen = function(curr, next) {
  curr.hide();
  next.css("visibility", "visible");
  next.fadeIn();
};

function loadStepTwo(){
  var stepOneScreen = $('#step-one');
  var stepTwoScreen = $('#step-two');
  var progressBar = $('#progress-bar > .bar');
    slideScreen(stepOneScreen, stepTwoScreen);
    progressBar.css('width', '40%');
}
// Setup LI as check boxes
function setupLI(){
  $('li').click(function(e){
    if ($(this).hasClass('todo-done'))
      $(this).removeClass('todo-done');
    else
      $(this).addClass('todo-done');
  });
}
