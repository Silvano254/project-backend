const express = require('express');
const { 
  listUsers, 
  createUser, 
  updateBiometricSettings, 
  getBiometricSettings,
  getUserProfile 
} = require('../controllers/userController');
const router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/profile', getUserProfile);
router.get('/biometric', getBiometricSettings);
router.put('/biometric', updateBiometricSettings);

module.exports = router;
