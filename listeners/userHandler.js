const { updateUserScore } = require('../schema/user');

module.exports = (io, socketRooms, userInSocket) => {
  const getUserInfo = function (name) {
    const socket = this;
    let userInfo = userInSocket.find((x) => x.name == name);
    io.emit('user:info-done', userInfo);
  };

  const updateScore = function () {
    const socket = this;
    let i = userInSocket.findIndex((x) => x.name == socket.name);
    userInSocket[i].score += 1;
    updateUserScore(userInSocket[i]);
    io.emit('user:score-done', userInSocket[i]);
  };

  const disconnect = function () {
    const socket = this;
    userInSocket = userInSocket.filter((x) => x.name != socket.name);
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  // const specialFunction = function () {
  //   for (let i = 0; i < 1000; i++) io.emit('');
  // };

  return {
    getUserInfo,
    updateScore,
    disconnect,
  };
};
