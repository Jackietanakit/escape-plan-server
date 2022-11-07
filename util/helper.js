const generateMap = () => {
  let map = [
    [0, 0, 0, 'p', 'h'],
    [0, 1, 0, 'w', 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  let pCoor = [0, 3];
  let wCoor = [1, 3];
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
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

module.exports = { generateMap, makeId, arraysEqual };
