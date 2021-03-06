accessToken = "";

window.fbAsyncInit = function() {
  FB.init({
    appId      : '396413780478593',
    status     : true,                // Check Facebook Login status
    oauth      : true,
    xfbml      : true                 // Look for social plugins on the page
  });

  FB.getLoginStatus(function(response){
    if ( response.status === 'connected'){
      changeFBButton();
      checkBeginBtn();
      mode = false;
    } else {
      $("#fb-login").click(function(){
        fbLogin();
      });
    }
  });

  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      mode = false;
      accessToken = response['authResponse']['accessToken'];
      checkBeginBtn();
      // testAPI();
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

var search_term = "";
var queryStr = "";
$("#search-bar").bind("change", function(){
  search_term = $(this).val();
  queryStr = "SELECT username, name, pic, pic_big, pic_small, current_location.state, current_location.latitude, current_location.longitude from user where uid IN (SELECT uid FROM page_fan WHERE page_id IN (SELECT page_id FROM page WHERE name='"+ search_term+"' ) AND uid IN (SELECT uid2 FROM friend WHERE uid1=me() ))";
});

var selfLat;
var selfLong;
var result;
var LIMIT = 100;

$(window).bind("load", function(){
  document.getElementById("search-btn").onclick = function(){
    var pages = {};
    var userLOL = []; //Questionable
    var l = Ladda.create(document.querySelector('#search-btn'));
    var alertTimeout;
    if ($('#search-bar').val() === ""){
      window.clearTimeout(alertTimeout);
      searchAlert.text('Please enter a search term.');
      searchAlert.css('display', 'block');
      searchAlert.css('opacity', '1');
      alertTimeout = window.setTimeout(function(){
        searchAlert.css('display', 'none');  
      }, 2000) ;
    } else {
      l.start();
      var similarPages = "https://graph.facebook.com/search";
      var similarPagesObj = {};
      $.ajax({
        data: {
          access_token: accessToken,
          q: search_term,
          type: 'page',
          limit: LIMIT
        },
        async: 'false',
        url: 'https://graph.facebook.com/search',
        success: function(response){
          similarPagesObj = response['data'];
          for ( var i = 0; i < similarPagesObj.length; ++i ){
            q = "SELECT uid, username, name, pic_big, current_location.state, current_location.latitude, current_location.longitude from user where uid IN (SELECT uid FROM page_fan WHERE page_id="+ similarPagesObj[i]['id'] +" AND uid IN (SELECT uid2 FROM friend WHERE uid1=me() ))";
            pages['query' + i] = q;
          }
          var ajaxCount = 0;
          $.each(pages, function(key){
            $.ajax({
              data:{
                format: 'json',
                query: pages[key],
                access_token: accessToken
              },
              url: 'https://api.facebook.com/method/fql.query',
            }).done(function(response){ //closes ajax
            //console.log('response:');console.log(response);
          //console.log('page:'); console.log(pages[key]);
                if (response.length > 0){
                  for ( var i = 0; i < response.length; ++i ){
                    var seen = false;
                    for( var z = 0; z < userLOL.length; ++z){
                      if (userLOL[z].uid == response[i].uid){
                        seen = true;
                        break;
                      }
                    }
                    if (!seen)
                  userLOL.push(response[i]);
                }
              }
              ajaxCount++;
              if (ajaxCount == LIMIT){
                //console.log("UserLOL:")
                //console.log(userLOL);
              }
            }); //closes done
          }); //closes each

          result = userLOL;
          $('#results-list').html('');
          var userList = '', emailList = '';

          //  Geolocation
          //console.log(userLOL);
          var async = function(){
            result = filterByDistance(10000,selfLat,selfLong,userLOL);
            populate();
          };

          getCoords(async);

          var populate = function() { 
            var distGroups = [0, 0, 0, 0, 0, 0];
            for (var i = 0; i < result.length; i++){
              var user = result[i];
              var newLI = '';
              if (distGroups[user.distGroup] === 0) {
                newLI += '<li class="todo-done dist-group-sep';
                switch (user.distGroup) {
                  case 0:
                  newLI += '" data-group="0">< 5 miles away';
                  break;
                  case 1:
                  newLI += '" data-group="1">between 5 and 10 miles away';
                  break;
                  case 2:
                  newLI += '" data-group="2">between 10 and 25 miles away';
                  break;
                  case 3:
                  newLI += '" data-group="3">between 25 and 50 miles away';
                  break;
                  case 4:
                  newLI += '" data-group="4">> 50 miles away';
                  break;
                  case 5:
                  newLI += '" data-group="5">location unknown';
                  break;
                }
                newLI += '</li>';
                distGroups[user.distGroup]++;
              }
              if (i !== 0) {
                userList += ', ' + user.name;
              } else if (i === result.length - 1) {
                userList += ', and ' + user.name + '.';
              } else {
                userList += user.name;
              }
              newLI += '<li class="todo-done group' + user.distGroup +'"><div class="todo-icon"><img style=";" src="' + user.pic_big+ '"/></div>';
              newLI += '<div class="todo-content"><h4 class="todo-name"><strong>';
              newLI += user.name;
              newLI += '</strong></h4><span data-uid="'+ user.uid +'">';
              newLI += user.username;
              newLI += '@facebook.com</span></div></li>';
              $('#results-list').append(newLI);
            }

            $('#results-list').append('<li></li>');
            setupLI();

            if (($('#results-list li').length) == 1){
              window.clearTimeout(alertTimeout);
              searchAlert.text('Sorry, but none of your friends like "' + search_term + '".');
              searchAlert.css('display', 'block');
              searchAlert.css('opacity', '1');
              alertTimeout = window.setTimeout(function(){
                searchAlert.css('display', 'none');  
              }, 2000) ;
            } else {
              loadStepTwo();
            }
            l.stop();
          }; //closes populate
        } //closes success
      }); //closes ajax
    } //closes else
  }; //closes click
}); //closes bind

function fbLogin(){
  FB.login(function(response){
    if ( response.status == "connected" )
    changeFBButton();
  }, {scope: 'email, user_likes, xmpp_login, friends_activities, friends_interests, friends_likes, user_location, friends_location, manage_pages, create_event'});
}

function changeFBButton(){
  $("#fb-login").text("Logged into FB");
  $("#fb-login").removeClass("btn-info");
  $("#fb-login").attr("disabled","true");
  checkBeginBtn();
}


// Find geolocation
var getCoords = function(async){
  if (navigator.geolocation){
  return navigator.geolocation.getCurrentPosition(function(position){returnCoords(position); async();}, handleLocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};
var returnCoords = function(position){
  selfLat = position.coords.latitude;
  selfLong = position.coords.longitude; 
};
// convert to radians
var toRad = function(degrees){
  return degrees * Math.PI / 180;
};

// convert to degrees
var toDeg = function(radians){
  return radians * 180 / Math.PI;
};

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
};

function updateStatus() {
  var l = Ladda.create(document.querySelector('#search-btn'));
  l.start();
  $('#results-list').html('');
  var userList = '', emailList = '';
  for (var i = 0; i < result.length; i++){
    var user = result[i];
    var newLI = '';
    if (i !== 0) {
      userList += ', ' + user.name;
    } else if (i === result.length - 1) {
      userList += ', and ' + user.name + '.';
    } else {
      userList += user.name;
    }
    newLI += '<li class="todo-done"><div class="todo-icon"><img style=";" src="' + user.pic_big+ '"/></div>';
    newLI += '<div class="todo-content"><h4 class="todo-name"><strong>';
    newLI += user.name;
    newLI += '</strong></h4><span uid="'+ user.uid +'">';
    newLI += user.username;
    newLI += '@facebook.com</span></div></li>';
    $('#results-list').append(newLI);
  }

  $('#results-list').append('<li></li>');
  setupLI();
  if (($('#results-list li').length) == 1){
    console.log("There were no results.");
  } else {
    loadStepTwo();
  }
  l.stop();
  //document.getElementById("status").innerHTML = message;
}

function handleLocationError(error) {
  switch(error.code)
  {
    case 0:
    updateStatus();
    break;
    case 1:
    updateStatus();
    break;
    case 2:
    updateStatus();
    break;
    case 3:
    updateStatus();
    break;
  }
}

function filterByDistance(d,self_lat,self_long,friends){
  result = new Array();
  //console.log('friends:');
  //console.log(friends);
  if ((self_lat != null) && (self_long != null)){
    for (var i = 0; i < friends.length; i++){
      if (friends[i].current_location != null) {
        var friendLat = friends[i].current_location.latitude;
        var friendLong = friends[i].current_location.longitude;
        //console.log(distance(self_lat,self_long,friendLat,friendLong));
        /*if (distance(self_lat,self_long,friendLat,friendLong) <= dist){
           //console.log(friends[i].username);
           closeFriends.push(friend[i]);
         }*/
        var dist = distance(self_lat,self_long,friendLat,friendLong);
        if ((0 < dist) && (dist <= 5)){
          friends[i].distGroup = 0;
        }
        else if ((5 < dist) && (dist <= 10)){
          friends[i].distGroup = 1;
        }
        else if ((10 < dist) && (dist <= 25)){
          friends[i].distGroup = 2;
        }

        else if ((25 < dist) && (dist <= 50)){
          friends[i].distGroup = 3;
        }

        else{
          friends[i].distGroup = 4;
        }
      }
      else {
        friends[i].distGroup = 5;
      }
    }
  }
  for (var i = 0; i < friends.length; i++){
    if (friends[i].distGroup == 0){
    result.push(friends[i]);
  }
}
for (var i = 0; i < friends.length; i++){
  if (friends[i].distGroup == 1){
  result.push(friends[i]);
}
  }
  for (var i = 0; i < friends.length; i++){
    if (friends[i].distGroup == 2){
    result.push(friends[i]);
  }
}
for (var i = 0; i < friends.length; i++){
  if (friends[i].distGroup == 3){
  result.push(friends[i]);
}
  }
  for (var i = 0; i < friends.length; i++){
    if (friends[i].distGroup == 4){
    result.push(friends[i]);
  }
}
for (var i = 0; i < friends.length; i++){
  if (friends[i].distGroup == 5){
  result.push(friends[i]);
}
  }
  //console.log(friends);
  //console.log("Result: ")
  //console.log(result);
  return result;

}
var eventId = '';
$("#event-btn-invite").click(function(){
  var userStr = '';
  $('li.todo-done').each(function(){
    if (!$(this).hasClass('dist-group-sep')) {
      var uid = ($(this).children('.todo-content').children('span').attr("data-uid"));
      userStr += uid + ',';
    }
  });
  userStr = userStr.substr(0, userStr.length - 1);

  var name = $("#input-event-name").attr("value");
  var startTime = $("#input-start-time").attr("value");
  var endTime = $("#input-end-time").attr("value");
  var location = $("#input-event-loc").attr("value");
  var privacy = $("#input-event-privacy").attr("value");
  var description = $("#input-event-desc").attr("value");
  if(( name !== "") && (startTime !== "")){
    var userIdStr = "/" + userId; 
    FB.api("/"+ userId + "/events", 'POST',   // Creates event
    {
      name: name,
      start_time: startTime,
      end_time: endTime,
      description: description,
      location: location,
      privacy_type: privacy,
      access_token: accessToken,
    }, function( response ){  // Invites users
        console.log('FB Event Response2:'); console.log(response);
      eventId = response['id'];
      console.log(eventId);
      console.log("/" + eventId + "/invited"); console.log(userStr);
      FB.api("/" + eventId + "/invited", 'POST',
      {
        users: userStr
      }, function( response ){
        console.log('FB Event Response:'); console.log(response);
        $("#input-event-name").val("");
        $("#input-start-time").val("");
        $("#input-end-time").val("");
        $("#input-event-loc").val("");
        $("#input-event-desc").val("");
        $("#success-msg").html("You have successfully created your event, and invitations to the selected friends have been sent. Thank you." );
        slideScreen($('#step-four'), $('#finished'));
        progressBar.css('width', '100%');
      });
    });
  }
});
