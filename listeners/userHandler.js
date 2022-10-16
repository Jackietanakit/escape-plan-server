const { createUser, findUser } = require('../schema/user');

module.exports = (io, socketRoom, userInSocket) => {
  const leaveRoom = function () {
    const socket = this;
    var i = socketRoom.findIndex((x) => x.roomId === roomId);
    socketRoom[i].removeUser(socket.userInfo.name);
    socket.leave(socket.roomId);
    socket.roomId = null;
    console.log(`User [id=${socket.id} leave room [id=${roomId}]]`);
    io.emit('user:leave-done', socket.userInfo);
  };

  const disconnect = function () {
    const socket = this;
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  return {
    leaveRoom,
    disconnect,
  };
};
