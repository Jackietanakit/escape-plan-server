const generateMap = () => {
  const nigger = [
    //0
    [
      [
        [0, 0, 0, 0, 'h'],
        ['p', 1, 0, 0, 0],
        [1, 1, 1, 0, 0],
        [0, 0, 1, 0, 'w'],
        [0, 0, 0, 0, 0],
      ],
      [1, 0],
      [3, 4],
      [0, 4],
    ],
    //1
    [
      [
        [1, 1, 0, 0, 'w'],
        [0, 0, 0, 1, 0],
        ['p', 1, 0, 0, 0],
        [0, 1, 0, 'h', 0],
        [0, 0, 0, 0, 0],
      ],
      [2, 0],
      [0, 4],
      [3, 3],
    ],
    //2
    [
      [
        [0, 'p', 0, 1, 0],
        [1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        ['h', 0, 0, 1, 0],
        [0, 0, 0, 'w', 0],
      ],
      [0, 1],
      [4, 3],
      [3, 0],
    ],
    //3
    [
      [
        ['w', 0, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 'h', 0, 0],
        [0, 0, 0, 1, 0],
        [1, 1, 0, 0, 'p'],
      ],
      [4, 4],
      [0, 0],
      [2, 2],
    ],
    //4
    [
      [
        [0, 1, 0, 0, 0],
        ['p', 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 'h', 1, 'w'],
        [0, 0, 0, 0, 0],
      ],
      [1, 0],
      [3, 4],
      [3, 2],
    ],
    //5
    [
      [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 'h', 0],
        [0, 0, 0, 0, 1],
        ['p', 1, 1, 0, 0],
        [0, 0, 0, 0, 'w'],
      ],
      [3, 0],
      [4, 4],
      [1, 3],
    ],
    //6
    [
      [
        ['w', 0, 1, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 1, 0, 'p'],
        [0, 0, 1, 0, 0],
        ['h', 0, 0, 0, 1],
      ],
      [2, 4],
      [0, 0],
      [4, 0],
    ],
    //7
    [
      [
        [1, 0, 0, 0, 0],
        [1, 0, 'h', 0, 0],
        [0, 0, 0, 1, 'w'],
        [0, 0, 0, 1, 0],
        ['p', 1, 0, 0, 0],
      ],
      [4, 0],
      [2, 4],
      [1, 2],
    ],
    //8
    [
      [
        ['p', 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 'h', 0, 0],
        [0, 1, 1, 1, 0],
        ['w', 0, 0, 0, 0],
      ],
      [0, 0],
      [4, 0],
      [2, 2],
    ],
    //9
    [
      [
        [1, 0, 'h', 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 0, 'w'],
        ['p', 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
      ],
      [3, 0],
      [2, 4],
      [0, 2],
    ],
    //10
    [
      [
        [1, 0, 0, 0, 0],
        [0, 'w', 0, 1, 0],
        [0, 'h', 0, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 'p', 1],
      ],
      [4, 3],
      [1, 1],
      [2, 1],
    ],
  ];
  let random = Math.floor(Math.random() * 11);

  return {
    id: random,
    map: nigger[random][0],
    pCoor: nigger[random][1],
    wCoor: nigger[random][2],
    hCoor: nigger[random][3],
  };
};

const generateTest = () => {
  return {
    id: 'kauy',
    map: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      ['p', 'h', 1, 1, 1],
      ['w', 0, 1, 1, 1],
    ],
    pCoor: [3, 0],
    wCoor: [4, 0],
    hCoor: [3, 1],
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

module.exports = { generateMap, generateTest, makeId, arraysEqual };
