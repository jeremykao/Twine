// Where UI-related JS and other general JS goes
var Move = function() {
  $("#step-one").hide();
  $("#step-two").fadeIn();
};
var Show3 = function() {
	$("#step-two").hide();
	$("#step-three").show();
}

var Main = function() {
  $("#step-two").hide();
  $("#step-three").hide();
  $("#search-btn").click(Move);
  $("#continue-btn").click(Show3);
};

$(document).ready(Main);
