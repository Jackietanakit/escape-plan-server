const { createUser, findUser, updateUserData } = require('../schema/user');

module.exports = (io, roomInSocket, userInSocket, gameElements) => {
  const userLogin = async function (name, avatarId) {
    try {
      const socket = this;
      if (userInSocket.find((x) => x.name == name))
        socket.emit('user:error', `already login`);
      else {
        // Find existing user in database
        var userData = await findUser(name);
        if (userData == null) {
          userData = { name: name, score: 0, avatarId: avatarId };
          createUser(userData);
        }

        // Update user avatar
        if (userData.avatarId != avatarId) {
          userData.avatarId = avatarId;
          updateUserData(userData);
        }

        // Add user to socket
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
      else socket.emit('user:error', 'User is not login');
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

  const updateScore = function () {
    try {
      const socket = this;
      if (socket.userInfo) {
        socket.userInfo.score += 1;
        updateUserScore(socket.userInfo);
        io.in(socket.roomId).emit('user:score-done', socket.userInfo);
      } else socket.emit('user:error', 'User is not login');
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = function () {
    try {
      const socket = this;
      let i = userInSocket.findIndex((x) => x.socketId === socket.id);
      if (i >= 0) {
        let name = userInSocket[i].name;
        let gameIndex = gameElements.findIndex(
          (el) => el.users.filter((user) => user.name === name)[0]
        );
        let roomIndex = roomInSocket.findIndex(
          (el) => el.users.filter((user) => user.name === name)[0]
        );
        userInSocket.splice(i, 1);
        if (gameIndex >= 0) {
          gameElements[gameIndex].removeUser(name);
        }
        if (roomIndex >= 0) {
          roomInSocket[roomIndex].removeUser(name);
          if (roomInSocket[roomIndex].users.length === 0)
            roomInSocket.splice(roomIndex, 1);
        }
      }
      console.log(`Client disconnected [id=${socket.id}]`);
    } catch (error) {
      console.error(error);
    }
  };

  const test = function () {
    try {
      console.log('test');
      socket.emit('test-done', 'test');
    } catch (error) {
      console.error(error);
    }
  };

  return {
    userLogin,
    getUserInfo,
    getAllUser,
    updateScore,
    disconnect,
    test,
  };
};
