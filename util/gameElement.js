const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, name) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.user = { name: name, role: 'host', isWarder: null };
  }

  createMap() {
    this.mapDetail = generateMap();
  }

  addUser(name) {
    this.user = { name: name, role: 'member', isWarder: null };
  }

  removeUser(name) {
    this.user = this.user.filter((x) => x.name != name);
  }

  giveRole(name) {
    let index = -1;
    if (!name) index = Math.floor(Math.random() * 2);
    else index = this.user.findIndex((x) => x.name == name);
    this.user[index].isWarder = false;
    index = index == 0 ? 1 : 0;
    this.user[index].isWarder = true;
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
