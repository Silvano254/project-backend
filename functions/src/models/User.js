const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['chairperson','vice_chair','secretary','treasurer','auditor','welfare','committee','member'], default: 'member' },
    fingerprintEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
