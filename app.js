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

var socketRoom = [];
var userInSocket = [];

const { getUserInfo, updateScore, disconnect } =
  require('./listeners/userHandler')(io, socketRoom, userInSocket);
const {
  createRoom,
  joinRoom,
  startRoom,
  leaveRoom,
  deleteRoom,
  getCurrentRoom,
} = require('./listeners/roomHandler')(io, socketRoom, userInSocket);
const { forwardCoor, playAgain } = require('./listeners/gameHandler')(io);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on('game:forward-coor', forwardCoor);
  socket.on('game:play-again', playAgain);

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:start', startRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('room:delete', deleteRoom);
  socket.on('room:current', getCurrentRoom);

  socket.on('user:info', getUserInfo);
  socket.on('user:update-score', updateScore);
  socket.on('disconnect', disconnect);
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
