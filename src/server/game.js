let gen = require('random-seed');
let http = require('http');
let express = require('express');
let path = require('path');
let ioFunc = require('socket.io');
let _ = require('lodash');
let Emitter = require('events');
let Player  = require('./player');
let Room = require('./map/room');
let WITHOUT_NAME = false;
class Game extends Emitter {
  constructor(args = {}) {
    super(args);
    // set up server stuff
    this.expressApp = express();
    this.port = args.port || 3000;
    let serverElements = this.createServer();
    this.ns = args.ns || '/';
    this.maxPlayers = args.maxPlayers || 8;

    // stuff for the actual game
    this.players = args.players || [];
    this.map = this.generateMap();
    this.hasStarted = false;
    this.hasEnded   = false;
    this.turnNumber = 0;
    this.seed       = args.seed || Date.now();
    this.rng        = gen(this.seed);
  }
  generateMap(N = 16) {

    let map = new Array(N);

    // TODO: use x, y instead
    _.forEach(map, (__, index) => {
      map[index] = new Array(N);

      _.forEach(map[index], (____, roomSpot) => {
        map[index][roomSpot] = new Room();
      });
    });

    // TODO: generation logic would go here...

    return map;
  }
  isAcceptingPlayers() {
    return !this.hasStared;
  }
  play() {
    console.log('\t\tPLAYING...');
  }
  update() {
    // TODO: the main update ("tick") logic will go here
  }
  createServer() {
    //this.expressApp = express();
    let httpServer = http.Server(this.expressApp);
    let io = ioFunc(httpServer);

    // serve the client stuff
    this.expressApp.use(express.static(path.join(
      __dirname, '..', 'client'
    )));

    const NODE_MODULES_DIR = path.join(
      __dirname, '..', '..', 'node_modules'
    );

    this.expressApp.use('/jquery', express.static(path.join(
      NODE_MODULES_DIR, 'jquery', 'dist'
    )));

    this.expressApp.use('/bootstrap', express.static(path.join(
      NODE_MODULES_DIR, 'bootstrap', 'dist'
    )));

    httpServer.listen(this.port, () => {
      console.log(`Xanadu game listening on port ${ this.port }`);
    });

    // now add the socket.io listeners
    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        if (socket.player) {
          console.log(`user ${ socket.player.id() + '--' + socket.player.name } disconnected`);
        } else {
          console.log(`anon user ${ socket.id } disconnected`);
        }

        // remove them from this list of players
        _.remove(this.players, (player) => player.id() == socket.player.id());
      });

      if (this.players.length < this.maxPlayers) {
        this.acceptSocket(socket);
      } else {
        this.rejectSocket(socket);
      }
    });

    return {
      httpServer: httpServer,
      io: io
    };
  }
  acceptSocket(socket) {
    socket.player = new Player({
      socket: socket,
      game: this
    });
    this.players.push(socket.player);
    let spotsLeft = this.maxPlayers - this.players.length;
    console.log('\taccepted socket');
    console.log(`\t${ spotsLeft } / ${ this.maxPlayers } spots left`);
    socket.emit('request-name'); // might not be nec.
  }
  rejectSocket(socket) {
    console.log(`socket ${ socket.id } rejected -- game full`);
    socket.emit('rejected-from-room');
  }
  message(player, messageObj) {
    var message   = messageObj.msg;
    var timeStamp = messageObj.ts;

    // always echo the message back to the player
    // TODO: move this to the bottom of the method
    // we may want to echo in a different manner
    // (e.g. whisper + style both to and from sockets)
    player.echo(message);

    if (player.state === Player.PLAYER_STATES.ANON && !this.hasStarted) {
      //TODO: first check if name is unique
      player.name = message;
      player.state = Player.PLAYER_STATES.NAMED;
      player.message(`Welcome to Xanadu ${ player.name }! Enter \`ready\` to start.`);
      player.broadcast(`${ player.name } has joined the game!`, WITHOUT_NAME);
    } else if (player.state === Player.PLAYER_STATES.NAMED && !this.hasStarted) {
      if (message.toLowerCase() === 'ready') {
        player.state = Player.PLAYER_STATES.READY;
        player.message('The game will start when everyone is ready...');
        player.broadcast(`${ player.name } is ready!`, WITHOUT_NAME);
        this.attemptToStart();
      } else {
        // anyone can talk to anyone before the game starts
        this.handleMessage(messageObj, player, {
          defaultTo: 'broadcast'
        });
      }
    } else if (player.state == Player.PLAYER_STATES.PLAYING && this.hasStarted) {
      this.handleMessage(messageObj, player);
    } else {
      // do nothing
    }
  }
  handleMessage(messageObj, player, kwargs = {}) {
    // check if it's a special command
    var message   = messageObj.msg;
    // XXX: do something with timeStamp
    // e.g. to players attempt to grab the same item
    //var timeStamp = messageObj.ts;
    if (message.startsWith(':')) {
      let split = message.split(' ');

      let command = split[0];

      switch (command) {
        case ':to':
           if (!split[1]) {
             throw 'unknown recipient';
           }
           let toName = split[1];
           let toMessage = split.slice(2).join(' ');
           player.whisper(toMessage, toName);
           //player.echo(message);
           break;
        default:
           throw 'unknown command type';
      }
    } else {
      if (kwargs.defaultTo) {
        switch (kwargs.defaultTo) {
          case 'message':
            player.message(message, kwargs.speaker);
            break;
          case 'echo': // XXX: echoed already... nec?
            player.echo(message);
            break;
          case 'broadcast':
            player.broadcast(message, kwargs.withName);
            break;
          case 'whisper':
            player.whisper(message, kwargs.toName);
            break;
          default:
            // do nothing
            break;
        }
      } else {
        // do nothing
      }
    }
  }
  attemptToStart() {
    console.log(this.players.map(player => [player.name, player.state]));
    if (this.players.every((player) => player.state === Player.PLAYER_STATES.READY)) {
      this.hasStarted = true;
      console.log('GAME STARTED!');
      // TODO echo that game has started to the users
    }
  }
}

module.exports = Game;
