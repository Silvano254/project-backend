const express = require('express');
const { requestOtp, verifyOtp, registerUser } = require('../controllers/authController');
const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);

module.exports = router;
