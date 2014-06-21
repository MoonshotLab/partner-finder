var roomMap = require('../config/roomMap');

var attachFloorToEvent = function(calendarEvent){
  calendarEvent.floor = '?';

  if(typeof calendarEvent.location === 'string'){
    for(var key in roomMap.floors){
      calendarEvent.floor = findFloor(
        key, roomMap.floors[key], calendarEvent.location
      );

      if(calendarEvent.floor != '?') break;
    }
  }

  return calendarEvent;
};


var findFloor = function(floor, roomsOnFloor, eventLocation){
  var selectedFloor = '?';

  roomsOnFloor.forEach(function(room){
    eventLocation = eventLocation.toLowerCase();
    room = room.toLowerCase();

    if(eventLocation.indexOf(room) != -1){
      selectedFloor = floor;
    }
    else if(room.indexOf(eventLocation) != -1){
      selectedFloor = floor;
    }
  });

  return selectedFloor;
};

exports.attachFloorToEvent = attachFloorToEvent;
