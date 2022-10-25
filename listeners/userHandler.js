const { createUser, findUser } = require('../schema/user');

module.exports = (io, socketRooms, userInSocket) => {
  const userLogin = async function (name, avatarId) {
    try {
      const socket = this;
      if (userInSocket.find((x) => x.name == name))
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
        userInSocket.push({ name: name, socketId: socket.id });
        socket.emit('user:login-done', socket.userInfo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = function () {
    try {
      const socket = this;
      if (socket.userInfo) socket.emit('user:info-done', socket.userInfo);
      else socket.emit('user-error', 'User is not login');
    } catch (error) {
      console.error(error);
    }
  };

  const getAllUser = function () {
    try {
      const socket = this;
      socket.emit('user:get-all-done', userInSocket);
    } catch (error) {
      console.error(error);
    }
  };

  const updateScore = function (name) {
    try {
      const socket = this;
      if (socket.userInfo) {
        socket.userInfo.score += 1;
        updateUserScore(socket.userInfo);
        socket.emit('user:score-done', userInSocket[i]);
      } else socket.emit('user-error', 'User is not login');
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = function () {
    try {
      const socket = this;
      if (socket.userInfo)
        userInSocket = userInSocket.filter((x) => x != socket.userInfo.name);
      console.log(`Client disconnected [id=${socket.id}]`);
    } catch (error) {
      console.error(error);
    }
  };

  // const specialFunction = function () {
  //   for (let i = 0; i < 1000; i++) io.emit('');
  // };

  return {
    userLogin,
    getUserInfo,
    getAllUser,
    updateScore,
    disconnect,
  };
};
