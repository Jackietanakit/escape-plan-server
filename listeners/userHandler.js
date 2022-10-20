const { updateUserScore } = require('../schema/user');

module.exports = (io) => {
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

  const disconnect = function () {
    const socket = this;
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  return {
    getUserInfo,
    updateScore,
    disconnect,
  };
};
