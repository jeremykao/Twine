// Where UI-related JS and other general JS goes
var ENTER_KEYCODE = 13;
var searchBar = $('#search-bar');
var stepZeroScreen = $('#step-zero');
var stepOneScreen = $('#step-one');
var stepTwoScreen = $('#step-two');
var stepThreeScreen = $('#step-three');
var stepFourScreen = $('#step-four');
var finishScreen = $('#finished');
var progressBar = $('#progress-bar > .bar');
var progressBarContainer = $('#progress-bar-container');
var searchBar = $('#search-bar');
var searchBtn = $('#search-btn');
var searchAlert = $('#search-alert');
var toInput = $('#input-to');

// Indicates whether user is searching Facebook(false) or Google+(true).
// If null, means user hasn't logged onto either.
var mode = null; 

// Document Hooks
$(document).ready(function(){
  var selfLat;
  var selfLong;

  // Checkingbegin button
  checkBeginBtn();

  $('#start-btn').click(function(e){
    e.preventDefault();
    slideScreen(stepZeroScreen, stepOneScreen);
    progressBar.css('width', '20%');
    $("#search-bar").focus();
  });
  $('#search-bar').keyup(function(event){
    if (event.keyCode == ENTER_KEYCODE)
      $('#search-btn').click(); // Click handler for this button is in fb.js
  });
  $("#continue-btn").click(function(e){
    var emailList = '';
    $('li.todo-done').each(function(){
      emailList += ($(this).children('.todo-content').children('span').text() +',');
      emailList = emailList.substr(0, emailList.length - 1);
    });
    $('#input-to').val(emailList); 
    $('#search-value').text('');
    slideScreen(stepTwoScreen, stepThreeScreen);
    progressBarContainer.removeClass('span6 offset3');
    progressBarContainer.addClass('span12');
    progressBar.css('width', '70%');
  });
  $('#back-event-btn').click(function(e){
    e.preventDefault();
    slideScreen(stepFourScreen, stepTwoScreen);
    progressBar.css('width', '40%');
  });
  $('#event-btn').click(function(e){
    slideScreen(stepTwoScreen, stepFourScreen);
    progressBarContainer.removeClass('span6 offset3');
    progressBarContainer.addClass('span12');
    progressBar.css('width', '70%');
  });
  $('#back-btn').click(function(e){
    slideScreen(stepTwoScreen, stepOneScreen);
    progressBar.css('width', '20%');
  });
  $('#back-send-btn').click(function(e){
    e.preventDefault();
    slideScreen(stepThreeScreen, stepTwoScreen);
    progressBar.css('width', '40%');
  });
  $('#send-btn').click(function(e){
    var sendees = $("#input-to").attr("value");
    var subject = $("#input-subject").attr("value");
    var message = $("#input-msg").attr("value");
    if ( sendees !== null ){
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
    }
  });

  $('#reset-btn').click(function(e){
    slideScreen(finishScreen, stepOneScreen);
    progressBarContainer.addClass('span6 offset3');
    progressBarContainer.removeClass('span12');
    progressBar.css('width', '20%');
  });
}); 

// Feed in DOM elements to switch between two div screens
function slideScreen(curr, next) {
  curr.hide();
  next.css("visibility", "visible");
  next.fadeIn();
}

function loadStepTwo(){
  slideScreen(stepOneScreen, stepTwoScreen);
  progressBar.css('width', '40%');
}
// Setup LI as check boxes
function setupLI(){
  $('img').each(function(){
    $(this).load(function(){
      if (this.height < this.width)
      $(this).addClass('portrait-img');
    });
  });
  $('li.dist-group-sep').on('click', function(e){
    if ($(this).hasClass('todo-done')) {
      $('.group' + e.target.dataset.group).removeClass('todo-done');
      console.log(this);
    } else {
      $('.group' + e.target.dataset.group).addClass('todo-done');
    }
  });
  $('li').click(function(e){
    if ($(this).hasClass('todo-done'))
      $(this).removeClass('todo-done');
    else
      $(this).addClass('todo-done');
  });
}

function checkBeginBtn() {
  //if (!($('#fb-login').is(':disabled')) || !($('#gmail-login').is(':disabled'))) {
  console.log('checking beging btn');
  if (mode !== null && ($('#gmail-login').is(':disabled'))) {
    $('#start-btn').attr('disabled',false);
    $('#start-btn').addClass('btn-primary');
  }
}

