var Q = require('q');
var moment = require('moment-timezone');
var GoogleCalendar = require('google-calendar');


var getAllCalendars = function(gcal){
  var deferred = Q.defer();

  gcal.calendarList.list(function(err, calendars){
    if(err) console.log(err);

    if(calendars.items){
      deferred.resolve({
        gcal: gcal,
        calendars: calendars.items
      });
    }
  });

  return deferred.promise;
};


var getEventsFromCalendars = function(opts){
  var deferred = Q.defer();
  var completed = 0;
  var allEvents = {};

  opts.calendars.forEach(function(calendar){
    var now = moment().tz(calendar.timeZone).format();

    opts.gcal.events.list(
      calendar.id,
      { timeMin: now, maxResults: 1},
      function(err, events){
        allEvents[calendar.id] = (events.items);
        completed++;
        if(completed == opts.calendars.length){
          deferred.resolve(allEvents);
        }
      }
    );
  });

  return deferred.promise;
};


exports.getAllEvents = function(opts){
  var deferred = Q.defer();
  var gcal = new GoogleCalendar.GoogleCalendar(opts.accessToken);

  getAllCalendars(gcal)
    .then(getEventsFromCalendars)
    .then(function(allEvents){
      deferred.resolve(allEvents);
    }
  );

  return deferred.promise;
};
