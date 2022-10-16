const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['*'],
  },
});

const { getUserInfo, disconnect } = require('./listeners/userHandler')(io);
const { createRoom, joinRoom, deleteRoom, updateCoor, getCurrentRoom } =
  require('./listeners/gameHandler')(io);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on('player:login', getUserInfo);
  socket.on('disconnect', disconnect);

  socket.on('room:create', createRoom);
  socket.on('room:delete', deleteRoom);
  socket.on('room:join', joinRoom);
  socket.on('room:current-room', getCurrentRoom);

  socket.on('coor:update', updateCoor);
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
