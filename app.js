const { Server } = require('socket.io');

const io = new Server(8000, {
  cors: {
    origin: [
      'http://192.168.1.151:8080',
      'http://192.168.1.109:3000',
      'https://172.20.10.7:3000',
      'http://localhost:3000',
      'http://localhost:8080',
    ],
  },
});

const { getUserInfo, disconnect } = require('./listeners/userHandler')(io);
const { createMap, updateCoor } = require('./listeners/gameHandler')(io);

const onConnection = (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  socket.on('player:login', getUserInfo);
  socket.on('disconnect', disconnect);

  socket.on('map:create', createMap);
  socket.on('coor:update', updateCoor);
};
io.on('connection', onConnection);
