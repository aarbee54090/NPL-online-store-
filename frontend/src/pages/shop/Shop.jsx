// Shop.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Shop.css';

const Shop = () => {
  const [match, setMatch] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/live-match');
        setMatch(data);

        const recommended = getAIRecommendations(data);
        setRecommendations(recommended);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchMatch();
  }, []);

  const getAIRecommendations = (match) => {
    if (!match) return [];

    if (match.status === 'scheduled') {
      return [
        { team: match.teamA, reason: 'Match Coming Up' },
        { team: match.teamB, reason: 'Match Coming Up' },
      ];
    }

    if (match.status === 'completed') {
      const rec = [{ team: match.winner, reason: 'Winner Team' }];
      if (match.playerOfMatch) {
        rec.push({ team: match.playerOfMatch.team, reason: `Player of the Match: ${match.playerOfMatch.name}` });
      }
      return rec;
    }

    return [
      { team: match.teamA, reason: 'Currently Playing' },
      { team: match.teamB, reason: 'Currently Playing' },
    ];
  };

  return (
    <div className="shop-container">
      <h2 className="shop-title">🏏 NPL Official Jerseys</h2>
      {recommendations.length > 0 ? (
        <div className="jersey-grid">
          {recommendations.map((rec, index) => (
            <div key={index} className="jersey-card">
              <img src={`/jerseys/${rec.team.toLowerCase().replace(/\s/g, '-')}.png`} alt={`${rec.team} Jersey`} />
              <h4>{rec.team} Jersey</h4>
              <p className="reason">{rec.reason}</p>
              <button className="buy-btn">Buy Now</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommendations available at the moment.</p>
      )}
    </div>
  );
};

export default Shop;
