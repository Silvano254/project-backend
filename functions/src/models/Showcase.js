const { Schema, model } = require('mongoose');

const showcaseSchema = new Schema(
  {
    type: { type: String, enum: ['project', 'business'], required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = model('Showcase', showcaseSchema);
