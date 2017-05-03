export function createAfkorting(position){
  switch(position){
    case 'Aanvaller':
      return 'AAN';

    case 'Middenvelder':
      return 'MID';

    case 'Verdediger':
      return 'VER';

    case 'Keeper':
      return 'DOE';

    default:
      return position;
  }
}

export function calculateChemistry(side, players, currentTactics){
  let currentPlayers = players;
  let currentTactic = currentTactics;
  let chemistry = 0;

  currentTactic.positions.forEach((pos, i) => {
    if(pos === createAfkorting(currentPlayers[i].position)){
      chemistry += (100/11);
    }
  });

  return Math.floor(chemistry);
}
