const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, userName) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.currentUser = [userName];
    this.role = {
      prisoner: null,
      warder: null,
    };
  }

  addUser(userName) {
    this.currentUser.push(userName);
  }

  removeUser(userName) {
    this.currentUser = this.currentUser.filter((x) => x != userName);
  }

  randomRole() {
    let index = Math.floor(Math.random() * 2);
    this.role.prisoner = this.currentUser(index);
    this.role.warder = index == 0 ? this.currentUser[1] : this.currentUser[0];
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
