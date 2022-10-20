const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, name) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.user = { name: name, role: 'host' };
    this.role = { prisoner: null, warder: null };
  }

  createMap() {
    this.mapDetail = generateMap();
  }

  addUser(name) {
    this.user = { name: name, role: 'member' };
  }

  removeUser(name) {
    this.user = this.user.filter((x) => x.name != name);
  }

  giveRole(name) {
    let index = -1;
    if (name) index = Math.floor(Math.random() * 2);
    else index = this.user.findIndex((x) => x.name == name);
    this.role.warder = this.user[index].name;
    this.role.prisoner = index == 0 ? this.user[1].name : this.user[0].name;
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
