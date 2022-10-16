const { createUser, findUser } = require('../schema/user');

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const generateMap = () => {
  let map = [
    [0, 0, 0, 0, 'h'],
    ['p', 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 'w'],
    [0, 0, 0, 0, 0],
  ];
  let pCoor = [1, 0];
  let wCoor = [3, 4];
  let hCoor = [0, 4];
  return {
    map: map,
    pCoor: pCoor,
    wCoor: wCoor,
    hCoor: hCoor,
  };
};

const makeId = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const userLogin = async (name, avatarId, userInSocket, socket) => {
  var userData = await findUser(name);
  if (userData == null) {
    userData = { name: name, score: 0 };
    createUser(userData);
  }
  socket.userInfo = {
    name: name,
    score: userData.score,
    avatarId: avatarId,
    role: null,
  };
  userInSocket.push(name);
};

module.exports = { equals, generateMap, makeId, userLogin };
