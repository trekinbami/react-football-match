import { SET_RESULT, SET_SCORERS } from '../actions/types';

function shapeStateToResults(state, action) {
  return action.payload.reduce((sum, prev, i) => {
    sum[i] = {goals: prev, scorers: []};
    return sum;
  }, state);
}

function shapeStateToScorers(state, action) {
  return [...state].map((stateTeam, index) => {
    let teamObj = { ...stateTeam };
    teamObj.scorers = action.payload[index];
    return teamObj;
  });
}

export default function(state = [{goals: 0, scorers: []}, {goals: 0, scorers:[]}], action){
  switch(action.type){
    case SET_RESULT:
    const resultState = shapeStateToResults(state, action);
      return [...resultState];

    case SET_SCORERS:
    const scorersState = shapeStateToScorers(state, action);
      return [...scorersState];

    default:
      return state;
  }
}
