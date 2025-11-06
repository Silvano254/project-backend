const Transaction = require('../models/Transaction');
const Meeting = require('../models/Meeting');

async function recordContribution(req, res, next) {
  try {
    const { memberId, amount, type = 'contribution', date } = req.body;
    if (!memberId || amount == null) {
      return res.status(400).json({ message: 'memberId and amount required' });
    }
    const saved = await Transaction.create({
      memberId,
      type,
      amount,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user?.id,
    });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

async function recordAttendance(req, res, next) {
  try {
    const { meetingId, memberId } = req.body;
    if (!meetingId || !memberId) {
      return res.status(400).json({ message: 'meetingId and memberId required' });
    }
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $addToSet: { attendees: memberId } },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ data: meeting });
  } catch (err) {
    next(err);
  }
}

module.exports = { recordContribution, recordAttendance };
