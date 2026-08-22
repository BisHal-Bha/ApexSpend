const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const TotalBudget = require('../models/TotalBudget');
const mongoose = require('mongoose');

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { month, year } = req.query;

    const currentMonth = parseInt(month) || new Date().getMonth() + 1;
    const currentYear = parseInt(year) || new Date().getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) { prevMonth = 12; prevYear = currentYear - 1; }
    const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1);
    const endOfPrevMonth = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999);

    // 1. Cash flow for current month
    const cashFlowAgg = await Transaction.aggregate([
      { $match: { user_id: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: null,
          total_spending: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        },
      },
    ]);
    const cashFlow = cashFlowAgg[0] || { total_spending: 0, total_income: 0 };

    // 2. Previous month
    const prevCashFlowAgg = await Transaction.aggregate([
      { $match: { user_id: userId, date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } } },
      {
        $group: {
          _id: null,
          total_spending: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        },
      },
    ]);
    const prevCashFlow = prevCashFlowAgg[0] || { total_spending: 0, total_income: 0 };

    // 3. Total budget for month (from TotalBudget collection)
    const totalBudgetDoc = await TotalBudget.findOne({ user_id: userId, month: currentMonth, year: currentYear });
    const totalBudget = totalBudgetDoc ? totalBudgetDoc.amount : 0;

    // 4. Category breakdown (donut chart)
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user_id: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
          category_id: { $ne: null },
        },
      },
      { $group: { _id: '$category_id', total_amount: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          category_name: '$category.name',
          color: '$category.color',
          icon: '$category.icon',
          total_amount: 1,
        },
      },
      { $sort: { total_amount: -1 } },
    ]);

    // 5. Monthly trend (past 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const trendAgg = await Transaction.aggregate([
      { $match: { user_id: userId, date: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          spending: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year_num: '$_id.year',
          month_num: '$_id.month',
          month_label: {
            $let: {
              vars: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              },
              in: { $arrayElemAt: ['$$months', { $subtract: ['$_id.month', 1] }] },
            },
          },
          spending: 1,
          income: 1,
        },
      },
    ]);

    // 6. Recent transactions (last 5)
    const recentTransactions = await Transaction.find({ user_id: userId })
      .populate('category_id', 'name color icon')
      .sort({ date: -1, created_at: -1 })
      .limit(5)
      .lean();

    const formattedRecent = recentTransactions.map(tx => ({
      ...tx,
      id: tx._id,
      category_name: tx.category_id?.name || null,
      category_color: tx.category_id?.color || null,
      category_icon: tx.category_id?.icon || null,
      category_id: tx.category_id?._id || null,
    }));

    const totalSpending = cashFlow.total_spending;
    const totalIncome = cashFlow.total_income;
    const prevSpending = prevCashFlow.total_spending;
    const prevIncome = prevCashFlow.total_income;

    res.json({
      summary: {
        totalSpending,
        totalIncome,
        totalBudget,
        remainingBudget: totalBudget - totalSpending,
        netCashFlow: totalIncome - totalSpending,
        prevMonthSpending: prevSpending,
        prevMonthIncome: prevIncome,
        spendingChange: prevSpending > 0 ? ((totalSpending - prevSpending) / prevSpending * 100).toFixed(1) : 0,
        incomeChange: prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome * 100).toFixed(1) : 0,
      },
      categoryBreakdown,
      monthlyTrend: trendAgg,
      recentTransactions: formattedRecent,
    });
  } catch (error) {
    next(error);
  }
};