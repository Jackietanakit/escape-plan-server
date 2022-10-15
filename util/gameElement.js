const { generateMap } = require('./helper');

export class GameElement {
  constructor(roomId, userData) {
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.userInfo = [userData];
  }

  addUser(userData) {
    this.userInfo.push(userData);
  }
}
