const io = require("socket.io")(3000, {
  cors: {
    orgin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send-player-name", (message) => {
    socket.broadcast.emit("receive-player-name", message);
  });
});
