var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var user = null;

MongoClient.connect(
  process.env.PARTNER_FINDER_DB_CONNECT,
  function(err, db){
    if(err) throw err;

    user = db.collection('user');
  }
);


exports.upsertUser = function(opts, next){
  var deferred = Q.defer();
  var profile = opts.profile;
  var accessToken = opts.accessToken;
  var newUser = {
    googleId: profile.id,
    emails: profile.emails,
    name: profile.name,
    accessToken: accessToken
  };

  user.update(
    { googleId: profile.id },
    { $set: newUser },
    { upsert: true },

    function(err, newUser, stats){
      console.log(newUser);
      if(!err){
        if(stats.updatedExisting)
          console.log('Updated user');
        else
          console.log('Created new user');

        deferred.resolve(newUser);
      }
    }
  );

  return deferred.promise;
};


exports.findUser = function(opts, next){
  var deferred = Q.defer();

  user.findOne({
    emails: { $in: [{value: opts.email}] }
  }, function(err, foundUser){
    if(!err) deferred.resolve(foundUser);
  });

  return deferred.promise;
};
