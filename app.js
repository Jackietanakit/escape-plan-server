const httpServer = require("http").createServer();
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    origin: ["http://192.168.1.151:8080", "http://localhost:8080"],
  },
});

// Init variable
let map = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
let pCoor = [];
let wCoor = [];

const { reqInfo } = require("./listeners/userHandler")(io);
const { createMap, updateCoor } = require("./listeners/gameHandler")(
  io,
  map,
  pCoor,
  wCoor
);

const onConnection = (socket) => {
  socket.on("player:create", reqInfo);

  socket.on("map:create", createMap);
  socket.on("coor:update", updateCoor);
};
io.on("connection", onConnection);

httpServer.listen(3000, () => {
  console.log("listening on Port: 3000");
});

// socket.on("send-test", (testInfo) => {
//   console.log(testInfo);
//   socket.emit("receive-test", testInfo);
// });
