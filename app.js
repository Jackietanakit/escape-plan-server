const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: {
    origin: [
      "http://192.168.1.151:8080",
      "http://localhost:8080",
      "http://192.168.1.109:3000",
    ],
  },
});

const { reqInfo } = require("./listeners/userHandler")(io);
// const { createMap, updateCoor } = require("./listeners/gameHandler")(io, map);

const onConnection = (socket) => {
  let map = [1, 1, 1, 1, 1];
  console.log(`Client connected [id=${socket.id}]`);
  socket.on("player:create", reqInfo);

  // socket.on("map:create", createMap);
  // socket.on("coor:update", updateCoor);
};
io.on("connection", onConnection);
