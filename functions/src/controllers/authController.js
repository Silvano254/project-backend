const { sendOtp, verifyOtp } = require('../services/otpService');
const User = require('../models/User');

async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    
    // Check if user exists (registered)
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found. Please contact your Chama administrator to register.',
        errorCode: 'USER_NOT_REGISTERED'
      });
    }
    
    const result = await sendOtp(phone);
    // Return OTP code for WhatsApp fallback (in production, you might want to only return this in dev mode)
    return res.json({ 
      success: true, 
      otp: result.otp, // Include OTP for WhatsApp fallback
      expiresAt: result.expiresAt,
      isRegistered: true
    });
  } catch (err) {
    next(err);
  }
}

async function verifyOtpController(req, res, next) {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Phone and code required' });
    await verifyOtp(phone, code);

    // Get user (should exist since requestOtp checked)
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        errorCode: 'USER_NOT_REGISTERED'
      });
    }

    // Return user info including biometric settings
    res.json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        fingerprintEnabled: user.fingerprintEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
}

// New registration endpoint - only accessible by admins/chairperson
async function registerUser(req, res, next) {
  try {
    const { name, phone, role } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already registered',
        errorCode: 'USER_ALREADY_EXISTS'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      phone,
      role: role || 'member'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { requestOtp, verifyOtp: verifyOtpController, registerUser };
