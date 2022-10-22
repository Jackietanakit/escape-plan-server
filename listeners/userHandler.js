const { createUser, findUser, updateUserScore } = require('../schema/user');

module.exports = (io, socketRooms, userInSocket) => {
  const userLogin = async function (name, avatarId) {
    const socket = this;
    if (userInSocket.includes(name))
      socket.emit('user-error', `Username: ${name} is already login`);
    else {
      var userData = await findUser(name);
      if (userData == null) {
        userData = { name: name, score: 0 };
        createUser(userData);
      }
      const userInfo = {
        name: name,
        score: userData.score,
        avatarId: avatarId,
      };
      socket.userInfo = userInfo;
      userInSocket.push(socket.userInfo.name);
      socket.emit('user:login-done', socket.userInfo);
    }
  };

  const getUserInfo = function () {
    const socket = this;
    if (socket.userInfo) socket.emit('user:info-done', socket.userInfo);
    else socket.emit('user-error', 'User is not login');
  };

  const updateScore = function (name) {
    const socket = this;
    if (socket.userInfo) {
      socket.userInfo.score += 1;
      updateUserScore(socket.userInfo);
      socket.emit('user:score-done', userInSocket[i]);
    } else socket.emit('user-error', 'User is not login');
  };

  const disconnect = function () {
    const socket = this;
    // userInSocket = userInSocket.filter((x) => x.name != socket.userInfo.name);
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  // const specialFunction = function () {
  //   for (let i = 0; i < 1000; i++) io.emit('');
  // };

  return {
    userLogin,
    getUserInfo,
    updateScore,
    disconnect,
  };
};
