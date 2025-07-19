import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/history.css'

const MatchHistory = () => {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load match history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('cricketMatchHistory');
    if (savedHistory) {
      setMatchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Fetch current match data
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/live-match');
        const match = response.data;
        
        setCurrentMatch(match);
        
        // If match is completed and not already in history, add it
        if (match.status === 'completed' && !matchHistory.some(m => m.id === match.id)) {
          const newHistory = [match, ...matchHistory].slice(0, 10); // Keep last 10 matches
          setMatchHistory(newHistory);
          localStorage.setItem('cricketMatchHistory', JSON.stringify(newHistory));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatchData();
    const interval = setInterval(fetchMatchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [matchHistory]);

  const clearHistory = () => {
    localStorage.removeItem('cricketMatchHistory');
    setMatchHistory([]);
  };

  if (loading) return <div className="match-container loading">Loading match data...</div>;
  if (error) return <div className="match-container error">Error: {error}</div>;

  return (
    <div className="match-container">
      {/* Current/Upcoming Match Section */}
      <div className="current-match-section">
        <h2>{currentMatch ? (currentMatch.status === 'completed' ? 'Last Match' : 'Current Match') : 'No Current Match'}</h2>
        
        {currentMatch ? (
          currentMatch.isCountdown ? (
            <div className="upcoming-match">
              <h3>{currentMatch.teamA} vs {currentMatch.teamB}</h3>
              <p>Starts in: {Math.floor(currentMatch.countdown / 60)}:{String(currentMatch.countdown % 60).padStart(2, '0')}</p>
              <p className="match-time">Scheduled: {new Date(currentMatch.startTime).toLocaleString()}</p>
            </div>
          ) : (
            <div className={`live-match ${currentMatch.status}`}>
              <div className="match-header">
                {currentMatch.status === 'live' && <span className="live-badge">LIVE</span>}
                <h3>{currentMatch.teamA} vs {currentMatch.teamB}</h3>
                {currentMatch.winner && <span className="winner-badge">🏆 {currentMatch.winner}</span>}
              </div>
              
              <div className="score-summary">
                <div className={`team ${currentMatch.currentBattingTeam === 'teamA' ? 'batting' : ''}`}>
                  <h4>{currentMatch.teamA}</h4>
                  <p>{currentMatch.teamAScore}/{currentMatch.teamAWickets}</p>
                  <p>({Math.floor(currentMatch.teamABalls / 6)}.{currentMatch.teamABalls % 6} overs)</p>
                </div>
                
                <div className="match-status">
                  <p>{currentMatch.status.toUpperCase()}</p>
                </div>
                
                <div className={`team ${currentMatch.currentBattingTeam === 'teamB' ? 'batting' : ''}`}>
                  <h4>{currentMatch.teamB}</h4>
                  <p>{currentMatch.teamBScore}/{currentMatch.teamBWickets}</p>
                  <p>({Math.floor(currentMatch.teamBBalls / 6)}.{currentMatch.teamBBalls % 6} overs)</p>
                </div>
              </div>
              
              {currentMatch.status === 'live' && (
                <div className="current-players">
                  <p><strong>Batting:</strong> {currentMatch.currentBatsmen.join(', ')}</p>
                  <p><strong>Bowling:</strong> {currentMatch.currentBowler}</p>
                </div>
              )}
            </div>
          )
        ) : (
          <p>No matches currently scheduled</p>
        )}
      </div>

      {/* Match History Section */}
      <div className="history-section">
        <div className="history-header">
          <h2>Match History</h2>
          {matchHistory.length > 0 && (
            <button onClick={clearHistory} className="clear-btn">Clear History</button>
          )}
        </div>
        
        {matchHistory.length > 0 ? (
          <div className="history-list">
            {matchHistory.map((match) => (
              <div key={match.id} className="history-item">
                <div className="teams">
                  {match.teamA} vs {match.teamB}
                </div>
                <div className="result">
                  {match.winner ? (
                    <span className="winner">🏆 {match.winner} won</span>
                  ) : (
                    <span className="draw">Match drawn</span>
                  )}
                </div>
                <div className="scores">
                  <div>
                    <strong>{match.teamA}</strong>: {match.teamAScore}/{match.teamAWickets}
                  </div>
                  <div>
                    <strong>{match.teamB}</strong>: {match.teamBScore}/{match.teamBWickets}
                  </div>
                </div>
                <div className="match-date">
                  {new Date(match.startTime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-history">No match history available</p>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;