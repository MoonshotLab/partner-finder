var userMap = require('../config/userMap');
var auth = require('./auth');
var db = require('./db');
var calendar = require('./calendar');


// If this gets displayed, we know the login
// somehow got messed up
exports.home = function(req, res){
  res.send('failure to complete oauth');
};


exports.loginError = function(req, res){
  res.send('login failed');
};


exports.oauth = function(req, res){
  res.send('authenticated');
};


exports.getCalendarEvents = function(req, res){
  var selectedUser = null;
  userMap.users.forEach(function(user){
    if(user.buttonId == req.params.userButtonId)
      selectedUser = user;
  });

  if(selectedUser){
    db.findUser(selectedUser)
      .then(auth.getNewAccessToken)
      .then(calendar.getAllEvents)
      .then(function(events){
        res.send(events);
      }
    );
  } else{
    res.send({
      error: 'No user with matching button id. Check out the list below',
      users: userMap.users
    });
  }
};
