const Meeting = require('../models/Meeting');

async function listMeetings(req, res, next) {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to) q.date.$lte = new Date(to);
    }
    const items = await Meeting.find(q).sort({ date: -1 }).lean();
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function createMeeting(req, res, next) {
  try {
    const { title, date } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'title and date required' });
    const saved = await Meeting.create({ title, date: new Date(date), attendees: [] });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMeetings, createMeeting };
