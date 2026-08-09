const mongoose = require('mongoose');

const totalBudgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0.01 },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// Unique total budget per user/month/year
totalBudgetSchema.index({ user_id: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('TotalBudget', totalBudgetSchema);
