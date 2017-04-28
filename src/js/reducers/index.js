import { combineReducers } from 'redux';
import tacticsReducer from './tacticsReducer';
import chemistryReducer from './chemistryReducer';
import playersReducer from './playersReducer';
import resultReducer from './resultReducer';

const rootReducer = combineReducers({
  tactics: tacticsReducer,
  chemistry: chemistryReducer,
  players: playersReducer,
  result: resultReducer
});

export default rootReducer;
