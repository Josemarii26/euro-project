import React from 'react';
import PropTypes from 'prop-types';
import { getTeamFlag } from "./FlagUtils";
import './MatchCard.css';

const MatchCard = ({ match, onClick }) => {
  const { teamA, teamB, isFinished } = match;

  const getScoreOrVs = () => {
    if (isFinished && teamA.score !== undefined && teamB.score !== undefined) {
      return `${teamA.score} - ${teamB.score}`;
    } else {
      return 'VS';
    }
  };

  return (
    <div className="match-card" onClick={() => onClick(match)}>
      <div className="match-info">
        <div className="teams">
          <div className="team">
            <img src={getTeamFlag(teamA.team.name.toLowerCase())} alt={teamA.team.name} className="team-flag" />
            <span className="team-name">{teamA.team.name.toUpperCase().substring(0, 3)}</span>
          </div>
          <div className="score">
            <span className={isFinished ? 'result-finished' : 'result-unfinished'}>{getScoreOrVs()}</span>
          </div>
          <div className="team">
            <img src={getTeamFlag(teamB.team.name.toLowerCase())} alt={teamB.team.name} className="team-flag" />
            <span className="team-name">{teamB.team.name.toUpperCase().substring(0, 3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

MatchCard.propTypes = {
  match: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MatchCard;
