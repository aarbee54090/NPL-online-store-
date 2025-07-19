import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  time: Number, // seconds from match start
  type: String, // e.g. "SIX", "FOUR", "WICKET", "START", etc.
  description: String, // "Player X hit a SIX!"
});

const matchSchema = new mongoose.Schema({
  teamA: {
    name: String,
    logo: String, // optional
  },
  teamB: {
    name: String,
    logo: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming',
  },
  startTime: Date,
  winner: String, // name of team who won
  manOfTheMatch: String,

  score: {
    teamA: String, // "132/4 (15.2)"
    teamB: String,
  },

  events: [
    {
      type: {
        type:String,
        required: true,
      },
    description:{
      type: String,
    },
    timestamps: {
      type: Date,
      default:Date.now,
    },
    }
  ], // timeline of match
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);
export default Match;
