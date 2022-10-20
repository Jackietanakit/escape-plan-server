const { makeId, userLogin } = require('../util/helper');
const { GameElement } = require('../util/gameElement');

module.exports = (io, socketRoom, userInSocket) => {
  const createRoom = function (name, avatarId) {
    const socket = this;
    if (userInSocket.includes(name)) {
      io.emit('user-error', 'user already login');
    } else {
      userLogin(name, avatarId, userInSocket, socket);
      var roomId = makeId(6);
      socket.join(roomId);
      socket.roomId = roomId;
      var gameElement = new GameElement(roomId, socket.userName);
      socketRoom.push(gameElement);
      io.emit('room:create-done', gameElement.roomId, socket.userInfo);
    }
  };

  const joinRoom = function (name, avatarId, roomId) {
    const socket = this;
    if (userInSocket.includes(name)) {
      io.emit('user-error', 'user already login');
    } else if (!socketRoom.find((x) => x.roomId == roomId)) {
      socket.emit('room-error', 'no such room');
    } else {
      userLogin(name, avatarId, userInSocket, socket);
      socket.join(roomId);
      socket.roomId = roomId;

      var i = socketRoom.findIndex((x) => x.roomId === roomId);
      socketRoom[i].addUser(socket.userName);

      if (socketRoom[i].currentUser.length == 2) {
        socketRoom[i].status = 'starting';
        socketRoom[i].giveRole(null);
      }

      io.emit('room:join-done', socketRoom[i], socket.userInfo);
    }
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
    deleteRoom,
    getCurrentRoom,
  };
};
