const { generateMap } = require('./helper');

class GameElement {
  constructor(name) {
    this.status = 'playing';
    this.mapDetail = generateMap();
    this.users = [{ name: name, isWarder: null }];
  }

  createMap() {
    this.mapDetail = generateMap();
  }

  addUser(name) {
    this.users.push({ name: name, isWarder: null });
  }

  removeUser(name) {
    this.users = this.users.filter((x) => x.name != name);
  }

  giveRole(name) {
    let index = -1;
    if (!name) index = Math.floor(Math.random() * 2);
    else index = this.user.findIndex((x) => x.name == name);
    console.log(index);
    console.log(this.users[index]);
    this.users[index].isWarder = true;
    index = index == 0 ? 1 : 0;
    this.users[index].isWarder = false;
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
