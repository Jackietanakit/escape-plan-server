const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, userName) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.currentUser = [userName];
  }

  addUser(userName) {
    this.currentUser.push(userName);
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
