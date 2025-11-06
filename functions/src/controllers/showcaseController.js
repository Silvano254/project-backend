const Showcase = require('../models/Showcase');

async function listShowcase(req, res, next) {
  try {
    const { type } = req.query;
    const q = {};
    if (type) q.type = type;
    const items = await Showcase.find(q).sort({ createdAt: -1 }).lean();
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function createShowcase(req, res, next) {
  try {
    const { type, title, description, imageUrl } = req.body;
    const createdBy = req.user?.id; // optional if auth is added later
    const saved = await Showcase.create({ type, title, description, imageUrl, createdBy });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

async function updateShowcase(req, res, next) {
  try {
    const { id } = req.params;
    const update = req.body;
    const saved = await Showcase.findByIdAndUpdate(id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Not found' });
    res.json({ data: saved });
  } catch (err) {
    next(err);
  }
}

async function deleteShowcase(req, res, next) {
  try {
    const { id } = req.params;
    const result = await Showcase.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listShowcase, createShowcase, updateShowcase, deleteShowcase };
