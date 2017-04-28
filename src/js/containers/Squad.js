import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SquadView from '../components/SquadView';

class Squad extends Component {
  constructor(){
    super();

    this.handleTacticChange = this.handleTacticChange.bind(this);
    this.getPos = this.getPos.bind(this);
  }


  componentWillMount(){
    const { side } = this.props;
    this.props.fetchTactics(side);
    this.props.movePlayers(this.props.playerList, side);
  }

  handleTacticChange(event){
    const {side, selectedPlayers} = this.props;
    this.props.switchTactics(event.target.value, side, selectedPlayers[side]);

  }

  getPos(i){
    return this.props.currentTactics[this.props.side].positions[i];
  }

  render(){
    const { side, currentTactics, defaultTactics } = this.props;
    const curTac = currentTactics[side];
    const curDef = defaultTactics[side];

    return(
      <SquadView
        side={side}
        currentTactics={currentTactics}
        defaultTactics={defaultTactics}
        curTac={curTac}
        curDef={curDef}
        handleTacticChange={this.handleTacticChange}
        getPos={this.getPos}
        chemistry={this.props.chemistry}
        allTactics={this.props.allTactics}
        country={this.props.country}
        playerList={this.props.playerList}
        />
    )
  }
}

function mapStateToProps(state){
  return {
    allTactics: state.tactics.allTactics,
    defaultTactics: state.tactics.defaultTactics,
    currentTactics: state.tactics.currentTactics,
    chemistry: state.chemistry,
    selectedPlayers: state.players
  };
}

export default connect(mapStateToProps, actions)(Squad);
