import { MOVE_PLAYERS } from '../actions/types';

export default function(state = [[],[]], action){
  switch(action.type){
    case MOVE_PLAYERS:
      let movedPlayers = [...state];
      movedPlayers[action.payload.side] = action.payload.players;

      return movedPlayers;

    default:
      return state;
  }
}
