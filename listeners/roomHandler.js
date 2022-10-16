const { equals, makeId, userLogin } = require('../util/helper');
const { GameElement } = require('../util/gameElement');

module.exports = (io, socketRoom, userInSocket) => {
  const createRoom = function (name, avatarId) {
    const socket = this;
    if (userInSocket.includes(name)) {
      io.emit('error', 'user already login');
    } else {
      userLogin(name, avatarId, userInSocket, socket);
      var roomId = makeId(6);
      socket.join(roomId);
      socket.roomId = roomId;
      var gameElement = new GameElement(roomId, socket.userName);
      socketRoom.push(gameElement);
      io.emit('room:create-done', gameElement.roomId);
    }
  };

  const joinRoom = function (name, avatarId, roomId) {
    const socket = this;
    if (userInSocket.includes(name)) {
      io.emit('error', 'user already login');
    } else if (!socketRoom.find((x) => x.roomId == roomId)) {
      socket.emit('error', 'no such room');
    } else {
      userLogin(name, avatarId, userInSocket, socket);
      socket.join(roomId);
      socket.roomId = roomId;

      var i = socketRoom.findIndex((x) => x.roomId === roomId);
      socketRoom[i].addUser(socket.userName);

      if (socketRoom[i].currentUser.length == 2) {
        socketRoom[i].status = 'starting';
        socketRoom[i].randomRole();
      }

      io.emit('room:join-done', socketRoom[i]);
    }
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

  const deleteRoom = function (roomId) {
    socketRoom = socketRoom.filter((x) => x.roomId != roomId);
    io.emit('room:delete-done', socketRoom);
  };

  const getCurrentRoom = function () {
    io.emit('room:current-done', socketRoom);
  };

  return {
    createRoom,
    joinRoom,
    updateCoor,
    deleteRoom,
    getCurrentRoom,
  };
};
