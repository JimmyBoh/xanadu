let _ = require('lodash');

/*
 * player states [LINEAR]
 *    anon
 *    named
 *    ready
 *    playing (alive)
 *    dead
 *    spectating
 *    absent (player removed self from game)
 */

const PLAYER_STATES = {
  ANON: 0,
  NAMED: 1,
  READY: 2,
  PLAYING: 3,
  DEAD: 4,
  SPECTATING: 5,
  ABSENT: 6
};

class Player {
  constructor(args = {}) {
    this.socket = args.socket;
    this.game   = args.game;
    /*
    if (this.game) {
      this.game.players.push(this);
    } */
    this.character = {}; // TODO
    this.state = PLAYER_STATES.ANON;
    // XXX this could be buggy (i.e. ANON && "has" name)
    this.name = args.name || '[NO NAME]';
    // add main listener
    this.socket.on('message', (message) => {
      console.log(message);
      this.game.message(this, message);
    });
  }

  isAnon() {
    return this.state === PLAYER_STATES.ANON;
  }

  isNamed() {
    return this.state === PLAYER_STATES.NAMED;
  }

  isPlaying() {
    return this.state === PLAYER_STATES.PLAYING;
  }

  isDead() {
    // check for inconsistency bugs
    if ((this.state === PLAYER_STATES.DEAD) !== (this.isAlive() === false)) {
      console.log('INCONSISTENT DEATH STATE!!!');
    }

    return this.state === PLAYER_STATES.DEAD;
  }

  isSpectating() {
    return this.state === PLAYER_STATES.SPECTATING;
  }

  isAbsent() {
    return this.state === PLAYER_STATES.ABSENT;
  }

  id () {
    return this.socket.id;
  }

  // * -> player
  message (message, speaker = 'xanadu') {
    this.socket.emit('message', {
      speaker: speaker,
      message: message,
      type: 'message'
    });
  }

  // player -> self
  echo (message) {
    this.socket.emit('message', {
      speaker: this.name,
      message: message,
      type: 'echo'
    });
  }

  // player -> all
  broadcast (message, withName = true) {
    this.socket.broadcast.emit('message', {
      speaker: withName ? this.name : '',
      message: message,
      type: 'broadcast'
    });
  }

  // player -> player
  // XXX: is this unnec. b/c of .message func?
  whisper (message, toName) {
    toName = toName.toLowerCase();
    let toPlayer = _.find(this.game.players,
        (player) => player.name.toLowerCase() === toName);
    toPlayer.socket.emit('message', {
      speaker: this.name,
      message: message,
      type: 'whisper'
    });
  }
}

Player.PLAYER_STATES = PLAYER_STATES;

module.exports = Player;
