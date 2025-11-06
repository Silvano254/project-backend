const Transaction = require('../models/Transaction');

async function listTransactions(req, res, next) {
  try {
    const { memberId, type } = req.query;
    const q = {};
    if (memberId) q.memberId = memberId;
    if (type) q.type = type;
    const items = await Transaction.find(q).sort({ date: -1 }).lean();
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { memberId, type, amount, date } = req.body;
    if (!memberId || !type || amount == null) {
      return res.status(400).json({ message: 'memberId, type, amount required' });
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

module.exports = { listTransactions, createTransaction };
