import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Squad from './Squad';
import squads from '../../json/players.json';

import '../../css/App.css';

export class App extends Component {
  getBaseData(homeRating, awayRating, goal){
    const ratingArr = [homeRating, awayRating];
    const winner = Math.max(...ratingArr);
    const loser = Math.min(...ratingArr);
    const diff = winner - loser;
    const winnerFactor = 1 + (diff/winner);
    const loserFactor = 1 - (diff/loser);
    const winnerGoals = goal*winnerFactor;
    const loserGoals = goal*loserFactor;

    return { homeRating, awayRating, ratingArr, winner, loser, diff, winnerFactor, loserFactor, winnerGoals, loserGoals, goal };
  }

  differenceCarver({winner, homeRating, winnerGoals, loserGoals}){
    let homeScore, awayScore;

    if( winner === homeRating ){
      homeScore = winnerGoals;
      awayScore = loserGoals;
    } else{
      homeScore = loserGoals;
      awayScore = winnerGoals;
    }

    return {
      homeScore,
      awayScore
    };
  }

  tacticsCarver({homeScore, awayScore, homeTactic, awayTactic, winnerFactor, loserFactor}){
    //elke tactiek krijgt een offensieve en defensieve waarde

    //hoe lager defensieve waarde van je tegenstander, hoe hoger je eigen offensieve waarde wordt

    //de rating speelt ook een rol in hoe hoog die eigen offensieve waarde wordt

    //als de tegenstander beter is en aanvallend speelt, wordt je eigen aanvallende waarde minder hoog als bij een minder goede tegenstander

    //defensieve waarde blijft altijd hetzelfde

    let homeOff = parseInt(homeTactic.off, 10);
    let homeDef = parseInt(homeTactic.def, 10);
    let awayOff = parseInt(awayTactic.off, 10);
    let awayDef = parseInt(awayTactic.def, 10);

    let homeFactor = (homeScore > awayScore) ? winnerFactor : loserFactor;
    let awayFactor = (awayScore > homeScore) ? winnerFactor : loserFactor;

    homeOff += ((homeOff - awayDef)/2)*homeFactor;
    awayOff += ((awayOff - homeDef)/2)*awayFactor;

    //offensieve schaven
    homeScore += homeOff / 10;
    awayScore += awayOff / 10;

    //defensief schaven ==> hier komt de random factor in
    homeScore -= (awayDef / 10) + Math.floor(Math.random() * 3);
    awayScore -= (homeDef / 10) + Math.floor(Math.random() * 3);

    homeScore = Math.round(homeScore);
    awayScore = Math.round(awayScore);

    return {
      homeScore,
      awayScore
    };
  }

  playMatch(){
    const { chemistry, selectedPlayers } = this.props;
    const homeTeam = [...selectedPlayers[0].slice(0,11)];
    const awayTeam = [...selectedPlayers[1].slice(0,11)];
    const teams = [homeTeam, awayTeam];

    let homeRating, awayRating;

    teams.forEach((team,i) => {
      let ratingTeam = team.reduce((sum, prev) => {
        return parseInt(sum, 10)+parseInt(prev.rating, 10);
      }, 0);

      if( i === 0 ){
         homeRating = ratingTeam*chemistry[0];
       }  else{
         awayRating = ratingTeam*chemistry[1];
       }
    });

    //doelpunten genereren per team
    const startPoint = Math.floor(Math.random() * 3) + 1;
    const baseData = this.getBaseData(homeRating, awayRating, startPoint);
    const diffCarved = this.differenceCarver(baseData);

    const diffObj = {
      ...baseData,
      ...diffCarved,
      homeTactic: this.props.currentTactics[0],
      awayTactic: this.props.currentTactics[1]
    }

    const tacticsCarved = this.tacticsCarver(diffObj);
    let { homeScore, awayScore } = tacticsCarved;
    homeScore = (homeScore < 0) ? 0 : homeScore;
    awayScore = (awayScore < 0) ? 0 : awayScore;

    const scorers = this.determineScorers(homeScore, awayScore);
    this.props.setResultAndScorers([homeScore, awayScore], scorers);
  }

