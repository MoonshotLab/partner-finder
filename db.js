var MongoClient = require('mongodb').MongoClient;
var user = null;

MongoClient.connect(
  process.env.PARTNER_FINDER_DB_CONNECT,
  function(err, db){
    if(err) throw err;

    user = db.collection('user');
  }
);


exports.upsertUser = function(opts){
  var profile = opts.profile;
  var accessToken = opts.accessToken;

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
      if(stats.updatedExisted)
        console.log('Updated user');
      else
        console.log('Created new user');
    }
  );
}
