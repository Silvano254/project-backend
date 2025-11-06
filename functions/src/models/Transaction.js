const { Schema, model } = require('mongoose');

const transactionSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['contribution', 'loan', 'repayment'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = model('Transaction', transactionSchema);
