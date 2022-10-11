module.exports = (io, map, pCoor, wCoor) => {
  const generateMap = function () {
    // function to create Map
    map = [
      [0, 0, 0, 0, "h"],
      ["p", 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, "w"],
      [0, 0, 0, 0, 0],
    ];
    io.emit("generated-map", map);
  };

  const sendCoor = function (coordinate, role) {
    if (role == "prisoner") pCoor = coordinate;
    if (role == "warder") wCoor = coordinate;
    if (pCoor != [] && wCoor != []) {
      updateMap(pCoor, wCoor);
      pCoor = [];
      wCoor = [];
    }
  };

  const updateMap = function (pCoor, wCoor) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] == "p") {
          map[i][j] = 0;
        } else if (map[i][j] == "w") {
          map[i][j] = 0;
        }
      }
    }
    if (map[pCoor[0]][pCoor[1]] == "h")
      socket.emit("receive:coordinate", "Prisoner Win!");
    else map[pCoor[0]][pCoor[1]] = "p";
    if (map[wCoor[0]][wCoor[1]] == "p")
      socket.emit("receive:coordinate", "Warder Win!");
    else map[wCoor[0]][wCoor[1]] = "w";
    socket.emit("receive:coordinate", map);
  };

  return {
    generateMap,
    sendCoor,
  };
};
