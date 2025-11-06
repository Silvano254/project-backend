const express = require('express');
const { recordContribution, recordAttendance } = require('../controllers/proxyController');
const router = express.Router();

router.post('/contribution', recordContribution);
router.post('/attendance', recordAttendance);

module.exports = router;
