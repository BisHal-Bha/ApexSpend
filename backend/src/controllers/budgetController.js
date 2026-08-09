const Budget = require('../models/Budget');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Get all expense categories for the user
    const categories = await Category.find({ user_id: userId, type: 'expense' }).sort({ name: 1 }).lean();

    // Get budgets for this month/year
    const budgets = await Budget.find({ user_id: userId, month, year }).lean();
    const budgetMap = {};
    budgets.forEach(b => { budgetMap[b.category_id.toString()] = b; });

    // Get spending by category for this month/year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const spendingAgg = await Transaction.aggregate([
      {
        $match: {
          user_id: { $in: [userId, require('mongoose').Types.ObjectId.createFromHexString(userId)] },
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category_id',
          total_spent: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap = {};
    spendingAgg.forEach(s => { if (s._id) spendingMap[s._id.toString()] = s.total_spent; });

    const result = categories.map(cat => {
      const catId = cat._id.toString();
      const budget = budgetMap[catId];
      return {
        id: budget?._id || null,
        monthly_limit: budget?.monthly_limit || null,
        month: budget?.month || month,
        year: budget?.year || year,
        category_id: cat._id,
        category_name: cat.name,
        category_color: cat.color,
        category_icon: cat.icon,
        total_spent: spendingMap[catId] || 0,
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.setBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category_id, monthly_limit, month, year } = req.body;

    if (!category_id || !monthly_limit) {
      return res.status(400).json({ message: 'Category and monthly limit are required' });
    }

    if (parseFloat(monthly_limit) <= 0) {
      return res.status(400).json({ message: 'Monthly limit must be greater than 0' });
    }

    const budgetMonth = parseInt(month) || new Date().getMonth() + 1;
    const budgetYear = parseInt(year) || new Date().getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { user_id: userId, category_id, month: budgetMonth, year: budgetYear },
      { $set: { monthly_limit: parseFloat(monthly_limit) } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { monthly_limit } = req.body;

    if (!monthly_limit || parseFloat(monthly_limit) <= 0) {
      return res.status(400).json({ message: 'Monthly limit must be greater than 0' });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user_id: userId },
      { monthly_limit: parseFloat(monthly_limit) },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, user_id: userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully', id: budget._id });
  } catch (error) {
    next(error);
  }
};