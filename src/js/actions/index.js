import {
  SWITCH_TACTICS,
  FETCH_TACTICS,
  DISPATCH_CHEMISTRY,
  MOVE_PLAYERS,
  SET_RESULT,
  SET_SCORERS
} from '../actions/types';

import tactics from '../../json/tactics.json';
import { calculateChemistry } from '../Helpers';

function getPositionsFromTactic(tactic){
  return tactics.all.find(tac => tactic === tac.name);
}

export function fetchTactics(){
  return {
    type: FETCH_TACTICS,
    payload: {
      all: tactics.all,
      defaults: tactics.defaults
    }
  }
}

const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

export function switchTactics(tactic, side, selectedPlayers){
  return function(dispatch){
    //switch tactics
    dispatch({
      type: SWITCH_TACTICS,
      payload: {
        side,
        tactic: getPositionsFromTactic(tactic)
      }
    });

    const currentTactic = tactics.all.find(foundTactic => foundTactic.name === tactic);

    return delay(50).then(() => {
      dispatch(dispatchChemistry(side, calculateChemistry(side, selectedPlayers, currentTactic)));
    });
  }
}

export function dispatchChemistry(side, chemistry){
  return {
    type: DISPATCH_CHEMISTRY,
    payload: {
      side,
      chemistry
    }
  }
}

export function movePlayers(players, side){
  return {
    type: MOVE_PLAYERS,
    payload: {
      players,
      side
    }
  }
}

export function setResult(result){
  return {
    type: SET_RESULT,
    payload: result
  }
}

export function setScorers(scorers){
  return {
    type: SET_SCORERS,
    payload: scorers
  }
}

export function setResultAndScorers(result, scorers){
  return function(dispatch) {
    dispatch({
      type: SET_RESULT,
      payload: result
    });

    return delay(0).then(() => {
      dispatch({
        type: SET_SCORERS,
        payload: scorers
      });
    });
  }
}
