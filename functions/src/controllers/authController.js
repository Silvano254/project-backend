const { sendOtp, verifyOtp } = require('../services/otpService');
const User = require('../models/User');

async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const result = await sendOtp(phone);
    // Return OTP code for WhatsApp fallback (in production, you might want to only return this in dev mode)
    return res.json({ 
      success: true, 
      otp: result.otp, // Include OTP for WhatsApp fallback
      expiresAt: result.expiresAt 
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

    // Upsert user shell if not exists
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ name: phone, phone });
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

module.exports = { requestOtp, verifyOtp: verifyOtpController };
