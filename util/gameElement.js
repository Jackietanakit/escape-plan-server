const { generateMap, generateTest } = require('./helper');

class GameElement {
  constructor(hostName, memberName, roomId) {
    this.roomId = roomId;
    this.status = 'playing';
    this.mapDetail = generateTest();
    this.users = [
      { name: hostName, isWarder: null },
      { name: memberName, isWarder: null },
    ];
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
    else index = this.users.findIndex((x) => x.name === name);
    this.users[index].isWarder = true;
    index = index == 0 ? 1 : 0;
    this.users[index].isWarder = false;
  }

  resetGame(name) {
    this.status = 'playing';
    let newMap = generateMap();
    while (this.mapDetail.id === newMap.id) newMap = generateMap();
    this.mapDetail = newMap;
    this.giveRole(name);
  }
}

module.exports = { GameElement };
// status: waiting, starting, playing
