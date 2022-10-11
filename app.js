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

const { getPlayerName } = require("./listeners/userHandler")(io);
const { generateMap, sendCoor } = require("./listeners/gameHandler")(
  io,
  map,
  pCoor,
  wCoor
);

const onConnection = (socket) => {
  socket.on("send:player-name", getPlayerName);

  socket.on("send:map", generateMap);
  socket.on("send:coordinate", sendCoor);
};
io.on("connection", onConnection);

httpServer.listen(3000, () => {
  console.log("listening on Port: 3000");
});

// socket.on("send-test", (testInfo) => {
//   console.log(testInfo);
//   socket.emit("receive-test", testInfo);
// });
