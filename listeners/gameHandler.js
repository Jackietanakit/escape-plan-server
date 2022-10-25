module.exports = (io, roomInSocket, gameElements) => {
  const updateCoor = function (coor, isWarderTurn) {
    try {
      console.log('updateCoor');
      const socket = this;
      if (!coor) socket.emit('game:error', 'No Param');
      else {
        let i = gameElements.findIndex((x) => x.roomId === socket.roomId);

        let mapDetail = gameElements[i].mapDetail;
        if (isWarderTurn) {
          if (coor === mapDetail.pCoor)
            io.emit('game:update-done', 'Warder win!');
          else {
            mapDetail.map[coor[0]][coor[1]] = 'w';
            mapDetail.map[mapDetail.wCoor[0]][mapDetail.wCoor[1]] = 0;
            mapDetail.wCoor = coor;
          }
        } else {
          if (coor === mapDetail.hCoor)
            io.emit('game:update-done', 'Prisoner win!');
          else if (coor === mapDetail.wCoor)
            io.emit('game:update-done', 'Warder win!');
          else {
            mapDetail.map[coor[0]][coor[1]] = 'p';
            mapDetail.map[mapDetail.pCoor[0]][mapDetail.pCoor[1]] = 0;
            mapDetail.wCoor = coor;
          }
          io;
        }
        gameElements[i].mapDetail = mapDetail;
        if (isWarderTurn) isWarderTurn = false;
        else isWarderTurn = true;
        io.emit('game:update-done', {
          ...mapDetail,
          isWarderTurn,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    updateCoor,
  };
};
