var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('./db');
var rootURL = process.env.ROOT_URL || 'http://localhost:3000';
var strategy = new GoogleStrategy(
  {
    clientID: process.env.PARTNER_FINDER_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PARTNER_FINDER_GOOGLE_SECRET,
    callbackURL: rootURL + '/oauth2callback'
  },
  function(accessToken, refreshToken, params, profile, done){
    db.upsertUser({
      refreshToken: refreshToken,
      accessToken: accessToken,
      profile: profile
    }).then(function(err, user){
      done(null, profile);
    });
  }
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.use(strategy);


exports.passport = passport;
