const { makeId, userLogin } = require('../util/helper');
const { GameElement } = require('../util/gameElement');

module.exports = (io, socketRooms, userInSocket) => {
  const createRoom = async function (name, avatarId) {
    const socket = this;
    if (userInSocket.some((userInfo) => userInfo.name == name)) {
      io.emit('user-error', 'user already login');
    } else {
      // login,add user to userInSocket
      const userInfo = await userLogin(name, avatarId, userInSocket, socket);

      //Create Room Id that not existed
      let roomId = makeId(6);
      let roomIds = socketRooms.map((gameEl) => gameEl.roomId);
      while (roomIds.includes(roomId)) roomId = makeId(6);

      // //For develop process
      // roomId = '111111';

      //join to created room
      socket.join(roomId);
      socket.roomId = roomId;

      //Create gameElement and add to socketRooms
      let gameElement = new GameElement(roomId, userInfo.name);
      socketRooms.push(gameElement);
      io.emit('room:create-done', gameElement.roomId, userInfo);
    }
  };

  const joinRoom = async function (name, avatarId, roomId) {
    const socket = this;
    if (userInSocket.some((userInfo) => userInfo.name == name)) {
      io.emit('user-error', 'user already login');
    } else if (!socketRooms.find((x) => x.roomId == roomId)) {
      socket.emit('room-error', 'no such room');
    } else {
      // login,add user to userInSocket
      const userInfo = await userLogin(name, avatarId, userInSocket, socket);

      //join existing roomId
      socket.join(roomId);
      socket.roomId = roomId;

      //Add user to that specific room
      let i = socketRooms.findIndex((x) => x.roomId === roomId);
      if (socketRooms[i].users.length < 2) socketRooms[i].addUser(name);

      //Get another member info
      let hostInfo = userInSocket.find(
        (x) => x.name == socketRooms[i].users[0].name
      );
      io.emit('room:join-done', hostInfo, userInfo);
    }
  };

  const startRoom = function () {
    const socket = this;
    // Change state of status
    let i = socketRooms.findIndex((x) => x.roomId === socket.roomId);
    socketRooms[i].status = 'starting';

    //generate role for player
    socketRooms[i].giveRole(null);

    io.emit('room:start-done', socketRooms[i]);
  };

  const leaveRoom = function () {
    const socket = this;
    var i = socketRooms.findIndex((x) => x.roomId === roomId);
    socketRooms[i].removeUser(socket.userInfo.name);
    socket.leave(socket.roomId);
    if (socket.roomId) delete socket.roomId;
    console.log(`User [id=${socket.id} leave room [id=${roomId}]]`);
    io.emit('user:leave-done', socket.userInfo);
  };

  const deleteRoom = function (roomId) {
    socketRooms = socketRooms.filter((x) => x.roomId != roomId);
    io.emit('room:delete-done', socketRooms);
  };

  const getCurrentRoom = function () {
    io.emit('room:current-done', socketRooms);
  };

  return {
    createRoom,
    joinRoom,
    startRoom,
    leaveRoom,
    deleteRoom,
    getCurrentRoom,
  };
};
