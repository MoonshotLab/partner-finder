var userMap = require('./userMap');
var db = require('./db');

exports.home = function(req, res){
  res.send('welcome to my HOME PAGE!');
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
    db.findUser(selectedUser, function(err, user){
      res.send(user);
    });
  } else{
    res.send({
      error: 'No user with matching button id. Check out the list below',
      users: userMap.users
    });
  }
};
