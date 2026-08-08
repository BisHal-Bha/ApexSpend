const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  monthly_limit: { type: Number, required: true, min: 0.01 },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// Unique budget per user/category/month/year
budgetSchema.index({ user_id: 1, category_id: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
