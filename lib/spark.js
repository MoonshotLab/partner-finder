var spark = require('sparknode');
var userMap = require('../config/userMap');
var calendar = require('./calendar');
var db = require('./db');
var auth = require('./auth');
var utils = require('./utils');


var handleError = function(err){
  console.log('Spark Error', err, '\n');
};

var handleConnection = function(e){
  console.log('Spark Connected', e, '\n');
};

var handleEvent = function(e){
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

        utils.attachFloorToEvent(calendarEvent);
        console.log('attempting to notify spark of event:', calendarEvent, '\n\n');

        // Pass params to spark n the form of {userId,floorNumber}
        var params = sparkUserId + ',' + calendarEvent.floor;
        core.notify(params, function(err, data){
          if(err) console.log('error notifying spark', err);
        });
      }
    );
  }
};

var init = function(){
  var core = new spark.Core(
    process.env.SPARK_ACCESS_TOKEN,
    process.env.SPARK_CORE_ID,
    {}
  );

  core.on('connect', handleConnection);
  core.on('error', handleError);
  core.on('find-user', handleEvent);
};


exports.init = init;
