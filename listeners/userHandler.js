module.exports = (io) => {
  const socket = this;
  const reqInfo = function (name, avatar) {
    const role = "prisoner";
    socket.broadcast.emit("player:create-done", name, avatar, role);
  };
  const disconnect = function () {
    console.log(`Client disconnected [id${socket.id}]`);
  };

  return {
    reqInfo,
    disconnect,
  };
};
