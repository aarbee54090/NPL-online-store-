import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Live.css';

const LiveMatch = () => {
  const [match, setMatch] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/live-match');
        setMatch(data);
        
        // Show countdown only when match is scheduled and not yet started
        setShowCountdown(data?.status === 'scheduled' && data.isCountdown);
        
        // Hide countdown when match starts
        if (data?.status === 'live') {
          setShowCountdown(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!match) return <div className="loading">Loading cricket data...</div>;

  return (
    <div className="live-match-container">
      <header className="tournament-header">
        <h1>Nepal Premier League</h1>
      </header>

      {/* Show countdown only when needed */}
      {showCountdown && (
        <div className="countdown-container">
          <div className="countdown-timer">
            <h3>Next Match Starts In:</h3>
            <div className="timer">
              {Math.floor(match.countdown / 60)}:{String(match.countdown % 60).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      {/* Live Match Content */}
      {match.status !== 'scheduled' && (
        <>
          <div className="match-header">
            <h2 className="match-title">{match.teamA} vs {match.teamB}</h2>
            <div className="status-bar">
              {match.status === 'live' && <span className="live-badge">LIVE</span>}
              <span className="match-status">{match.status.toUpperCase()}</span>
              {match.winner && <span className="winner-badge">🏆 {match.winner} WON</span>}
            </div>
          </div>

          <div className="teams-grid">
            <TeamCard 
              team={match.teamA} 
              score={match.teamAScore} 
              wickets={match.teamAWickets} 
              balls={match.teamABalls} 
              isBatting={match.currentBattingTeam === 'teamA'}
              players={match.teamAPlayers}
            />
            
            <TeamCard 
              team={match.teamB} 
              score={match.teamBScore} 
              wickets={match.teamBWickets} 
              balls={match.teamBBalls} 
              isBatting={match.currentBattingTeam === 'teamB'}
              players={match.teamBPlayers}
            />
          </div>

          <div className="current-players">
            <h3 className="section-title">Current Players</h3>
            <div className="players-grid">
              <div className="batsmen">
                <h4>Batting:</h4>
                {match.currentBatsmen.map((player, index) => (
                  <div key={index} className="player">
                    {player} 
                    {index === 0 && <span className="active-batsman"> 🏏</span>}
                    {match.teamAPlayers.find(p => p.name === player)?.isCaptain && '(C)'}
                    {match.teamBPlayers.find(p => p.name === player)?.isCaptain && '(C)'}
                  </div>
                ))}
              </div>
              <div className="bowler">
                <h4>Bowling:</h4>
                <div className="player">
                  {match.currentBowler}
                  {match.teamAPlayers.find(p => p.name === match.currentBowler)?.isCaptain && '(C)'}
                  {match.teamBPlayers.find(p => p.name === match.currentBowler)?.isCaptain && '(C)'}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Events Timeline */}
          <div className="events-container">
            <h3 className="section-title">
              <span className="icon">📜</span> Match Commentary
            </h3>
            <div className="events-vertical">
              {match.events.slice().reverse().map((event) => (
                <div 
                  key={event.id} 
                  className={`event ${event.isHighlight ? 'highlight' : ''} ${event.type}`}
                >
                  <div className="event-header">
                    <span className="event-over">Over {event.overBall}</span>
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="event-description">
                    {event.type === 'SIX' && <span className="event-icon">💥</span>}
                    {event.type === 'FOUR' && <span className="event-icon">🔥</span>}
                    {event.type === 'OUT' && <span className="event-icon">☠️</span>}
                    <span className="event-text">
                      <strong>{event.batsman}</strong> {event.description}
                      {event.runs > 0 && <span className="event-runs"> +{event.runs}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TeamCard = ({ team, score, wickets, balls, isBatting, players }) => {
  const captain = players.find(player => player.isCaptain);

  return (
    <div className={`team-card ${isBatting ? 'batting' : ''}`}>
      <div className="team-header">
        <h3 className="team-name">🏏 {team}</h3>
        {isBatting && <span className="batting-badge">Batting</span>}
      </div>
      <div className="team-score">
        {score}/{wickets} ({Math.floor(balls / 6)}.{balls % 6} overs)
      </div>
      <div className="team-captain">
        <span className="label">Captain:</span> {captain?.name}
      </div>
    </div>
  );
};

export default LiveMatch;