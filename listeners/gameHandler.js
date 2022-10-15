const equals = require('../util/helper');

module.exports = (io) => {
  const createMap = function () {
    const socket = this;
    // function to create Map

    io.emit('map:create-done', socket.mapDetail);
  };

  const updateCoor = function (coordinate, role) {
    const socket = this;
    let map = [];
    let message = '';
    if (role == 'prisoner') {
      if (equals(coordinate, socket.hCoor)) {
        io.emit('coor:update-done', 'Prisoner Win!');
      } else {
        socket.map[socket.pCoor[0]][socket.pCoor[1]] = 0;
        socket.map[coordinate[0]][coordinate[1]] = 'p';
        socket.pCoor = coordinate;
        io.emit('coor:update-done', socket.map);
      }
    } else if (role == 'warder') {
      if (equals(coordinate, socket.pCoor)) {
        io.emit('coor:update-done', 'Warder Win!');
      } else {
        socket.map[socket.wCoor[0]][socket.wCoor[1]] = 0;
        socket.map[coordinate[0]][coordinate[1]] = 'w';
        socket.wCoor = coordinate;
        io.emit('coor:update-done', socket.map);
      }
    }
    io.emit('coor:update-done', map, message);
  };

  return {
    createMap,
    updateCoor,
  };
};
