import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Upcoming.css'

const MatchSchedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schedule');
        const currentTime = Date.now();
        
        // Process matches: filter out completed and add time status
        const processedMatches = response.data
          .filter(match => match.status !== 'completed')
          .map(match => {
            const matchTime = new Date(match.startTime);
            const timeUntilMatch = matchTime - currentTime;
            
            return {
              ...match,
              formattedDate: matchTime.toLocaleDateString(),
              formattedTime: matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              startsIn: timeUntilMatch > 0 ? Math.floor(timeUntilMatch / (60 * 1000)) : 0
            };
          })
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        setMatches(processedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading matches...</div>;
  }

  if (matches.length === 0) {
    return <div className="no-matches">No upcoming matches scheduled</div>;
  }

  return (
    <div className="match-schedule-container">
      <h2 className="schedule-header">Match Schedule</h2>
      
      <div className="matches-list">
        {matches.map((match) => (
          <div key={match.id} className={`match-card ${match.status === 'live' ? 'live' : ''}`}>
            <div className="match-teams">
              <div className="team-names">
                {match.teamA} vs {match.teamB}
              </div>
              
              {match.status === 'live' ? (
                <div className="live-status">
                  <span className="live-badge">LIVE</span>
                </div>
              ) : (
                <div className="time-info">
                  <div className="match-date">{match.formattedDate}</div>
                  <div className="match-time">{match.formattedTime}</div>
                  {match.startsIn > 0 && (
                    <div className="starts-in">Starts in ~{match.startsIn} min</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;