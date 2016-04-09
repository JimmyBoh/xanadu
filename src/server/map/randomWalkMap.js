/* Based off the following content:
 * http://www.roguebasin.com/index.php?title=Random_Walk_Cave_Generation
 */
let RNG = require('random-seed');
let F2DA = require('fixed-2d-array');

const CELL_TYPES = {
  ROOM: '_',
  BARRIER: '#',
  TREASURE_ROOM: 'X',
  PASSAGE_ROOM: '^'
};

let RandomWalkMapGenerator = (seed, dim, percentBarrier) => {
  const startingCell = { row: dim / 2, col: dim / 2 };
  const percentRoom = 100 - percentBarrier;
  const minNumRooms = Math.floor((percentRoom / 100.0) * (dim - 1) * (dim - 1));
  const hasCell = ({ row, col }) => {
    return (
        0 <= row &&
        row < dim &&
        0 <= col &&
        col < dim
    );
  };

  const onEdge = ({ row, col }) => {
    return (
        row === 0 ||
        col === 0 ||
        row === dim - 1 ||
        col === dim - 1
    );
  };

  const combinePos = ({ row: r1, col: c1 }, { row: r2, col: c2 }) => {
    return { row: r1 + r2, col: c1 + c2 };
  };

  let map = new F2DA(dim, dim, CELL_TYPES.BARRIER);
  map.set(dim / 2, dim / 2, CELL_TYPES.ROOM);

  let numRooms = 1;
  let rng = new RNG(seed);

  let currPos = startingCell;
  let rand, updatePos;

  let noUpdate = 0;
  const updateLimit = Math.floor(dim * dim / 4);

  // while insufficient number of rooms
  while (numRooms < minNumRooms) {
    if (false && numRooms % 10 === 0) {
      console.log(`numRooms: ${ numRooms } ||| minNumRooms: ${ minNumRooms }`);
    }

    // take a random step in cardinal direction
    // don't want any diagonal paths

    rand = rng.intBetween(0, 3);

    if (rand === 0) {
      // North
      updatePos = { row: 0, col: -1 };
    } else if (rand === 1) {
      // South
      updatePos = { row: 0, col: 1 };
    } else if (rand === 2) {
      // West
      updatePos = { row: -1, col: 0 };
    } else if (rand === 3) {
      // East
      updatePos = { row: 1, col: 0 };
    } else {
      // do nothing
    }

    let possibleNewPos = combinePos(currPos, updatePos);

    if (hasCell(possibleNewPos) && !onEdge(possibleNewPos)) { 
      if (map.get(possibleNewPos.row, possibleNewPos.col) === CELL_TYPES.BARRIER) {
        currPos = possibleNewPos;
        map.set(currPos.row, currPos.col, CELL_TYPES.ROOM);
        numRooms++;
      } else {
        // XXX: might want to update to possibleNewPos anyway...
        noUpdate++;

        if (noUpdate >= updateLimit) {
          // jump somewhere new on the map
          currPos = {
            // i.e. not 0 or dim - 1
            row: rng.intBetween(1, dim - 2),
            col: rng.intBetween(1, dim - 2)
          };
        }
      }
    } else {
    }
  }

  return map;
};

module.exports = RandomWalkMapGenerator;
