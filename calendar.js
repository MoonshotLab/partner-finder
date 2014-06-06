var GoogleCalendar = require('google-calendar');

exports.getCurrentEvent = function(accessToken){
  var gcal = new GoogleCalendar.GoogleCalendar(accessToken);
  gcal.calendarList.list(function(err, calendarList){
    console.log(calendarList);

    calendarList.forEach(function(calendar){
      console.log(calendar);

      gcal.events.list(calendar.id, function(err, events){
        console.log(events);
      });
    });
  })
};
