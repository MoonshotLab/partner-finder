var spark = require('sparknode');
var userMap = require('../config/userMap');
var roomMap = require('../config/roomMap');
var calendar = require('./calendar');
var db = require('./db');
var auth = require('./auth');


var findFloor = function(calendarEvent){
  var floor = '?';

  if(calendarEvent.location){
    var location = calendarEvent.location;

    for(var key in roomMap.floors){
      roomMap.floors[key].forEach(function(room){
        if(location.indexOf(room) != -1)
          floor = key;
      });

      if(floor != '?') break;
    }
  }

  return floor;
};


exports.init = function(){
  var core = new spark.Core(
    process.env.SPARK_ACCESS_TOKEN,
    process.env.SPARK_CORE_ID,
    {}
  );

  core.on('error', function(e){
    console.log('error connecting', e);
  });

  core.on('connect', function(e){
    console.log('connected', e);
  });

  core.on('find-user', function(e){
    var data = JSON.parse(e.data);
    var selectedUser = null;
    var sparkUserId = 0;

    userMap.users.forEach(function(user){
      if(user.sparkId == data.userId){
        selectedUser = user;
        sparkUserId = user.sparkId;
      }
    });

    if(selectedUser){
      db.findUser(selectedUser)
        .then(auth.getNewAccessToken)
        .then(calendar.getNextEvent)
        .then(function(calendarEvent){
          console.log('calendar event:', calendarEvent);

          // Pass params to spark n the form of {userId,floorNumber}
          var params = sparkUserId + ',' + findFloor(calendarEvent);
          core.notify(params, function(err, data){
            if(err) console.log(err);
            else
              console.log('notified spark of request at ', data);
          });
        }
      );
    }
  });

  core.on('error', function(err){
    console.log(err);
  });
};
