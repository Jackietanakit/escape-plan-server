const { makeId } = require('../util/helper');
const { GameElement } = require('../util/gameElement');
const { RoomDetail } = require('../util/roomDetail');

module.exports = (io, roomInSocket, userInSocket, gameElements) => {
  const createRoom = function () {
    try {
      const socket = this;
      if (!socket.userInfo) {
        socket.emit('user-error', 'User is not login');
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
        console.log(socket.rooms);

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
        socket.emit('user-error', 'User is not login');
      } else if (!roomInSocket.find((x) => x.id == roomId)) {
        socket.emit('room-error', `${roomId} doesn't exist`);
      } else {
        //join existing roomId
        socket.join(roomId);
        socket.roomId = roomId;

        //Add user to that specific room
        let i = roomInSocket.findIndex((x) => x.id === roomId);
        if (roomInSocket[i].users.length < 2)
          roomInSocket[i].addMember(socket.userInfo);

        io.in(roomId).emit('room:join-done', roomInSocket[i]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startRoom = function (hostName, memberName) {
    try {
      const socket = this;
      let gameEl = new GameElement(hostName);
      io.emit('room:start-done', gameEl);
      gameEl.addUser(memberName);

      io.emit('room:start-done', gameEl);

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
      var i = roomInSocket.findIndex((x) => x.roomId === roomId);
      roomInSocket[i].removeUser(socket.userInfo.name);
      socket.leave(socket.roomId);
      if (socket.roomId) delete socket.roomId;
      console.log(`User [id=${socket.id} leave room [id=${roomId}]]`);
      io.emit('user:leave-done', socket.userInfo);
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
      io.emit('room:current-done', socketRooms);
    } catch (error) {
      console.error(error);
    }
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
