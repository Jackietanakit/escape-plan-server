module.exports = () => {
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

  return {
    equals,
    generateMap,
  };
};
