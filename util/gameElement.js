const { generateMap } = require('./helper');

class GameElement {
  constructor(roomId, name) {
    this.status = 'waiting';
    this.roomId = roomId;
    this.mapDetail = generateMap();
    this.users = [{ name: name, role: 'host', isWarder: null }];
  }

  createMap() {
    this.mapDetail = generateMap();
  }

  addUser(name) {
    this.users.push({ name: name, role: 'member', isWarder: null });
  }

  removeUser(name) {
    this.users = this.users.filter((x) => x.name != name);
  }

  giveRole(name) {
    let index = -1;
    if (!name) index = Math.floor(Math.random() * 2);
    else index = this.user.findIndex((x) => x.name == name);
    this.users[index].isWarder = false;
    index = index == 0 ? 1 : 0;
    this.users[index].isWarder = true;
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
