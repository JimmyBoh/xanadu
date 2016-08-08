import * as Winston from 'winston';
import Server from './server/server';
import { Promise } from 'es6-promise';
import { Logger } from './logger';

export type CommandLineArgs = {
  maxPlayers?: number,
  debug: boolean,
  port?: number,
  seed?: number
};

export function parseArgs(givenArgs: string[]): CommandLineArgs {
  let args = {
    maxPlayers: NaN,
    debug: false,
    port: NaN,
    seed: NaN
  };

  let i = 0;
  while (i < givenArgs.length) {
    if (givenArgs[i] === '--no-debug') {
      args.debug = false;
      i++;
    } else if (givenArgs[i] === '--debug') {
      args.debug = true;
      i++;
    } else if (givenArgs[i] === '--port') {
      let port = parseInt(givenArgs[i + 1], 10);
      if (port < 1 || port > 65535) {
        port = NaN;
      }
      args.port = port;
      i += 2;
    } else if (givenArgs[i] === '--maxPlayers') {
      let maxPlayers = parseInt(givenArgs[i + 1], 10);
      if (maxPlayers < 2) {
        maxPlayers = NaN;
      }
      args.maxPlayers = maxPlayers;
      i += 2;
    } else if (givenArgs[i] === '--seed') {
      args.seed = parseInt(givenArgs[i + 1], 10);
      i += 2;
    } else {
      // continue through...
      i++;
    }
  }

  if (givenArgs.indexOf('--with-defaults') > -1) {
    return {
      maxPlayers: args.maxPlayers || 8,
      debug: args.debug || false,
      port: args.port || 3000,
      seed: args.seed || 1234
    };
  } else {
    return args;
  }
}

export function startServer(args: CommandLineArgs, logger: Logger): Promise<Server> {
  const { maxPlayers, debug, port, seed } = args;
  if (isNaN(maxPlayers) || isNaN(port) || isNaN(seed)) {
    let errMsg = 'Invalid arguments (`--with-defaults` flag is suggested):\n';
    if (isNaN(maxPlayers)) {
      errMsg += '\t- maxPlayers should be a number greater than 1\n';
    }
    if (isNaN(port)) {
      errMsg += '\t- port should be a number between 1 and 65535\n';
    }
    if (isNaN(seed)) {
      errMsg += '\t- seed should be a number\n';
    }

    return Promise.reject(new Error(errMsg));
  } else {
    const server = new Server(maxPlayers, port, seed.toString(), debug, logger);

    return server.start();
  }
}

function isBeingRun(): boolean {
  return !module.parent;
}

if (isBeingRun()) {
  const args = parseArgs(process.argv.slice(2));

  // use the default Winston logger
  const winston = Winston;

  if (args.debug) {
    winston.level = 'debug';
  } else {
    winston.level = 'info';
  }

  startServer(args, winston).then((server: Server) => {
    server.logger.log('info', `XANADU SERVER LISTENING ON PORT: ${ server.port }`);
  }, (error: Error) => {
    winston.error(error.message);
    process.exit(1);
  });
}
