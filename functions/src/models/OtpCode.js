const { Schema, model } = require('mongoose');

const otpCodeSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL index based on absolute expiresAt time
otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('OtpCode', otpCodeSchema);
