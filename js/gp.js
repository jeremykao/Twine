(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client:plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

function signinCallback(result) {
  if (result['access_token']) {
    document.getElementById('gp-login').classList.remove('btn-info');
    document.getElementById('gp-login').disabled = true;
    document.getElementById('start-btn').disabled = false;
    document.getElementById('start-btn').classList.add('btn-primary');
    mode = true;  // Sets mode to Google+
  } else {
    console.log('Error with g+ signin');
  }
}
