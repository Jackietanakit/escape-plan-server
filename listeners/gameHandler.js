module.exports = (io, map, pCoor, wCoor) => {
  const createMap = function () {
    // function to create Map
    map = [
      [0, 0, 0, 0, "h"],
      ["p", 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, "w"],
      [0, 0, 0, 0, 0],
    ];
    io.emit("map:create-done", map);
  };

  const updateCoor = function (coordinate, role) {
    if (role == "prisoner") pCoor = coordinate;
    if (role == "warder") wCoor = coordinate;
    if (pCoor != [] && wCoor != []) {
      updateMap(pCoor, wCoor);
      pCoor = [];
      wCoor = [];
    }
  };

  const updateMap = function (pCoor, wCoor) {
    for (let i in map) {
      for (let j in map[i]) {
        if (map[i][j] == "p") {
          map[i][j] = 0;
        } else if (map[i][j] == "w") {
          map[i][j] = 0;
        }
      }
    }
    if (map[pCoor[0]][pCoor[1]] == "h")
      socket.emit("coor:update-done", "Prisoner Win!");
    else map[pCoor[0]][pCoor[1]] = "p";
    if (map[wCoor[0]][wCoor[1]] == "p")
      socket.emit("coor:update-done", "Warder Win!");
    else map[wCoor[0]][wCoor[1]] = "w";
    socket.emit("coor:update-done", map);
  };

  return {
    createMap,
    updateCoor,
  };
};
