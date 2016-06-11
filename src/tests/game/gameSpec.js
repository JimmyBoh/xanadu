import { expect } from 'chai';

import Game from '../../game/game';
import Map from '../../game/map/map';
import Player from '../../game/player';

const createGame = () => (new Game({rng: () => 4}));

describe('constructor', () => {
  it('should not construct without an rng', () => {
    expect(() => (new Game({}))).to.throw();
  });

  it('should set default arguments', () => {
    const g = createGame();
    expect(g.players).to.eql([]);
    expect(g.map).to.eql((new Map({})));
    expect(g.maxPlayers).to.equal(8);
    expect(g.turnNumber).to.equal(0);
    expect(g.hasStarted).to.equal(false);
    expect(g.hasEnded).to.equal(false);
  });
});

describe('addPlayer', () => {
  const g = createGame();

  it('should return a game and a player', () => {
    const { game, player } = g.addPlayer(1);
    expect(game.players.length).to.equal(1);
    expect(player).not.to.be.undefined;
  });

  it('should not modify the original game', () => {
    g.addPlayer(1);
    expect(g.players.length).to.equal(0);
  });
});

describe('removePlayer', () => {
  const g = createGame();
  const { game } = g.addPlayer(1);

  it('should return a game and a player', () => {
    const result = game.removePlayer(1);
    expect(result.game.players.length).to.equal(0);
    expect(result.player).not.to.be.undefined;
  });

  it('should not modify the original game', () => {
    game.removePlayer(1);
    expect(game.players.length).to.equal(1);
  });
});

const addPlayer = g => id => g.addPlayer(id).game;

describe('getPlayer', () => {
  const g = createGame();
  const withAdded = addPlayer(g);

  it('should not find a player if not present', () => {
    expect(g.getPlayer(1)).to.be.undefined;
    const g1 = withAdded(2);
    expect(g1.getPlayer(1)).to.be.undefined;
  });

  it('should be able to find a present player', () => {
    const g = withAdded(1);
    expect(g.getPlayer(1)).to.eql((new Player({id: 1})));
  });
});

describe('hasPlayer', () => {
  const g = createGame();
  const withAdded = addPlayer(g);

  it('should not find a player if not present', () => {
    expect(g.hasPlayer(1)).to.equal(false);
    const g1 = withAdded(2);
    expect(g1.hasPlayer(1)).to.equal(false);
  });

  it('should be able to find a present player', () => {
    const g = withAdded(1);
    expect(g.hasPlayer(1)).to.equal(true);
  });
});

describe('getPlayerWithName', () => {
  const g = createGame();
  const { game, player } = g.addPlayer(1);
  player.name = 'test';

  it('should not get a player that does not exist', () => {
    expect(game.getPlayerWithName('blah')).to.be.undefined;
  });

  it('should get an existing player', () => {
    expect(game.getPlayerWithName(player.name)).to.eql(player);
  });
});

describe('hasPlayerWithName', () => {
  const g = createGame();
  const { game, player } = g.addPlayer(1);
  player.name = 'test';

  it('should not get a player that does not exist', () => {
    expect(game.hasPlayerWithName('blah')).to.equal(false);
  });

  it('should get an existing player', () => {
    expect(game.hasPlayerWithName(player.name)).to.equal(true);
  });
});

describe('handleChatMessage', () => {
  // TODO
});

describe('isAcceptingPlayers', () => {
  // TODO
});

describe('isRunning', () => {
  // TODO
});