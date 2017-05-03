import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { createAfkorting, calculateChemistry } from '../helpers';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) => {
  return (
    <li className="player-drag">
      <span className="name">{value.name}</span>
      <span className="position">{createAfkorting(value.position)}</span>
      <span className="rating">{value.rating}</span>
    </li>
  );
});

const SortableList = SortableContainer(({players, positions}) => {
  return (
    <ul className="player-list">
      {players.map((value, index) => {
        return (
          <SortableItem key={`drag-${index}`} positions={positions} index={index} value={value} />
        );
      })}
    </ul>
  );
});

class PlayerList extends Component {
  constructor() {
    super();
    this.handleChemistry = this.handleChemistry.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  componentWillMount(){
    const { playerList, side } = this.props;
    this.props.movePlayers(playerList, side);
    this.handleChemistry();
  }

  handleChemistry(){
    const {side, currentTactics, selectedPlayers} = this.props;
    const chem = calculateChemistry(side, selectedPlayers[this.props.side], currentTactics[side]);

    this.props.dispatchChemistry(side, chem);
  }

  onSortEnd({oldIndex, newIndex}){
    this.props.movePlayers(arrayMove(this.props.selectedPlayers[this.props.side], oldIndex, newIndex), this.props.side);
    this.handleChemistry();
  }

  render() {
    return (
      <SortableList
        players={this.props.selectedPlayers[this.props.side]}
        onSortEnd={this.onSortEnd}
      />
    )
  }
}

function mapStateToProps(state){
  return {
    currentTactics: state.tactics.currentTactics,
    selectedPlayers: state.players
  }
}

export default connect(mapStateToProps, actions)(PlayerList)
