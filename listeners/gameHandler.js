const { updateScore } = require('../listeners/userHandler');

module.exports = (io, socketRooms) => {
  const updateCoor = function (coor, isWarder) {
    try {
      let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
      let mapDetail = socketRooms[i].mapDetail;
      if (isWarder) {
        mapDetail.map[mapDetail.wCoor];
      }

      io.emit('game:coor-done', coor, isWarder);
    } catch (error) {
      console.error(error);
    }
  };

  const playAgain = function (name) {
    try {
      // generate new map and give user role
      let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
      socketRooms[i].createMap();
      socketRooms[i].giveRole(name);
      io.emit('game:again-done', socketRooms[i]);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    updateCoor,
    playAgain,
  };
};
