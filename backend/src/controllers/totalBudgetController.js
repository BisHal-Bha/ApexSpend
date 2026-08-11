const mongoose = require('mongoose');
const TotalBudget = require('../models/TotalBudget');

exports.getTotalBudget = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const totalBudget = await TotalBudget.findOne({ user_id: userId, month, year }).lean();
    
    res.json(totalBudget || null);
  } catch (error) {
    next(error);
  }
};

exports.setTotalBudget = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { amount, month, year } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const budgetMonth = parseInt(month) || new Date().getMonth() + 1;
    const budgetYear = parseInt(year) || new Date().getFullYear();

    const totalBudget = await TotalBudget.findOneAndUpdate(
      { user_id: userId, month: budgetMonth, year: budgetYear },
      { $set: { amount: parseFloat(amount) } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.json(totalBudget);
  } catch (error) {
    console.error('TOTAL BUDGET ERROR:', error);
    next(error);
  }
};
