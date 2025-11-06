const express = require('express');
const { listShowcase, createShowcase, updateShowcase, deleteShowcase } = require('../controllers/showcaseController');
// const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listShowcase);
// Enable auth when ready
router.post('/', /* requireAuth, */ createShowcase);
router.put('/:id', /* requireAuth, */ updateShowcase);
router.delete('/:id', /* requireAuth, */ deleteShowcase);

module.exports = router;
