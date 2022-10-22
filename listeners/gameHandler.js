const { updateScore } = require('../listeners/userHandler');

module.exports = (io, socketRooms) => {
  const updateCoor = function (coor, isWarder) {
    let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
    let mapDetail = socketRooms[i].mapDetail;
    if (isWarder) {
      mapDetail.map[mapDetail.wCoor];
    }

    io.emit('game:coor-done', coor, isWarder);
  };

  const playAgain = function (name) {
    // generate new map and give user role
    let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
    socketRooms[i].createMap();
    socketRooms[i].giveRole(name);
    io.emit('game:again-done', socketRooms[i]);
  };

  return {
    updateCoor,
    playAgain,
  };
};
