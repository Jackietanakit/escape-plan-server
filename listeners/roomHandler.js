const { makeId } = require('../util/helper');
const { GameElement } = require('../util/gameElement');
const { RoomDetail } = require('../util/roomDetail');

module.exports = (io, roomInSocket, userInSocket, gameElements) => {
  const createRoom = function () {
    try {
      const socket = this;
      if (!socket.userInfo) {
        socket.emit('user:error', 'User is not login');
      } else {
        // Generate RoomId
        let roomId = makeId(6);
        let roomIds = roomInSocket.map((gameEl) => gameEl.roomId);
        while (roomIds.includes(roomId)) roomId = makeId(6);

        // Create room
        roomId = '111111';
        let roomDetail = new RoomDetail(roomId);
        roomDetail.addHost(socket.userInfo);
        roomInSocket.push(roomDetail);

        //join to created room
        socket.join(roomId);
        socket.roomId = roomId;

        io.in(roomId).emit('room:create-done', roomDetail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = function (roomId) {
    try {
      const socket = this;
      if (!socket.userInfo) {
        socket.emit('user:error', 'User is not login');
      } else if (!roomInSocket.find((x) => x.id == roomId)) {
        socket.emit('room:error', `${roomId} doesn't exist`);
      } else {
        //join existing roomId
        socket.join(roomId);
        socket.roomId = roomId;

        //Add user to that specific room
        let i = roomInSocket.findIndex((x) => x.id === roomId);
        if (roomInSocket[i].users.length < 2)
          roomInSocket[i].addMember(socket.userInfo);
        else socket.emit('room:error', `Room id: ${roomId} is already full`);

        io.in(roomId).emit('room:join-done', roomInSocket[i]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startSignal = function () {
    try {
      const socket = this;
      io.in(socket.roomId).emit('room:starting-done', 'kuay');
    } catch (error) {
      console.log(error);
    }
  };

  const startRoom = function (hostName, memberName) {
    try {
      const socket = this;
      // Create Boardgame
      let gameEl = new GameElement(hostName, memberName, socket.roomId);

      //generate role for player
      gameEl.giveRole(null);
      gameElements.push(gameEl);

      io.emit('room:start-done', gameEl);
    } catch (error) {
      console.error(error);
    }
  };

  const leaveRoom = function () {
    try {
      const socket = this;

      // Leave roomDetail
      let i = roomInSocket.findIndex((x) => x.id === socket.roomId);
      roomInSocket[i].removeUser(socket.userInfo.name);

      // leave room in socket
      socket.leave(socket.roomId);
      console.log(`User [id=${socket.id} leave room [id=${socket.roomId}]]`);

      io.emit('room:leave-done', roomInSocket[i]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRoom = function (roomId) {
    try {
      roomInSocket = roomInSocket.filter((x) => x.roomId != roomId);
      io.emit('room:delete-done', roomInSocket);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentRoom = function () {
    try {
      io.emit('room:current-done', roomInSocket);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createRoom,
    joinRoom,
    startSignal,
    startRoom,
    leaveRoom,
    deleteRoom,
    getCurrentRoom,
  };
};
