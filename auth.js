var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var db = require('./db');

// Passport Config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PARTNER_FINDER_GOOGLE_CLIENT_ID,
      clientSecret: process.env.PARTNER_FINDER_GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/oauth2callback',
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
    },
    function(accessToken, refreshToken, params, profile, done){
      db.upsertUser({
        accessToken: accessToken,
        profile: profile
      }).then(function(err, user){
        done(null, profile);
      });
    }
  )
);


passport.serializeUser(function(user, done) {
  done(null, user);
});


exports.passport = passport;
