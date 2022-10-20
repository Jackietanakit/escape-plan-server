const { updateScore } = require('../listeners/userHandler');

module.exports = (io, socketRoom) => {
  const forwardCoor = function (coor, role) {
    io.emit('coor:forward-done', coor, role);
  };

  const playAgain = function (name) {
    let i = socketRoom.findIndex((x) => x.roomId === socket.roomId);
    socketRoom[i].createMap();
    socketRoom[i].giveRole(name);
    io.emit;
  };

  return {
    forwardCoor,
    playAgain,
  };
};
