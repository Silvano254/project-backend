const express = require('express');
const { listMeetings, createMeeting } = require('../controllers/meetingController');
const router = express.Router();

router.get('/', listMeetings);
router.post('/', createMeeting);

module.exports = router;
