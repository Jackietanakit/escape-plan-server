const { updateScore } = require('../listeners/userHandler');

module.exports = (io, socketRooms) => {
  const forwardCoor = function (coor, role) {
    io.emit('game:coor-done', coor, role);
  };

  const playAgain = function (name) {
    let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
    socketRooms[i].createMap();
    socketRooms[i].giveRole(name);
    io.emit('game:again-done', socketRooms[i]);
  };

  return {
    forwardCoor,
    playAgain,
  };
};
