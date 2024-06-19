import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from './components/MatchCard';
import Predictions from './components/Predictions';
import BottomMenu from './components/BottomMenu';
import Predictions2 from './components/Predictions2';
import './App.css';

const App = () => {
  const [matches, setMatches] = useState([]);
  const [view, setView] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [error, setError] = useState(null); // Nuevo estado para manejar errores

  const clearLocalStorageAfterInterval = () => {
    const now = new Date().getTime();
    const lastUpdateTime = localStorage.getItem('lastUpdateTime');

    if (lastUpdateTime && now - lastUpdateTime > 5 * 60 * 60 * 1000) { // 5 horas en milisegundos
      localStorage.removeItem('matches');
      localStorage.removeItem('lastUpdateTime');
    }
  };

  useEffect(() => {
    clearLocalStorageAfterInterval();

    const fetchMatches = async () => {
      const cachedMatches = localStorage.getItem('matches');
      const lastUpdateTime = localStorage.getItem('lastUpdateTime');
      const now = new Date().getTime();

      if (cachedMatches && lastUpdateTime && now - lastUpdateTime < 20000) { // 20 segundos en milisegundos
        setMatches(JSON.parse(cachedMatches));
        return;
      }

      try {
        const response = await axios.get('https://euro-20242.p.rapidapi.com/matches', {
          params: {
            stage: 'groupStage'
          },
          headers: {
            'x-rapidapi-key': '6cd7f8fdf5msh4e0ddf18c444eeep1deb90jsnc3d73bae17b2',
            'x-rapidapi-host': 'euro-20242.p.rapidapi.com'
          }
        });

        const filteredMatches = response.data.filter(match => match.teamA.score !== undefined && match.teamB.score !== undefined);
        setMatches(filteredMatches);
        localStorage.setItem('matches', JSON.stringify(filteredMatches));
        localStorage.setItem('lastUpdateTime', now.toString());
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setError('Has alcanzado el límite de peticiones a la API. Inténtalo de nuevo el próximo mes.');
        } else {
          setError('Error fetching matches. Please try again later.');
        }
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const groupMatchesByDescription = (matches) => {
    const groupedMatches = {};
    matches.forEach(match => {
      const { description } = match;
      if (!groupedMatches[description]) {
        groupedMatches[description] = [];
      }
      groupedMatches[description].push(match);
    });
    return groupedMatches;
  };

  const groupedMatches = groupMatchesByDescription(matches);

  const handleMatchClick = (match) => {
    setSelectedMatch(selectedMatch === match ? null : match);
  };

  return (
    <div className="app">
      <h1 className="app-header">Euro 2024 Chavales⚽</h1>
      <div className="content">
        {error && <div className="error-message">{error}</div>} {/* Mostrar mensaje de error */}
        {!error && view === 'matches' && (
          <div className="match-list">
            {Object.entries(groupedMatches).map(([group, matches]) => (
              <div key={group}>
                <h2 className="group-title">{group.replace(/Group/gi, 'Grupo').toUpperCase()}</h2>
                {matches.map(match => (
                  <div key={match._id}>
                    <MatchCard match={match} onClick={handleMatchClick} />
                    {selectedMatch === match && (
                      <div className="predictions-dropdown">
                        <Predictions2 matches={[match]} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {!error && view === 'predictions' && <Predictions matches={matches} />}
      </div>
      <BottomMenu view={view} setView={setView} />
    </div>
  );
};

export default App;
