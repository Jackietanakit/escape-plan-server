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

const {
  createRoom,
  joinRoom,
  startSignal,
  startRoom,
  leaveRoom,
  deleteAllRoom,
  getCurrentRoom,
  getAllRoom,
  playAgain,
  resetGame,
  updateCoor,
  getAllGameElement,
  gameEnd,
  chat,
  userLogin,
  getUserInfo,
  getAllUser,
  resetSpecificUser,
  resetAllUserScore,
  disconnect,
} = require('./listeners/handler')(
  io,
  roomInSocket,
  userInSocket,
  gameElements
);
const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);

  socket.on('user:login', userLogin);
  socket.on('user:info', getUserInfo);
  socket.on('user:get-all', getAllUser);
  socket.on('user:reset', resetSpecificUser);
  socket.on('user:reset-all', resetAllUserScore);
  socket.on('disconnect', disconnect);

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:starting', startSignal);
  socket.on('room:start', startRoom);
  socket.on('room:play-again', playAgain);
  socket.on('room:leave', leaveRoom);
  socket.on('room:current', getCurrentRoom);
  socket.on('room:all', getAllRoom);
  socket.on('room:delete-all', deleteAllRoom);

  socket.on('game:update', updateCoor);
  socket.on('game:all', getAllGameElement);
  socket.on('game:end', gameEnd);
  socket.on('game:chat', chat);
  socket.on('game:reset', resetGame);
};

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
