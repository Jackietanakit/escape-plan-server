module.exports = (io) => {
  const reqInfo = function (name, avatar) {
    const socket = this;

    socket.broadcast.emit("player:create-done", name, avatar, role);
  };
  const sendPlayerRole = function () {};

  return {
    reqInfo,
  };
};
