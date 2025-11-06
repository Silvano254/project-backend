const OtpCode = require('../models/OtpCode');
const { generate } = require('../utils/otpGenerator');
const smsService = require('./smsService');

async function sendOtp(phone) {
  const code = generate(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Invalidate previous unused codes
  await OtpCode.updateMany({ phone, used: false }, { $set: { used: true } });
  await OtpCode.create({ phone, code, expiresAt });

  // Try to send SMS; do not fail the OTP issuance if SMS integration isn't ready yet.
  try {
    await smsService.sendSms({ to: phone, message: `Your Jirani Mwema OTP is ${code}` });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('SMS send failed (continuing):', err.message);
  }

  // Return OTP code for WhatsApp fallback
  return { phone, otp: code, expiresAt };
}

async function verifyOtp(phone, code) {
  const record = await OtpCode.findOne({ phone, code, used: false });
  if (!record) throw new Error('Invalid code');
  if (record.expiresAt < new Date()) throw new Error('Code expired');
  record.used = true;
  await record.save();
  return { phone };
}

module.exports = { sendOtp, verifyOtp };
