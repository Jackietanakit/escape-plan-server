const { equals, makeId } = require('../util/helper');
const { GameElement } = require('../util/gameElement');

var socketRoom = [];
module.exports = (io) => {
  const createRoom = function () {
    const socket = this;

    var roomId = makeId(6);
    socket.join(roomId);
    socket.roomId = roomId;
    var roomData = new GameElement(roomId, socket.userName);
    socketRoom.push(roomData);
    io.emit('room:create-done', roomData.roomId);
  };

  const joinRoom = function (roomId) {
    const socket = this;
    socket.join(roomId);
    socket.roomId = roomId;

    var i = socketRoom.findIndex((x) => x.roomId === roomId);
    socketRoom[i].addUser(socket.userName);

    if (socketRoom[i].currentUser.length == 2)
      socketRoom[i].status = 'starting';

    io.emit('room:join-done', socketRoom[i]);
  };

  const updateCoor = function (coordinate, role) {
    const socket = this;
    let message = '';
    var i = socketRoom.findIndex((x) => x.roomId === socket.roomId);
    var mapDetail = socketRoom[i].mapDetail;
    if (role == 'prisoner') {
      if (equals(coordinate, mapDetail.hCoor)) {
        message = 'Prisoner win!';
      } else {
        mapDetail.map[mapDetail.pCoor[0]][mapDetail.pCoor[1]] = 0;
        mapDetail.map[coordinate[0]][coordinate[1]] = 'p';
        mapDetail.pCoor = coordinate;
      }
    } else if (role == 'warder') {
      if (equals(coordinate, mapDetail.pCoor)) {
        message = 'Warder win!';
      } else {
        mapDetail.map[mapDetail.pCoor[0]][mapDetail.pCoor[1]] = 0;
        mapDetail.map[coordinate[0]][coordinate[1]] = 'p';
        mapDetail.pCoor = coordinate;
      }
    }
    socketRoom[i].mapDetail = mapDetail;
    io.emit('coor:update-done', socketRoom[i].mapDetail, message);
  };

  return {
    createRoom,
    joinRoom,
    updateCoor,
  };
};
