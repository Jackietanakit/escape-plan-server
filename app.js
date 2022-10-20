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

const { leaveRoom, disconnect } = require('./listeners/userHandler')(
  io,
  socketRoom,
  userInSocket
);
const { createRoom, joinRoom, deleteRoom, getCurrentRoom } =
  require('./listeners/roomHandler')(io, socketRoom, userInSocket);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on('user:leave', leaveRoom);
  socket.on('disconnect', disconnect);

  socket.on('room:create', createRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:delete', deleteRoom);
  socket.on('room:current', getCurrentRoom);
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
