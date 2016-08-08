import * as _ from 'lodash';
import * as Actions from '../game/actions';
import { moveEntity } from '../game/entity';
import { Player } from '../game/player';
import { Map } from '../game/map/map';
import * as Messaging from '../game/messaging';
import { Context, ClientMessage } from './context';
import { TEST_PARSE_RESULT } from '../game/map/parseGrid';
import { Message, gameMessage } from '../game/messaging';
import * as Character from '../game/character';

// TODO: one of the game parameters should be the number of modifiers randomly assigned
export default class Game extends Context {

  hasEnded: boolean;
  turnNumber: number;
  map: Map;

  constructor(maxPlayers: number, players: Player[], map?: Map) {
    super(maxPlayers, players);
    this.map = map || TEST_PARSE_RESULT;

    this.players.forEach((player) => {
      // set all the players' states to playing
      player.state = 'Playing';

      // FIXME: this should probably be changed later...
      if (!player.character) {
        player.character = {
          player: player,
          characterClass: Character.NoClass,
          row: 0,
          col: 0,
          allegiance: 'None',
          modifiers: null,
          goldAmount: Character.NoClass.startingGold,
          nextAction: null,
          stats: Character.NoClass.startingStats,
          inventory: Character.NoClass.startingInventory
        };
      }

      moveEntity(player.character, this.map.startingPosition);
    });

    this.turnNumber = 0;
    this.hasEnded = false;
  }

  handleMessage({ content, player, timestamp}: ClientMessage): Message[] {
    let responses: Message[] = [ Messaging.createEchoMessage(content, player) ];

    const component = Actions.getComponentByText(content);

    // if we received an action command message
    if (component) {
      const action = component.parse(content, player.character, timestamp);

      const { isValid, error } = component.validate(action, this);

      if (isValid) {
        player.character.nextAction = action;
        responses.push(Messaging.createGameMessage(`Next action: ${content}`, [ player ]));
      } else {
        responses.push(Messaging.createGameMessage(`Invalid action: ${error}`, [ player ]));
      }
    } else {
      // TODO: check if it's a communication message or just a malformed action command
    }
    return responses;
  }

  isAcceptingPlayers() {
    // once the game has started (i.e. been created), no new players can join
    return false;
  }

  isRunning() {
    return !this.hasEnded;
  }

  isReadyForNextContext(): boolean {
    // XXX: might be more 'correct' to check that no players have their state
    // as `PLAYING` or whatever...
    return this.hasEnded;
  }

  isReadyForUpdate(): boolean {
    return _.every(this.players,
      player => Boolean(player.character.nextAction));
  }

  update(): Actions.PerformResult {
    const sortedActions = <Actions.Action[]> _
      .chain(this.players)
      .map(player => player.character.nextAction)
      .sortBy(action => action.actor.stats.agility)
      .sortBy(action => action.timestamp)
      .value();

    // TODO: do something with completeLog (using Logger/Winston)
    const { messages: completeMessages, log: completeLog }: Actions.PerformResult = _.reduce(sortedActions,
      ({ messages, log }: Actions.PerformResult, action) => {
        const component = Actions.getComponentByKey(action.key);

        const { messages: newMessages, log: newLog } = component.perform(action, this, log);

        return {
          log,
          messages: messages.concat(newMessages)
        };
      }, { messages: [], log: [] });

    this.turnNumber++;

    // clear all the `nextActions`
    this.players.forEach(player => player.character.nextAction = null);

    return { messages: completeMessages, log: completeLog };
  }
}
