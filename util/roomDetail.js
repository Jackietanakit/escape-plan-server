class RoomDetail {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  addHost(userInfo) {
    const hostInfo = {
      name: userInfo.name,
      avartarId: userInfo.avartarId,
      isHost: true,
      score: userInfo.score,
    };
    this.users.push(hostInfo);
  }

  addMember(userInfo) {
    const memberInfo = {
      name: userInfo.name,
      avartarId: userInfo.avartarId,
      isHost: false,
      score: userInfo.score,
    };
    this.users.push(memberInfo);
  }

  removeUser(name) {
    this.users = this.users.filter((x) => x.name != name);
  }
}

module.exports = { RoomDetail };
