const User = require('../models/User');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { seedDefaultCategories } = require('../utils/defaultCategories');

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
    await seedDefaultCategories(newUser._id);

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