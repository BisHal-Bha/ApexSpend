const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getTransactions = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const {
      search,
      categoryId,
      type,
      sortBy = 'date',
      order = 'DESC',
      limit = 50,
      page = 1,
      startDate,
      endDate,
    } = req.query;

    const filter = { user_id: userId };

    if (search) {
      filter.$or = [
        { merchant_name: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId) {
      filter.category_id = categoryId;
    }

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const validSortColumns = { date: 'date', amount: 'amount', merchant_name: 'merchant_name', created_at: 'created_at' };
    const sortField = validSortColumns[sortBy] || 'date';
    const sortOrder = order.toUpperCase() === 'ASC' ? 1 : -1;

    const total = await Transaction.countDocuments(filter);
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const transactions = await Transaction.find(filter)
      .populate('category_id', 'name color icon')
      .sort({ [sortField]: sortOrder })
      .skip(offset)
      .limit(parsedLimit)
      .lean();

    // Flatten category info to match original response shape
    const formatted = transactions.map(tx => ({
      ...tx,
      id: tx._id,
      category_name: tx.category_id?.name || null,
      category_color: tx.category_id?.color || null,
      category_icon: tx.category_id?.icon || null,
      category_id: tx.category_id?._id || null,
    }));

    res.json({
      transactions: formatted,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { category_id, amount, type, merchant_name, note, date } = req.body;

    if (!amount || !type || !merchant_name) {
      return res.status(400).json({ message: 'Amount, type, and merchant name are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const tx = await Transaction.create({
      user_id: userId,
      category_id: category_id || null,
      amount: parseFloat(amount),
      type,
      merchant_name: merchant_name.trim(),
      note: note || null,
      date: date ? new Date(date) : new Date(),
    });

    const populated = await Transaction.findById(tx._id)
      .populate('category_id', 'name color icon')
      .lean();

    res.status(201).json({
      ...populated,
      id: populated._id,
      category_name: populated.category_id?.name || null,
      category_color: populated.category_id?.color || null,
      category_icon: populated.category_id?.icon || null,
      category_id: populated.category_id?._id || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;
    const { category_id, amount, type, merchant_name, note, date } = req.body;

    const existing = await Transaction.findOne({ _id: id, user_id: userId });
    if (!existing) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updates = {};
    if (category_id !== undefined) updates.category_id = category_id || null;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (type !== undefined) updates.type = type;
    if (merchant_name !== undefined) updates.merchant_name = merchant_name.trim();
    if (note !== undefined) updates.note = note || null;
    if (date !== undefined) updates.date = new Date(date);

    await Transaction.findByIdAndUpdate(id, updates);

    const result = await Transaction.findById(id)
      .populate('category_id', 'name color icon')
      .lean();

    res.json({
      ...result,
      id: result._id,
      category_name: result.category_id?.name || null,
      category_color: result.category_id?.color || null,
      category_icon: result.category_id?.icon || null,
      category_id: result.category_id?._id || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;

    const result = await Transaction.findOneAndDelete({ _id: id, user_id: userId });
    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully', id: result._id });
  } catch (error) {
    next(error);
  }
};