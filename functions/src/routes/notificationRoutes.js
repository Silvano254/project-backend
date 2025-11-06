const express = require('express');
const { listNotifications, createNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', listNotifications);
router.post('/', createNotification);

module.exports = router;
