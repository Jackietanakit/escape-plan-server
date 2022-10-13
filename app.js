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

let map = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const { reqInfo, disconnect } = require("./listeners/userHandler")(io);
// const { createMap, updateCoor } = require("./listeners/gameHandler")(io, map);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on("player:create", reqInfo);

  // socket.on("map:create", createMap);
  // socket.on("coor:update", updateCoor);
  socket.on("disconnect", disconnect);
};
io.on("connection", onConnection);
