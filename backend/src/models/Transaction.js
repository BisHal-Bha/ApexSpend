const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  merchant_name: { type: String, required: true, trim: true, maxlength: 100 },
  note: { type: String, default: null, trim: true },
  date: { type: Date, required: true, default: Date.now },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

transactionSchema.index({ user_id: 1, date: -1 });
transactionSchema.index({ user_id: 1, category_id: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
