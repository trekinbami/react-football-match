import { DISPATCH_CHEMISTRY } from '../actions/types';

export default function(state = [0,0], action){
  switch(action.type){
    case DISPATCH_CHEMISTRY:
      let chemistry = [...state];
      chemistry[action.payload.side] = action.payload.chemistry;
      return chemistry;

    default:
      return state;
  }
}
