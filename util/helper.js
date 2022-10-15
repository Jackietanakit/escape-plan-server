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

module.exports = { equals, generateMap, makeId };
