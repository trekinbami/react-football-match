import React from 'react';
import PlayerList from '../containers/PlayerList';

export default (props) => (
  <section className="player-block">
    <header>
      <h2>{props.country}</h2>
      <div className="team-header">
        <section className="team-att">
          <strong>Tactiek:</strong>
          <select
            value={props.curTac ? props.curTac.name : props.curDef}
            onChange={props.handleTacticChange.bind(this)}>
              <option value="">Kies een tactiek..</option>
              {props.allTactics.map(tactic => <option key={tactic.name} value={tactic.name}>{tactic.name}</option>)}
          </select>
        </section>
        <section className="team-att">
          <strong>Chemie: </strong>
          <span>{props.chemistry[props.side]}%</span>
        </section>
      </div>
    </header>
    <div className="list-container">
      <ul className="list-container__list">
        {props.playerList.map((player, i) => <li key={i} className={`${ props.getPos(i) ? '' : 'wissel' }`}>{props.getPos(i) ? props.getPos(i) : 'SUB'}</li>)}
      </ul>
      <PlayerList
        playerList={props.playerList}
        currentTactics={props.currentTactics}
        side={props.side}
      />
    </div>
  </section>
)
