const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

var roomInSocket = [];
var userInSocket = [];
var gameElements = [];

const { userLogin, getUserInfo, getAllUser, updateScore, disconnect } =
  require('./listeners/userHandler')(
    io,
    roomInSocket,
    userInSocket,
    gameElements
  );
const {
  createRoom,
  joinRoom,
  startSignal,
  startRoom,
  leaveRoom,
  deleteRoom,
  getCurrentRoom,
} = require('./listeners/roomHandler')(
  io,
  roomInSocket,
  userInSocket,
  gameElements
);
const { updateCoor } = require('./listeners/gameHandler')(
  io,
  roomInSocket,
  gameElements
);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on('user:login', userLogin);
  socket.on('user:info', getUserInfo);
  socket.on('user:get-all', getAllUser);
  socket.on('user:update-score', updateScore);
  socket.on('disconnect', disconnect);

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:starting', startSignal);
  socket.on('room:start', startRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('room:delete', deleteRoom);
  socket.on('room:current', getCurrentRoom);

  socket.on('game:update', updateCoor);
};

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
