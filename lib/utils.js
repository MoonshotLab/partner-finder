var roomMap = require('../config/roomMap');

var attachFloorToEvent = function(calendarEvent){

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

  calendarEvent.floor = floor;
  return calendarEvent;
};

exports.attachFloorToEvent = attachFloorToEvent;
