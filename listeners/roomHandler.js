const { makeId, userLogin } = require('../util/helper');
const { GameElement } = require('../util/gameElement');

module.exports = (io, socketRoom, userInSocket) => {
  const createRoom = function (name, avatarId) {
    const socket = this;
    if (userInSocket.includes(name)) {
      io.emit('user-error', 'user already login');
    } else {
      userLogin(name, avatarId, userInSocket, socket);
      let roomId = makeId(6);
      socket.join(roomId);
      socket.roomId = roomId;
      let gameElement = new GameElement(roomId, socket.userName);
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

      let i = socketRoom.findIndex((x) => x.roomId === roomId);
      if (socketRoom[i].user.length < 2) socketRoom[i].addUser(name);
      io.emit('room:join-done', socketRoom[i].user[1].name, socket.userInfo);
    }
  };

  const startRoom = function () {
    let i = socketRoom.findIndex((x) => x.roomId === socket.roomId);
    socketRoom[i].status = 'starting';
    io.emit('room:start-done', socketRoom[i]);
  };

  const leaveRoom = function () {
    const socket = this;
    var i = socketRoom.findIndex((x) => x.roomId === roomId);
    socketRoom[i].removeUser(socket.userInfo.name);
    socket.leave(socket.roomId);
    if (socket.roomId) delete socket.roomId;
    console.log(`User [id=${socket.id} leave room [id=${roomId}]]`);
    io.emit('user:leave-done', socket.userInfo);
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
    startRoom,
    leaveRoom,
    deleteRoom,
    getCurrentRoom,
  };
};
