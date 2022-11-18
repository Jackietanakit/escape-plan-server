const { makeId } = require('../util/helper');
const { GameElement } = require('../util/gameElement');
const { RoomDetail } = require('../util/roomDetail');
const {
  createUser,
  findUser,
  updateUserData,
  deleteCollection,
} = require('../schema/user');

module.exports = (io, roomInSocket, userInSocket, gameElements) => {
  const userLogin = async function (name, avatarId) {
    try {
      const socket = this;
      // Check if user is already login
      if (userInSocket.find((x) => x.name == name))
        socket.emit('user:error', `already login`);
      else {
        // Find existing user in database
        var userData = await findUser(name);
        if (userData == null) {
          userData = { name: name, score: 0, avatarId: avatarId };
          createUser(userData);
        }

        // Update user avatar
        if (userData.avatarId != avatarId) {
          userData.avatarId = avatarId;
          updateUserData(userData);
        }

        // Add user to socket
        const userInfo = {
          name: name,
          score: userData.score,
          avatarId: avatarId,
        };
        socket.userInfo = userInfo;
        userInSocket.push({ name: name, socketId: socket.id });
        console.log(socket.userInfo);
        socket.emit('user:login-done', socket.userInfo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = function () {
    try {
      const socket = this;
      if (socket.userInfo) socket.emit('user:info-done', socket.userInfo);
      else socket.emit('user:error', 'User is not login');
    } catch (error) {
      console.error(error);
    }
  };

  const getAllUser = function () {
    try {
      const socket = this;
      socket.emit('user:get-all-done', userInSocket);
    } catch (error) {
      console.error(error);
    }
  };

  const resetSpecificUser = function (name) {
    try {
      const socket = this;
      let userInfo = {
        name: name,
        score: 0,
      };
      updateUserData(userInfo);
      socket.on('user:reset-done', userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const resetAllUserScore = function () {
    try {
      const socket = this;
      deleteCollection();
      socket.emit('user:reset-all-done', 'success');
    } catch (error) {
      console.error(error);
    }
  };

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
      io.in(socket.roomId).emit('room:starting-done');
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
        // Check if game in room already exist
        if (!gameElements.find((x) => x.roomId === socket.roomId)) {
          // Create Boardgame
          let gameEl = new GameElement(hostName, memberName, socket.roomId);

          //generate role for player
          gameEl.giveRole(null);
          gameElements.push(gameEl);

          io.in(socket.roomId).emit('room:start-done', gameEl);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const playAgain = function (name) {
    try {
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
      }

      // leave room in socket
      socket.leave(roomId);
      delete socket.roomId;
      console.log(`${socket.userInfo.name} leave room ${roomId}`);

      io.in(roomId).emit('room:leave-done', roomInSocket[i]);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentRoom = function () {
    try {
      const socket = this;
      let room = roomInSocket.find((x) => x.id === socket.roomId);
      socket.emit('room:current-done', room);
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
      let i = gameElements.findIndex((x) => x.roomId == socket.roomId);
      if (i === -1) socket.emit('game:error', 'No Game');
      else {
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

  const resetGame = function (roomId) {
    try {
      const socket = this;
      let i = gameElements.findIndex((x) => x.roomId == roomId);
      gameElements[i].resetGame();
      io.in(roomId).emit('game:reset-done', gameElements[i]);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = function () {
    try {
      const socket = this;
      let i = userInSocket.findIndex((x) => x.socketId === socket.id);
      if (i >= 0) {
        let name = userInSocket[i].name;
        // Delete user in socket
        userInSocket.splice(i, 1);
        // Delete user in game
        let gameIndex = gameElements.findIndex(
          (el) => el.users.filter((user) => user.name === name)[0]
        );
        if (gameIndex >= 0) {
          gameElements[gameIndex].removeUser(name);
        }

        // Delete user in room
        let roomIndex = roomInSocket.findIndex(
          (el) => el.users.filter((user) => user.name === name)[0]
        );
        if (roomIndex >= 0) {
          let roomId = roomInSocket[roomIndex].id;
          roomInSocket[roomIndex].removeUser(name);
          console.log('user disconnect: ', name);
          io.in(roomId).emit('user:disconnect', roomInSocket[roomIndex]);
          if (roomInSocket[roomIndex].users.length === 0) {
            roomInSocket.splice(roomIndex, 1);
            gameElements.splice(gameIndex, 1);
          }
        }
      }
      console.log(`Client disconnected [id=${socket.id}]`);
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
    getCurrentRoom,
    getAllRoom,
    playAgain,
    updateCoor,
    getAllGameElement,
    gameEnd,
    chat,
    userLogin,
    getUserInfo,
    getAllUser,
    resetSpecificUser,
    resetAllUserScore,
    resetGame,
    disconnect,
  };
};
