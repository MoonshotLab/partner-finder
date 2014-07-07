var needle = require('needle');
var Q = require('q');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('./db');

var port = process.env.PORT || 3000;
var rootURL = process.env.ROOT_URL + ':' + port;
var strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: rootURL + '/oauth2callback'
  },
  function(accessToken, refreshToken, params, profile, done){
    var user = profile;
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    db.upsertUser(user).then(function(err, newUser){
      done(null, user);
    }).catch(function(err){
      console.log('error upserting user', e);
    });
  }
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.use(strategy);


exports.getNewAccessToken = function(user){
  var deferred = Q.defer();

  var postData = [
    'refresh_token=' + user.refreshToken,
    'client_id=' + process.env.GOOGLE_CLIENT_ID,
    'client_secret=' + process.env.GOOGLE_SECRET,
    'grant_type=refresh_token'
  ].join('&');

  needle.post(
    'https://accounts.google.com/o/oauth2/token',
    postData,
    function(err, res, body){
      if(!err && body && body.access_token){
        user.accessToken = body.access_token;
        db.upsertUser(user);
        deferred.resolve(user);
      }
    }
  );

  return deferred.promise;
};

exports.passport = passport;
