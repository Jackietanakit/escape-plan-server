const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, name) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.currentUser = [name];
    this.role = {
      prisoner: null,
      warder: null,
    };
  }

  addUser(name) {
    this.currentUser.push(name);
  }

  removeUser(name) {
    this.currentUser = this.currentUser.filter((x) => x != name);
  }

  giveRole(name) {
    let index = -1;
    if (!name) index = Math.floor(Math.random() * 2);
    else index = this.currentUser.findIndex((x) => x == name);
    this.role.warder = this.currentUser(index);
    this.role.prisoner = index == 0 ? this.currentUser[1] : this.currentUser[0];
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
