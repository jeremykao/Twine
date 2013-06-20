accessToken = "";

window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '396413780478593',                        // App ID from the app dashboard
      status     : true,                                  // Check Facebook Login status
      oauth      : true,
      xfbml      : true                                  // Look for social plugins on the page
    });
    
    FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      accessToken = response['authResponse']['accessToken'];
      console.log(accessToken);
      testAPI();
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      fbLogin();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      fbLogin();
    }
  });
    // Additional initialization code such as adding Event Listeners goes here
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  var userId = 0;
  function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + response.id + '.');
        userId = response.id;
      });
    }
  search_term = "";
  var queryStr = "";
 $("#search-bar").bind("change", function(){
    search_term = $(this).attr("value");
    queryStr = "SELECT username, name, current_location.latitude, current_location.longitude from user where uid IN (SELECT uid FROM page_fan WHERE page_id IN (SELECT page_id FROM page WHERE name='"+ search_term+"' ) AND uid IN (SELECT uid2 FROM friend WHERE uid1=me() ))";
  });



  $(window).bind("load", function(){
    $('#search-bar').keyup(function(event){
             if (event.keyCode == 13){
                 $('#search-btn').click();
             }
             });
document.getElementById("search-btn").onclick = function(){
  /*FB.api({
      method: 'fql.multiquery',
      //query: "SELECT username from user where uid = " + search_term.value 
      queries: {
        query1: 'SELECT uid2 FROM friend WHERE uid1= me() LIMIT 10',
        query2: 'SELECT uid FROM page_fan WHERE uid IN (#query1)',
      }
      //access_token: 'CAACEdEose0cBAKXIvjd6T1BmAPoQ8M6JbSP4p0IHYZBgTZC1xyrG9i1cNmXj3G3ZCogDeNGXKxURW9MlIKk5GHMubBzLvniGYpI0theJ6q65ASmCRJxrpWYACa3BeT8SoZBR1ToZAF5rXcjlg8RYQA4ZAwMGI28lXhxCsjhAzH9QZDZD'
      
  }, function(response){
      console.log(query2);
      //console.log(accessToken);
      if (response == null)
        console.log("Response is null.");
      else
        console.log(response);
  }*/
     $.ajax({
        data: {
          format: 'json',
          query: queryStr,
          access_token: accessToken
        },
        url: 'https://api.facebook.com/method/fql.query'
        

        }).done(function(response){
          console.log(response);
          $('#results-list').html('');
          var userList = '', emailList = '';
          for (var i = 0; i < response.length; i++){
            var user = response[i];
            var newLI = '';
            if (i !== 0) {
              userList += ', ' + user.name;
            } else if (i === response.length - 1) {
              userList += ', and ' + user.name + '.';
            } else {
              userList += user.name;
            }
            newLI += '<li class="todo-done"><div class="todo-icon fui-user"></div>';
            newLI += '<div class="todo-content"><h4 class="todo-name"><strong>';
            newLI += user.name;
            newLI += '</strong></h4><span>';
            newLI += user.username;
            newLI += '@facebook.com</span></div></li>';
            $('#results-list').append(newLI);
          }
          setupLI();
          loadStepTwo();
          $('#success-msg').html('Your message has been sent to ' + userList);
  });};
  //Array of Friends
  //var friendArray = response.data;
  //var name = name.data;
  //var email = username.data + "@facebook.com";
  //console.log(friendArray);
  $("#fb-login").click(function(){
    fbLogin();
  });
});
  function fbLogin(){
    FB.login(function(response){
      if ( response.status == "connected" )
        $("#fb-login").remove();
    }, {perms: 'email, user_likes, xmpp_login, friends_activities, friends_interests, friends_likes, user_location, friends_location, manage_pages'});
  }
  //https://api.facebook.com/method/fql.query?format=json&query=SELECT+username%2C+name%2C+current_location.latitude%2C+current_location.longitude+from+user+where+uid+IN+(SELECT+uid+FROM+page_fan+WHERE+page_id+IN+(SELECT+page_id+FROM+page+WHERE+name%3D%22burn+notice%22)+AND+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1%3Dme()))&access_token=CAACEdEose0cBAE518wNMMSAhLEZCXOPvfhi8uDkZAZBNGZCZAiWJZCZA2019uPZCzLAzy91ZBqcEyZB0nl87dMd6wdwPbBfvfRcqAePQZBGMtKWBeqmF1KWZAjYQZBl0Ah0KWIaFtpVwnBzxRWQZCnD3ZApZBGJrF2prmrCkLjJ9Ii9riVeWlQZDZD
  
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

var filterByDistance = function(dist,selfLat,selfLong,friends){
    console.log("here "+friendLats);
	for (var key in friends){
		console.log("friend "+friends[key]);
		console.log("latitude "+friends[key].current_location.latitude);
		console.log("longitude "+friends[key].current_location.longitude);
		if (distance(selfLat,selfLong,friends[key])<=dist){
			return friends[key];
		}
	}
}
