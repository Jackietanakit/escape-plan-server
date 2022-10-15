const { createUser, findUser } = require('../schema/user');

module.exports = (io) => {
  const getUserInfo = async function (name, avatar) {
    const socket = this;
    const role = 'prisoner';
    var userData = await findUser(name);
    if (userData == null) {
      userData = { name: name, score: 0 };
      createUser(userData);
    }
    socket.userName = name;
    io.emit('player:login-done', userData, avatar, role);
  };

  const disconnect = function () {
    const socket = this;
    console.log(`Client disconnected [id=${socket.id}]`);
  };

  return {
    getUserInfo,
    disconnect,
  };
};
