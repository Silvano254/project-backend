const { Schema, model } = require('mongoose');

const meetingSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = model('Meeting', meetingSchema);
