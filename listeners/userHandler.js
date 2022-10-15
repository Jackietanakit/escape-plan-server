module.exports = (io) => {
  const getUserInfo = function (name, avatar) {
    const socket = this;
    const role = 'prisoner';
    io.emit('player:create-done', `Fuck you ${name}`, avatar, role);
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
