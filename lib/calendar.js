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
      {
        timeMin: now,
        singleEvents: true,
        maxResults: 1,
        orderBy: 'startTime'
      },
      function(err, events){
        allEvents[calendar.id] = (events.items[0]);
        completed++;
        if(completed == opts.calendars.length){
          deferred.resolve(allEvents);
        }
      }
    );
  });

  return deferred.promise;
};


var getMostRecentEventFromEvents = function(allEvents){
  var mostRecent = {};

  for(var key in allEvents){
    if(!mostRecent.start && allEvents[key] && allEvents[key].start && allEvents[key].start.dateTime)
      mostRecent = allEvents[key];
    else{
      if(allEvents[key] && allEvents[key].start && allEvents[key].start.dateTime){
        var newEventDate = moment(allEvents[key].start.dateTime).unix();
        var mostRecentEventDate = moment(mostRecent.start.dateTime).unix();

        if(newEventDate < mostRecentEventDate)
          mostRecent = allEvents[key];
      }
    }
  }

  return mostRecent;
};


exports.getNextEvent = function(opts){
  var deferred = Q.defer();
  var gcal = new GoogleCalendar.GoogleCalendar(opts.accessToken);

  getAllCalendars(gcal)
    .then(getEventsFromCalendars)
    .then(getMostRecentEventFromEvents)
    .then(function(calendarEvent){
      deferred.resolve(calendarEvent);
    });

  return deferred.promise;
};
