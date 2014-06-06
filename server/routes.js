exports.home = function(req, res){
  res.send('welcome to my HOME PAGE!');
};


exports.loginError = function(req, res){
  res.send('login failed');
};


exports.oauth = function(req, res){
  res.send('authenticated');
};
