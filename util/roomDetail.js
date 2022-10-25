class RoomDetail {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  addHost(userInfo) {
    const hostInfo = {
      ...userInfo,
      isHost: true,
    };
    this.users.push(hostInfo);
  }

  addMember(userInfo) {
    const memberInfo = { ...userInfo, isHost: false };
    this.users.push(memberInfo);
  }

  removeUser(name) {
    this.users = this.users.filter((x) => x.name != name);
    if (this.users.length == 1) this.users[0].isHost = true;
  }
}

module.exports = { RoomDetail };
