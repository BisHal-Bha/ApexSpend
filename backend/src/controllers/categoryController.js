const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { type } = req.query;

    const filter = { user_id: userId };
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { name, type, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
    }

    // Check for duplicate name (case-insensitive)
    const existing = await Category.findOne({
      user_id: userId,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    const category = await Category.create({
      user_id: userId,
      name: name.trim(),
      type: type || 'expense',
      color: color || '#64748b',
      icon: icon || 'Tag',
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;
    const { name, type, color, icon } = req.body;

    const existing = await Category.findOne({ _id: id, user_id: userId });
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check for duplicate name (excluding current)
    if (name) {
      const duplicate = await Category.findOne({
        user_id: userId,
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({ message: 'A category with this name already exists' });
      }
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (type) updates.type = type;
    if (color) updates.color = color;
    if (icon) updates.icon = icon;

    const updated = await Category.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;

    const existing = await Category.findOne({ _id: id, user_id: userId });
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Nullify category_id on transactions that reference this category
    const Transaction = require('../models/Transaction');
    await Transaction.updateMany({ category_id: id }, { $set: { category_id: null } });

    // Delete associated budgets
    const Budget = require('../models/Budget');
    await Budget.deleteMany({ category_id: id, user_id: userId });

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully', id });
  } catch (error) {
    next(error);
  }
};