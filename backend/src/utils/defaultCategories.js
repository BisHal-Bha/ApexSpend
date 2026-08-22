const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'Home' },
  { name: 'Groceries', type: 'expense', color: '#10b981', icon: 'ShoppingCart' },
  { name: 'Dining Out', type: 'expense', color: '#f59e0b', icon: 'Utensils' },
  { name: 'Utilities', type: 'expense', color: '#3b82f6', icon: 'Zap' },
  { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'Film' },
  { name: 'Transportation', type: 'expense', color: '#f97316', icon: 'Car' },
  { name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'Heart' },
  { name: 'Shopping', type: 'expense', color: '#8b5cf6', icon: 'ShoppingBag' },
  { name: 'Subscriptions', type: 'expense', color: '#06b6d4', icon: 'CreditCard' },
  { name: 'Education', type: 'expense', color: '#facc15', icon: 'GraduationCap' },
  { name: 'Salary', type: 'income', color: '#22c55e', icon: 'DollarSign' },
  { name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'Briefcase' },
];

const formatCategory = (cat) => ({
  ...cat,
  id: cat._id.toString(),
});

const seedDefaultCategories = async (userId) => {
  const categoryDocs = DEFAULT_CATEGORIES.map((cat) => ({
    user_id: userId,
    ...cat,
    is_default: true,
  }));
  await Category.insertMany(categoryDocs);
};

const getCategoriesForUser = async (userId, type) => {
  const count = await Category.countDocuments({ user_id: userId });
  if (count === 0) {
    await seedDefaultCategories(userId);
  }

  const filter = { user_id: userId };
  if (type && ['income', 'expense'].includes(type)) {
    filter.type = type;
  }

  const categories = await Category.find(filter).sort({ type: 1, name: 1 }).lean();
  return categories.map(formatCategory);
};

module.exports = {
  DEFAULT_CATEGORIES,
  formatCategory,
  seedDefaultCategories,
  getCategoriesForUser,
};
