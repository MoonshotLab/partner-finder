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
  var profile = opts.profile;
  var accessToken = opts.accessToken;

  console.log(profile);

  user.update(
    { googleId: profile.id },
    { $set: {
        googleId: profile.id,
        emails: profile.emails,
        name: profile.name,
        accessToken: accessToken
    } },
    { upsert: true },

    function(err, uhh, stats){
      if(stats.updatedExisting)
        console.log('Updated user');
      else
        console.log('Created new user');

      if(next) next(err, uhh);
    }
  );
};


exports.findUser = function(opts, next){
  user.findOne({
    emails: { $in: [{value: opts.email}] }
  }, function(err, user){
    if(next) next(err, user);
  });
};
