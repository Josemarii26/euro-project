import React, { useState } from "react";
import { predictions, users } from "./predictionData";
import { getTeamFlag } from "./FlagUtils";
import "./Predictions.css";

const Predictions = ({ matches }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const calculateScores = () => {
    return users
      .map((user) => {
        let score = 0;
        let exactPredictions = 0;
        let correctOutcomePredictions = 0;
        let incorrectPredictions = 0;

        matches
          .filter((match) => match.isFinished)
          .forEach((match) => {
            const matchId = `${match.teamA.team.name.toLowerCase()}-${match.teamB.team.name.toLowerCase()}`;
            const userPrediction = predictions.find(
              (p) => p.userId === user.id && p.matchId === matchId
            );
            if (userPrediction) {
              const correctResult =
                match.teamA.score === userPrediction.teamA &&
                match.teamB.score === userPrediction.teamB;
              const correctOutcome =
                (match.teamA.score > match.teamB.score &&
                  userPrediction.teamA > userPrediction.teamB) ||
                (match.teamA.score < match.teamB.score &&
                  userPrediction.teamA < userPrediction.teamB) ||
                (match.teamA.score === match.teamB.score &&
                  userPrediction.teamA === userPrediction.teamB);

              if (correctResult) {
                score += 3;
                exactPredictions += 1;
              } else if (correctOutcome) {
                score += 1;
                correctOutcomePredictions += 1;
              } else {
                incorrectPredictions += 1;
              }
            } else {
              incorrectPredictions += 1;
            }
          });
        return {
          ...user,
          score,
          exactPredictions,
          correctOutcomePredictions,
          incorrectPredictions,
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const usersWithScores = calculateScores();

  const getPredictionClass = (match, prediction) => {
    if (match.isFinished) {
      if (
        match.teamA.score === prediction.teamA &&
        match.teamB.score === prediction.teamB
      ) {
        return "correct-result";
      }
      const correctOutcome =
        (match.teamA.score > match.teamB.score &&
          prediction.teamA > prediction.teamB) ||
        (match.teamA.score < match.teamB.score &&
          prediction.teamA < prediction.teamB) ||
        (match.teamA.score === match.teamB.score &&
          prediction.teamA === prediction.teamB);
      if (correctOutcome) {
        return "correct-outcome";
      }
      return "incorrect-result"; // Add a class to darken the incorrect predictions
    }
    return "";
  };

  const groupMatchesByDescription = (matches) => {
    const groupedMatches = {};
    matches.forEach((match) => {
      const { description } = match;
      if (!groupedMatches[description]) {
        groupedMatches[description] = [];
      }
      groupedMatches[description].push(match);
    });
    return groupedMatches;
  };

  const groupedMatches = groupMatchesByDescription(matches);

  return (
    <div className="predictions">
      <h2>Predicciones📋</h2>
      <div className="leaderboard">
        <h3>Tabla de puntuaciones💯</h3>
        {usersWithScores.map((user, index) => (
          <div key={user.id}>
            <div
              onClick={() =>
                setSelectedUser(selectedUser === user.id ? null : user.id)
              }
              className={`user rank-${index + 1}`}
            >
              <div className="position">{index + 1}</div>
              <div className="name">{user.name}</div>
              <div className="score">{user.score}</div>
            </div>
            {selectedUser === user.id && (
              <div className="user-predictions">
                <h4>
                  Predicciones de {user.name}
                  <span className="summary">
                    <span className="circle exact-circle"></span>{" "}
                    {user.exactPredictions}
                    <span className="circle correct-circle"></span>{" "}
                    {user.correctOutcomePredictions}
                    <span className="circle incorrect-circle"></span>{" "}
                    {user.incorrectPredictions}
                  </span>
                </h4>
                <div className="prediction-groups">
                  {Object.entries(groupedMatches).map(([group, matches]) => (
                    <div key={group}>
                      <h3 className="group-title">
                        {group.replace(/Group/gi, "Grupo").toUpperCase()}
                      </h3>
                      {matches.map((match, idx) => {
                        const matchId = `${match.teamA.team.name.toLowerCase()}-${match.teamB.team.name.toLowerCase()}`;
                        const prediction = predictions.find(
                          (p) => p.userId === user.id && p.matchId === matchId
                        );
                        if (prediction) {
                          return (
                            <div
                              key={idx}
                              className={`prediction ${getPredictionClass(
                                match,
                                prediction
                              )}`}
                            >
                              <div className="team">
                                <img
                                  src={getTeamFlag(
                                    match.teamA.team.name.toLowerCase()
                                  )}
                                  alt={match.teamA.team.name}
                                />
                                <span className="team-name">
                                  {match.teamA.team.name
                                    .toUpperCase()
                                    .substring(0, 3)}
                                </span>
                              </div>
                              <span>
                                {prediction.teamA} - {prediction.teamB}
                              </span>
                              <div className="team">
                                <img
                                  src={getTeamFlag(
                                    match.teamB.team.name.toLowerCase()
                                  )}
                                  alt={match.teamB.team.name}
                                />
                                <span className="team-name">
                                  {match.teamB.team.name
                                    .toUpperCase()
                                    .substring(0, 3)}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predictions;
