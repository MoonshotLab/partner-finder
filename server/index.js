var express = require('express');
var passport = require('./lib/auth').passport;
var routes = require('./lib/routes');
var spark = require('./lib/spark');
var PORT = process.env.PORT || 3000;


var app = express();
app.use(passport.initialize());
var server = require('http').Server(app);
spark.init();

server.listen(PORT, function(){
  console.log('server listening on port', PORT);
});

app.get('/', passport.authenticate('google', {
  accessType: 'offline',
  approvalPrompt: 'force',
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}), routes.home);

app.get('/login-error', routes.loginError);

app.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/login-error'}),
  routes.oauth
);

app.get('/:sparkUserId/event', routes.getNextCalendarEvent);