  positionScored(firstEleven){
    let firstElevenPositions = firstEleven.map(player => player.position);
    let newPositions = [];

    firstElevenPositions.forEach(pos => {
      if(pos === 'Keeper'){ return true; }

      let containsPos = newPositions.some(val => pos === val);
      if(!containsPos){
        newPositions.push(pos);
      }
    });

    const randomNr = Math.random();
    let scoredPos;

    if(newPositions.length < 3){
      if(randomNr <= 0.40){ scoredPos = 'Verdediger'; }
      if(randomNr > 0.40){ scoredPos = 'Middenvelder'; }

      return scoredPos;
    }

    if(randomNr <= 0.15){ scoredPos = 'Verdediger'; }
    if(randomNr >= 0.16 && randomNr < 0.5){ scoredPos = 'Middenvelder'; }
    if(randomNr >= 0.5){ scoredPos = 'Aanvaller'; }

    return scoredPos;
  }

  determineScorers(homeScore, awayScore){
    const { selectedPlayers } = this.props;
    const homeTeam = [...selectedPlayers[0].slice(0,11)];
    const awayTeam = [...selectedPlayers[1].slice(0,11)];
    const scores = [homeScore, awayScore];
    const allScorers = [[],[]];

    scores.forEach((score, index) => {
      let teamPlayers = index === 0 ? [...homeTeam] : [...awayTeam];

      for (let i = 0; i < scores[index]; i++) {
        const scorePosition = this.positionScored(teamPlayers);
        const posArr = teamPlayers.filter(player => {
          return player.position === scorePosition
        });

        const playerNr = Math.floor(Math.random() * posArr.length);
        const player = posArr[playerNr];
        const minute = Math.floor(Math.random() * 97) + 1;
        allScorers[index].push({player, minute});
      }
    });

    allScorers.forEach((val)=>{
      val.sort((a,b) => (a.minute > b.minute) ? 1 : ((b.minute > a.minute) ? -1 : 0) );
    });

    return allScorers;
  }

  shortenFirstName(name){
    let nameParts = name.split(' ');
    if( nameParts.length === 1 ){
      return nameParts.join();
    }

    let firstLetter = nameParts[0].split('')[0];
    let restNames = nameParts.slice(1, nameParts.length).join(' ');

    return `${firstLetter}. ${restNames}`;
  }

  render() {
    return (
      <div className="container">
        <div className="blocks">
          <div className="score-board">
            <div>
              <div className="score result">
                <section className="score-cnt left">
                  <span className="score-cnt__name">{squads[0].country}</span>
                  <span className="score-cnt__score">{this.props.result[0].goals}</span>
                  <ul className="goal-scorers right">
                    {this.props.result[0].scorers.map((scorer,i) => <li key={`home-${i}`}>{this.shortenFirstName(scorer.player.name)} <span className="minute"><span>&rsquo;{scorer.minute}</span></span></li>)}
                  </ul>
                </section>
                <section className="score-cnt right">
                  <span className="score-cnt__name">{squads[1].country}</span>
                  <span className="score-cnt__score">{this.props.result[1].goals}</span>
                    <ul className="goal-scorers left">
                      {this.props.result[1].scorers.map((scorer, i) => <li key={`away-${i}`}>{this.shortenFirstName(scorer.player.name)} <span className="minute"><span>&rsquo;{scorer.minute}</span></span></li>)}
                    </ul>
                </section>
              </div>
              <button type="button" className="btn" onClick={this.playMatch.bind(this)}>Speel wedstrijd!</button>
            </div>
          </div>
          { squads.map((squad, i) => <Squad side={i} country={squad.country} playerList={squad.players} key={squad.country} />) }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    chemistry: state.chemistry,
    selectedPlayers: state.players,
    currentTactics: state.tactics.currentTactics,
    result: state.result
  }
}

export default connect(mapStateToProps, actions)(App);
