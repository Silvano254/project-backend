const Notification = require('../models/Notification');

async function listNotifications(req, res, next) {
  try {
    const { userId } = req.query;
    const q = {};
    if (userId) q.userId = userId;
    const items = await Notification.find(q).sort({ createdAt: -1 }).lean();
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function createNotification(req, res, next) {
  try {
    const { userId, title, message } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'title and message required' });
    const saved = await Notification.create({ userId, title, message });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

module.exports = { listNotifications, createNotification };
