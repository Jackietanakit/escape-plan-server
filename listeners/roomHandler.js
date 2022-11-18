const { makeId } = require('../util/helper');
const { GameElement } = require('../util/gameElement');
const { RoomDetail } = require('../util/roomDetail');
const { updateUserData } = require('../schema/user');

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
      if (!socket.roomId) {
        socket.emit('room:error', 'not in room');
      } else {
        let i = gameElements.findIndex((x) => x.roomId === socket.roomId);
        if (i === -1) {
          // Create Boardgame
          let gameEl = new GameElement(hostName, memberName, socket.roomId);

          //generate role for player
          gameEl.giveRole(null);
          gameElements.push(gameEl);
          console.log(gameElements);

          io.in(socket.roomId).emit('room:start-done', gameEl);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const playAgain = function (name) {
    try {
      console.log(name);
      const socket = this;
      let i = gameElements.findIndex((x) => x.roomId == socket.roomId);
      gameElements[i].resetGame(name);
      io.in(socket.roomId).emit('room:play-again-done', gameElements[i]);
    } catch (error) {
      console.error(error);
    }
  };

  const leaveRoom = function () {
    try {
      const socket = this;
      let roomId = socket.roomId;

      // Leave roomDetail
      let i = roomInSocket.findIndex((x) => x.id === roomId);
      roomInSocket[i].removeUser(socket.userInfo.name);

      if (roomInSocket[i].users.length === 0) {
        roomInSocket.splice(i, 1);
        gameElements = gameElements.filter((x) => x.roomId != roomId);
        console.log(gameElements);
      }

      // leave room in socket
      socket.leave(roomId);
      console.log(`User [id=${socket.id}] leave room [id=${roomId}]`);

      io.in(roomId).emit('room:leave-done', roomInSocket[i]);
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
      const socket = this;
      let room = roomInSocket.find((x) => x.id === socket.roomId);
      socket.emit('room:current-done', room[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllRoom = function () {
    try {
      const socket = this;
      socket.emit('room:all-done', roomInSocket);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCoor = function (coor, isWarderTurn) {
    try {
      const socket = this;
      console.log(
        `User:${socket.userInfo.name}, Coor: ${coor}, isWarderTurn: ${isWarderTurn}`
      );
      // Check game
      let i = gameElements.findIndex((x) => x.roomId === socket.roomId);
      if (i === -1) socket.emit('game:error', 'No Game');
      // Coor is null
      else if (!coor) {
        console.log('null check');
        io.in(socket.roomId).emit('game:update-done', {
          mapDetail: gameElements[i].mapDetail,
          isWarderTurn: !isWarderTurn,
        });
      }

      // Update map and check win
      else {
        let mapDetail = gameElements[i].mapDetail;
        if (isWarderTurn) {
          mapDetail.map[mapDetail.wCoor[0]][mapDetail.wCoor[1]] = 0;
          mapDetail.map[coor[0]][coor[1]] = 'w';
          mapDetail.wCoor = coor;
        } else {
          mapDetail.map[mapDetail.pCoor[0]][mapDetail.pCoor[1]] = 0;
          mapDetail.map[coor[0]][coor[1]] = 'p';
          mapDetail.pCoor = coor;
        }
        gameElements[i].mapDetail = mapDetail;
        console.log(mapDetail.map);
        io.in(socket.roomId).emit('game:update-done', {
          mapDetail,
          isWarderTurn: !isWarderTurn,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllGameElement = function () {
    try {
      const socket = this;
      socket.emit('game:all-done', gameElements);
    } catch (error) {
      console.log(error);
    }
  };

  const gameEnd = function () {
    try {
      const socket = this;
      console.log(socket.roomId);
      console.log(gameElements);
      let i = gameElements.findIndex((x) => x.roomId == socket.roomId);
      console.log(i);
      if (i === -1) socket.emit('game:error', gameElements);
      else {
        console.log('Game End');
        gameElements[i].status = 'ended';

        // Update user data
        socket.userInfo.score = socket.userInfo.score + 1;
        updateUserData(socket.userInfo);

        // User info to all user in room
        io.in(socket.roomId).emit(
          'game:end-done',
          gameElements[i],
          socket.userInfo
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const chat = function (message) {
    try {
      const socket = this;
      io.in(socket.roomId).emit('game:chat-done', message, socket.userInfo);
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
    getAllRoom,
    playAgain,
    updateCoor,
    getAllGameElement,
    gameEnd,
    chat,
  };
};
