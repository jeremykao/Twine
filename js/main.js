// Where UI-related JS and other general JS goes
// CHANGE DIV ID'S TO MATCH THIS JAVASCRIPT!!!!!!
var Move = function() {
  $("#step1").hide();
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
  $("#results").hide();
  $("#email").hide();
  $("#but").click(Move);
  $("#two").click(Show3);
};

$(document).ready(Main);
