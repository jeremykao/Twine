// Where UI-related JS and other general JS goes
// CHANGE DIV ID'S TO MATCH THIS JAVASCRIPT!!!!!!
var Move = function() {
  $("#step-one").hide();
	$("#allcontent").animate({
		"margin-top": "1%"
	});
	$("#results").show();
};
var Show3 = function() {
	$("#results").hide();
	$("#email").show();
}

var Main = function() {
  $("#step-two").hide();
  $("#step-three").hide();
  $("#search-btn").click(Move);
  $("#continue-btn").click(Show3);
};

$(document).ready(Main);
