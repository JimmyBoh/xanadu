let _ = require('lodash');
let Room    = require('./room');
let TreasureRoom = require('./treasureRoom');
let PassageRoom = require('./passageRoom');
let Barrier = require('./barrier');

const CONSTRUCTOR_MAP = {
  '_': Room,
  '#': Barrier,
  'X': TreasureRoom,
  '^': PassageRoom
};

class Map {
  constructor(kwargs = []) {
    this.seed = kwargs.seed;
    this.rng  = kwargs.rng;
    let d = this.dimension = kwargs.dimension;
    const percentWalls = 50;
    let textMap = this.generateMap(this.seed, d, percentWalls);
    console.log(textMap);

    this.cells = [[]];
    this.treasureRoom = null;
    this.startingPassageRoom = null;

    _.range(d, (y) => {
      _.range(d, (x) => {
        /*
        this.cells[y][x] = new Cell({
          x: x,
          y: y,
          map: this
        });
        */

        let cellType = textMap[y][x];

        let cellConstructor = CONSTRUCTOR_MAP[cellType];

        if (!cellConstructor) {
          console.err('UNKNOWN CELL CONSTRUCTOR!');
        }

        this.cells[y][x] = new cellConstructor({
          map: this,
          x: x,
          y: y
        });

        if (this.cells[y][x] instanceof PassageRoom &&
            !this.startingPassageRoom) {
          this.startingPassageRoom = this.cells[y][x];
        }

        if (this.cells[y][x] instanceof TreasureRoom) {
          this.treasureRoom = this.cells[y][x];
        }
      });
    });
  }
  generateMap(rng, dim) {
    let map = [[]];

    _.range(dim, (y) => {
      _.range(dim, (x) => {
        // TODO: random generation logic
        if (x === 0 && y === 0) {
          map[y][x] = '^';
        } else if (x === (dim - 1) && y === (dim - 1)) {
          map[y][x] = 'T';
        } else {
          map[y][x] = '_';
        }
      })
    });
  }
  hasCell(x, y) {
    let d = this.dimension;
    return (
      0 <= x &&
      x <  d &&
      0 <= y &&
      y <  d
    );
  }
  getCell(x, y) {
    return this.cells[y][x];
  }
}

module.exports = Map;
