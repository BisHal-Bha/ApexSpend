const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  color: { type: String, default: '#64748b' },
  icon: { type: String, default: 'Tag' },
  is_default: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// Unique category name per user
categorySchema.index({ user_id: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('Category', categorySchema);
