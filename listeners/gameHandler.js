const { updateUserData } = require('../schema/user');

module.exports = (io, roomInSocket, gameElements) => {
  const updateCoor = function (coor, isWarderTurn) {
    try {
      const socket = this;

      // Check game
      let i = gameElements.findIndex((x) => x.roomId === socket.roomId);
      if (i === -1) socket.emit('game:error', 'No Game');
      // Coor is null
      else if (!coor)
        io.in(socket.roomId).emit('game:update-done', {
          mapDetail: gameElements[i].mapDetail,
          isWarderTurn: !isWarderTurn,
        });
      // Update map and check win
      else {
        console.log(
          `User:${socket.userInfo.name}, Coor: ${coor}, isWarderTurn: ${isWarderTurn}`
        );
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

  const gameEnd = function (isWarderWin) {
    try {
      const socket = this;
      let i = gameElements.findIndex((x) => x.roomId === socket.roomId);
      if (i === -1) socket.emit('game:error', 'No Game');
      else {
        gameElements[i].status = 'ended';

        socket.userInfo.score = socket.userInfo.score + 1;

        updateUserData(socket.userInfo);

        io.in(socket.roomId).emit('game:end-done', socket.userInfo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    updateCoor,
    getAllGameElement,
  };
};
