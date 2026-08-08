const User = require('../models/User');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  { name: 'Salary', type: 'income', color: '#22c55e', icon: 'DollarSign' },
  { name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'Briefcase' },
];

exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email: email.toLowerCase(), password_hash, full_name });

    // Seed default categories
    const categoryDocs = DEFAULT_CATEGORIES.map(cat => ({
      user_id: newUser._id,
      ...cat,
      is_default: true,
    }));
    await Category.insertMany(categoryDocs);

    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: { id: newUser._id, email: newUser.email, full_name: newUser.full_name, created_at: newUser.created_at },
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: user._id, email: user.email, full_name: user.full_name, created_at: user.created_at },
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, email: user.email, full_name: user.full_name, created_at: user.created_at });
  } catch (error) {
    next(error);
  }
};