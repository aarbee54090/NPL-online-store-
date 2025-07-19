import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// Team Data
const TEAMS = {
  nepalWarriors: {
    name: 'Nepal Warriors',
    players: [
      { id: uuid(), name: 'Paras Khadka', role: 'Batsman', isCaptain: true },
      { id: uuid(), name: 'Gyanendra Malla', role: 'Batsman', isCaptain: false },
      { id: uuid(), name: 'Sandeep Lamichhane', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Sompal Kami', role: 'All-rounder', isCaptain: false },
      { id: uuid(), name: 'Kushal Bhurtel', role: 'Batsman', isCaptain: false },
      { id: uuid(), name: 'Aarif Sheikh', role: 'Wicket-keeper', isCaptain: false },
      { id: uuid(), name: 'Karan KC', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Dipendra Singh Airee', role: 'All-rounder', isCaptain: false },
      { id: uuid(), name: 'Lalit Rajbanshi', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Bhim Sharki', role: 'Batsman', isCaptain: false },
      { id: uuid(), name: 'Pawan Sarraf', role: 'All-rounder', isCaptain: false }
    ]
  },
  kathmanduKings: {
    name: 'Kathmandu Kings',
    players: [
      { id: uuid(), name: 'Rohit Paudel', role: 'Batsman', isCaptain: true },
      { id: uuid(), name: 'Binod Bhandari', role: 'Wicket-keeper', isCaptain: false },
      { id: uuid(), name: 'Abinash Bohara', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Kushal Malla', role: 'All-rounder', isCaptain: false },
      { id: uuid(), name: 'Sagar Dhakal', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Pratis GC', role: 'Batsman', isCaptain: false },
      { id: uuid(), name: 'Shahab Alam', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Basant Regmi', role: 'All-rounder', isCaptain: false },
      { id: uuid(), name: 'Anil Sah', role: 'Wicket-keeper', isCaptain: false },
      { id: uuid(), name: 'Avinash Bohara', role: 'Bowler', isCaptain: false },
      { id: uuid(), name: 'Ishan Pandey', role: 'Batsman', isCaptain: false }
    ]
  }
};

// Match Configuration
const MATCH_CONFIG = {
  maxBalls: 120,
  maxWickets: 10,
  eventInterval: 2000,
  breakTime: 15000,
  countdownDuration: 60000,
  eventTypes: ['SIX', 'FOUR', 'OUT'],
  highlightEvents: ['SIX', 'FOUR', 'OUT'],
  minRuns: 100
};

// Match Schedule
const MATCH_SCHEDULE = [
  {
    teamA: 'nepalWarriors',
    teamB: 'kathmanduKings',
    startTime: Date.now() + 60000
  }
];

// Current match state
let currentMatchIndex = 0;
let match = null;
let countdownInterval = null;
let eventInterval = null;

function initializeMatch(teamAKey, teamBKey, startTime) {
  return {
    id: uuid(),
    teamA: TEAMS[teamAKey].name,
    teamB: TEAMS[teamBKey].name,
    teamAPlayers: TEAMS[teamAKey].players,
    teamBPlayers: TEAMS[teamBKey].players,
    teamAScore: 0,
    teamBScore: 0,
    teamAWickets: 0,
    teamBWickets: 0,
    teamABalls: 0,
    teamBBalls: 0,
    status: 'scheduled',
    currentBattingTeam: 'teamA',
    currentBatsmen: [TEAMS[teamAKey].players[0].name, TEAMS[teamAKey].players[1].name],
    currentBowler: TEAMS[teamBKey].players[2].name,
    winner: null,
    events: [],
    startTime: new Date(startTime),
    countdown: Math.floor((startTime - Date.now()) / 1000),
    isCountdown: true
  };
}

function getRuns(type) {
  const runMap = {
    SIX: 6,
    FOUR: 4,
    OUT: 0
  };
  return runMap[type] || 0;
}

function getOverAndBall(ballCount) {
  const over = Math.floor(ballCount / 6);
  const ball = ballCount % 6 + 1;
  return `${over}.${ball}`;
}

function getRandomPlayer(team) {
  const players = team === 'teamA' ? match.teamAPlayers : match.teamBPlayers;
  return players[Math.floor(Math.random() * players.length)].name;
}

function simulateEvent() {
  const type = MATCH_CONFIG.eventTypes[Math.floor(Math.random() * MATCH_CONFIG.eventTypes.length)];
  const runs = getRuns(type);
  const team = match.currentBattingTeam;
  const isHighlight = MATCH_CONFIG.highlightEvents.includes(type);

  team === 'teamA' ? match.teamABalls++ : match.teamBBalls++;

  const ballCount = team === 'teamA' ? match.teamABalls : match.teamBBalls;
  const overBall = getOverAndBall(ballCount - 1);

  const batsman = match.currentBatsmen[Math.floor(Math.random() * match.currentBatsmen.length)];
  const bowler = match.currentBowler;

  const descriptions = {
    SIX: `${batsman} SMASHES A HUGE SIX!`,
    FOUR: `${batsman} CRACKS A BOUNDARY FOUR!`,
    OUT: `${bowler} KNOCKS OVER ${batsman}!`
  };

  const event = {
    id: uuid(),
    type,
    overBall,
    description: descriptions[type],
    batsman,
    bowler,
    runs,
    isHighlight,
    timestamp: new Date().toISOString()
  };

  match.events.push(event);

  if (team === 'teamA') {
    match.teamAScore += runs;
    if (type === 'OUT') match.teamAWickets++;
  } else {
    match.teamBScore += runs;
    if (type === 'OUT') match.teamBWickets++;
  }

  // Early win condition for Team B
  if (team === 'teamB' && match.teamBScore >= MATCH_CONFIG.minRuns && match.teamBScore > match.teamAScore) {
    endMatch();
    return;
  }

  if (ballCount % 6 === 0) {
    match.currentBowler = getRandomPlayer(team === 'teamA' ? 'teamB' : 'teamA');
  }

  const isInningsOver = team === 'teamA'
    ? match.teamABalls >= MATCH_CONFIG.maxBalls || match.teamAWickets >= MATCH_CONFIG.maxWickets
    : match.teamBBalls >= MATCH_CONFIG.maxBalls || match.teamBWickets >= MATCH_CONFIG.maxWickets;

  if (isInningsOver) {
    clearInterval(eventInterval);

    if (team === 'teamA') {
      match.currentBattingTeam = 'teamB';
      match.currentBatsmen = [match.teamBPlayers[0].name, match.teamBPlayers[1].name];
      match.currentBowler = match.teamAPlayers[2].name;
      setTimeout(() => {
        eventInterval = setInterval(simulateEvent, MATCH_CONFIG.eventInterval);
      }, MATCH_CONFIG.breakTime);
    } else {
      endMatch();
    }
  }
}

function endMatch() {
  clearInterval(eventInterval);
  match.status = 'completed';
  
  // Winner determination with no tie option
  if (match.teamAScore >= MATCH_CONFIG.minRuns && match.teamBScore >= MATCH_CONFIG.minRuns) {
    match.winner = match.teamAScore > match.teamBScore ? match.teamA : match.teamB;
  } else if (match.teamAScore >= MATCH_CONFIG.minRuns) {
    match.winner = match.teamA;
  } else if (match.teamBScore >= MATCH_CONFIG.minRuns) {
    match.winner = match.teamB;
  } else {
    match.winner = 'No winner (minimum runs not achieved)';
  }

  console.log(`🏆 Match Over! Winner: ${match.winner}`);
}

function startCountdown() {
  match.countdown = Math.floor((match.startTime - Date.now()) / 1000);
  match.isCountdown = true;
  
  countdownInterval = setInterval(() => {
    match.countdown = Math.floor((match.startTime - Date.now()) / 1000);
    
    if (match.countdown <= 0) {
      clearInterval(countdownInterval);
      match.status = 'live';
      match.isCountdown = false;
      eventInterval = setInterval(simulateEvent, MATCH_CONFIG.eventInterval);
    }
  }, 1000);
}

function startMatch(index) {
  const { teamA, teamB, startTime } = MATCH_SCHEDULE[index];
  match = initializeMatch(teamA, teamB, startTime);
  startCountdown();
}

// Start the first match
startMatch(currentMatchIndex);

// API Endpoints
app.get('/api/live-match', (req, res) => {
  res.json(match || { error: 'No match currently scheduled' });
});

app.get('/api/schedule', (req, res) => {
  res.json(MATCH_SCHEDULE.map(m => ({
    teamA: TEAMS[m.teamA].name,
    teamB: TEAMS[m.teamB].name,
    startTime: m.startTime,
    status: m.startTime === null ? 'Pending' : 
            m.startTime > Date.now() ? 'Scheduled' : 'Completed'
  })));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏏 Cricket API running on port ${PORT}`);
  console.log(`First match starts in 1 minute...`);
});