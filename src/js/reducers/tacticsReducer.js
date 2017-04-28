import { SWITCH_TACTICS, FETCH_TACTICS } from '../actions/types';
import tactics from '../../json/tactics.json';

function getPositionsFromTactic(tactic){
  return tactics.all.find((tac) => {
    return tactic === tac.name;
  });
}

const defaultState = {
  allTactics: [],
  currentTactics: [
    getPositionsFromTactic(tactics.defaults[0]),
    getPositionsFromTactic(tactics.defaults[1])
  ],
  defaultTactics: []
};

export default function(state = defaultState, action){
  switch(action.type){
    case FETCH_TACTICS:
      return {
        ...state,
        allTactics: action.payload.all,
        defaultTactics: action.payload.defaults
      }

    case SWITCH_TACTICS:
      let newTactics = [...state.currentTactics];
      newTactics[action.payload.side] = action.payload.tactic;

      return {
        ...state,
        currentTactics: newTactics
      }

    default:
      return state;
  }
}
