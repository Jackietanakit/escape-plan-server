const { createUser, findUser, updateUserScore } = require('../schema/user');

module.exports = (io, socketRoom, userInSocket) => {
  const getUserInfo = function () {
    const socket = this;
    io.emit('user:info-done', socket.userInfo);
  };

  const updateScore = function () {
    const socket = this;
    socket.userInfo.score += 1;
    updateUserScore(socket.userInfo);
    io.emit('user:score-done', socket.userInfo);
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

  const disconnect = function () {
    const socket = this;
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  return {
    getUserInfo,
    updateScore,
    leaveRoom,
    disconnect,
  };
};
