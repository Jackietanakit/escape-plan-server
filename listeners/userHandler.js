module.exports = (io) => {
  const getPlayerName = function (name) {
    const socket = this;
    socket.broadcast.emit("receive-player-name", name);
  };

  return {
    getPlayerName,
  };
};
