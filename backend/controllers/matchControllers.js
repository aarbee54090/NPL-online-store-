import Match from '../models/matchModel.js';

// @desc   Create a new match
// @route  POST /api/matches
export const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    const saved = await match.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error creating match', error: err.message });
  }
};

// @desc   Get all matches
// @route  GET /api/matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ startTime: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

// @desc   Get match by ID
// @route  GET /api/matches/:id
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching match' });
  }
};

// @desc   Update match (status, score, winner, etc.)
// @route  PUT /api/matches/:id
export const updateMatch = async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating match' });
  }
};

// @desc   Add event to a match timeline
// @route  POST /api/matches/:id/event
export const addEventToMatch = async (req, res) => {
  try {
    const { type, description, timestamp } = req.body;

    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const newEvent = { type, description, timestamp: timestamp || new Date() };

    match.events.push(newEvent);
    await match.save();

    res.json({
      message: "Event added",
      match,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding event to match" });
  }
};
