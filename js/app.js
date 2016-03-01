Stamplay.init("scriptly");

// Create an instance of the Stamplay User Model
var user = new Stamplay.User().Model;


// Login Button Event Listner, init Github Login OAuth on "click"
$('#login-button').on('click',function(){
    user.login('github');
});

$('#logout-button').on('click', function() {
    user.logout();
});

// Running the currentUser method, onload to check if a user is already signed in.
user.currentUser()
    .then(function(){
    if(user.isLogged()) {
        $("#message-input").attr("disabled", false);
        $("#message-input").attr("placeholder", "New Message");
        $("#login-button").hide();
        $("#logout-button").show();
    } else {
        $("#login-button").show();
        $("#logout-button").hide();
    }
});

$('#postMsgBtn').on("click", function(e){
    e.preventDefault();
    if(!$('#message-input').val() == ''){
    // Create an instance of the Stamplay message model
      var message = new Stamplay.Cobject('message').Model;
      var comment = $('#message-input').val();
      message.set('comment', comment);
      message.set('avatar', user.get('profileImg'));
      message.set('username', user.instance.identities.github._json.login);
      message.save();
      //clear input content
      $('#message-input').val('');
    }
});

// Create an instance of the Stamplay Collection For the Custom Message Object
var feed = new Stamplay.Cobject('message').Collection;
  // Fetch 100 messages, sort by dt_created
  feed.fetch({page:1, per_page:100, sort: '-dt_create'}).then(function(){
  	feed.instance.forEach(function(msg){
        var elemStr = "";
  		var d = new Date(msg.instance.dt_create);
			msg.instance.date = d.toLocaleString('en-EN').split(",").join("-");
            elemStr += "<div class='col s12 z-depth-1 flex grey lighten-3 message'>";
                elemStr += "<div class='col l2 s3 valign-wrapper'>";
                  elemStr += "<div class='valign'>";
                    elemStr += "<img class='responsive-img valign z-depth-0 circle avatar-container avatar' src='" + msg.instance.avatar + "'>";
                    elemStr += "<div>" + "<small>" + "<b>  - " +  msg.instance.username + "</b>" + "</small>" + "</div>";
                    elemStr += "<small>" + msg.instance.date + "</small>";
                  elemStr += "</div>";
                elemStr += "</div>";
                elemStr += "<div class='col l10 s9 section-comment'>";
                  elemStr += "<div class='grey-text text-darken-2 lightweight'>" + "<pre>" + msg.instance.comment + "</pre>" + "</div>";
                elemStr += "</div>";
            elemStr += "</div>";
            $("#output").append(elemStr);
		});
});

// Create a Pusher Instance
var pusher = new Pusher('6c93ae2165f669a60d1f');
// Listen to a channel
var channel = pusher.subscribe('public');

// Bind an function to an event within the subscribed channel
channel.bind('message', function(msg) {
    // Use event data to push updated messages into message stream.
    var elemStr = "";
    var d = new Date(msg.dt_create);
        msg.date = d.toLocaleString('en-EN').split(",").join("-");
        elemStr += "<div class='animated bounceIn col s12 z-depth-1 flex grey lighten-3 message'>";
            elemStr += "<div class='col l2 s3 valign-wrapper'>";
              elemStr += "<div class='valign'>";
                elemStr += "<img class='responsive-img valign z-depth-0 circle avatar-container avatar' src='" + msg.avatar + "'>";
                elemStr += "<div>" + "<small>" + "<b>  - " +  msg.username + "</b>" + "</small>" + "</div>";
                elemStr += "<small>" + msg.date + "</small>";
              elemStr += "</div>";
            elemStr += "</div>";
            elemStr += "<div class='col l10 s9 section-comment'>";
              elemStr += "<div class='grey-text text-darken-2 lightweight'>" + "<pre>" + msg.comment + "</pre>" +"<div>";
            elemStr += "</div>";
        elemStr += "</div>";
        $("#output").prepend(elemStr);
});
