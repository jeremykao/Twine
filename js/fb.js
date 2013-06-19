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

  function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
      });
    }
 var search_term = document.getElementById("search-bar");

document.getElementById("search-btn").onclick = function(){
  FB.api({
      method: 'fql.query',
      query: "SELECT username from user where uid = " + search_term.value 
      /**
      query: "SELECT username, name, current_location.latitude, current_location.longitude "
              + "from user where uid IN (SELECT uid FROM page_fan WHERE page_id IN (SELECT page_id FROM page WHERE name = '"
              + search_term.value + "' ) AND uid IN (SELECT uid2 FROM friend WHERE uid1=me()))"
              **/
  }, function(response){
      console.log(response);
  });
  //Array of Friends
  var friendArray = response.data;
  //var name = name.data;
  //var email = username.data + "@facebook.com";
  console.log(friendArray);
};
  function fbLogin(){
    FB.login(function(response){
    }, {scope: 'email, user_likes, xmpp_login, friends_activities, friends_interests, friends_likes, user_location, friends_location'});
  }
  

  
  
