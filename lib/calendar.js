var Q = require('q');
var moment = require('moment-timezone');
var GoogleCalendar = require('google-calendar');


var getUserCalendars = function(opts){
  var deferred = Q.defer();

  if(opts.user.primaryEmail){
    opts.gcal.calendars.get(
      opts.user.primaryEmail,
      function(err, calendar){
        if(err) console.log('Error fetching calendar:', err);

        deferred.resolve({
          user: opts.user,
          gcal: opts.gcal,
          calendars: [calendar]
        });
      }
    );
  } else{

    // if for some reason there's not a barkley calendar...
    opts.gcal.calendarList.list(function(err, calendars){
      if(err) console.log('Error fetching calendar:', err);

      if(calendars.items){
        deferred.resolve({
          user: opts.user,
          gcal: opts.gcal,
          calendars: calendars.items
        });
      }
    });
  }

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


exports.getNextEvent = function(user){
  var deferred = Q.defer();
  var gcal = new GoogleCalendar.GoogleCalendar(user.accessToken);

  // find the user's primary e-mail address
  user.emails.forEach(function(email){
    if(email.value.indexOf('barkleyus.com') != -1){
      user.primaryEmail = email.value;
    }
  });

  getUserCalendars({ user: user, gcal: gcal})
    .then(getEventsFromCalendars)
    .then(getMostRecentEventFromEvents)
    .then(function(calendarEvent){
      deferred.resolve(calendarEvent);
    })
    .catch(function(err){
      console.log('Error getting events from calendar:', err);
    });

  return deferred.promise;
};
