const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Transaction = require('./src/models/Transaction');
const Budget = require('./src/models/Budget');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/monarch_tracker';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Clean up existing data
    console.log('Cleaning up existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // Create Test User
    console.log('Creating demo user...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);
    
    const demoUser = await User.create({
      email: 'demo@monarchtrack.com',
      password_hash,
      full_name: 'Alex Morgan'
    });

    // Create Categories
    console.log('Creating categories...');
    const categoryData = [
      { user_id: demoUser._id, name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'Home', is_default: true },
      { user_id: demoUser._id, name: 'Groceries', type: 'expense', color: '#10b981', icon: 'ShoppingCart', is_default: true },
      { user_id: demoUser._id, name: 'Dining Out', type: 'expense', color: '#f59e0b', icon: 'Utensils', is_default: true },
      { user_id: demoUser._id, name: 'Utilities', type: 'expense', color: '#3b82f6', icon: 'Zap', is_default: true },
      { user_id: demoUser._id, name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'Film', is_default: true },
      { user_id: demoUser._id, name: 'Transportation', type: 'expense', color: '#f97316', icon: 'Car', is_default: true },
      { user_id: demoUser._id, name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'Heart', is_default: true },
      { user_id: demoUser._id, name: 'Shopping', type: 'expense', color: '#8b5cf6', icon: 'ShoppingBag', is_default: true },
      { user_id: demoUser._id, name: 'Subscriptions', type: 'expense', color: '#06b6d4', icon: 'CreditCard', is_default: true },
      { user_id: demoUser._id, name: 'Education', type: 'expense', color: '#facc15', icon: 'GraduationCap', is_default: true },
      { user_id: demoUser._id, name: 'Salary', type: 'income', color: '#22c55e', icon: 'DollarSign', is_default: true },
      { user_id: demoUser._id, name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'Briefcase', is_default: true }
    ];

    const categories = await Category.insertMany(categoryData);
    
    // Helper to find category by name
    const getCatId = (name) => categories.find(c => c.name === name)._id;

    // Create Budgets for current month
    console.log('Creating budgets...');
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const budgetData = [
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), monthly_limit: 1800.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), monthly_limit: 600.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), monthly_limit: 350.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), monthly_limit: 250.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Entertainment'), monthly_limit: 200.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Transportation'), monthly_limit: 300.00, month: currentMonth, year: currentYear },
      { user_id: demoUser._id, category_id: getCatId('Subscriptions'), monthly_limit: 100.00, month: currentMonth, year: currentYear }
    ];

    await Budget.insertMany(budgetData);

    // Create Transactions
    console.log('Creating transactions...');
    
    const getDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date;
    };

    const transactionData = [
      // Current Month
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5200.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(1) },
      { user_id: demoUser._id, category_id: getCatId('Freelance'), amount: 850.00, type: 'income', merchant_name: 'Upwork Client', note: 'Logo design project', date: getDate(5) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(2) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 142.50, type: 'expense', merchant_name: 'Whole Foods Market', note: 'Weekly groceries', date: getDate(3) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 89.30, type: 'expense', merchant_name: 'Trader Joes', note: 'Grocery run', date: getDate(7) },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), amount: 68.20, type: 'expense', merchant_name: 'Chipotle Grill', note: 'Team dinner', date: getDate(4) },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), amount: 42.00, type: 'expense', merchant_name: 'Olive Garden', note: 'Date night', date: getDate(6) },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), amount: 185.00, type: 'expense', merchant_name: 'City Power & Light', note: 'Electric bill', date: getDate(8) },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), amount: 65.00, type: 'expense', merchant_name: 'Verizon', note: 'Internet bill', date: getDate(9) },
      { user_id: demoUser._id, category_id: getCatId('Entertainment'), amount: 15.99, type: 'expense', merchant_name: 'Netflix', note: 'Monthly subscription', date: getDate(10) },
      { user_id: demoUser._id, category_id: getCatId('Entertainment'), amount: 45.00, type: 'expense', merchant_name: 'AMC Theaters', note: 'Movie tickets', date: getDate(5) },
      { user_id: demoUser._id, category_id: getCatId('Transportation'), amount: 55.00, type: 'expense', merchant_name: 'Shell Gas Station', note: 'Gas fill up', date: getDate(4) },
      { user_id: demoUser._id, category_id: getCatId('Shopping'), amount: 129.99, type: 'expense', merchant_name: 'Amazon', note: 'Wireless headphones', date: getDate(6) },
      { user_id: demoUser._id, category_id: getCatId('Subscriptions'), amount: 14.99, type: 'expense', merchant_name: 'Spotify', note: 'Music subscription', date: getDate(12) },
      { user_id: demoUser._id, category_id: getCatId('Subscriptions'), amount: 9.99, type: 'expense', merchant_name: 'iCloud Storage', note: 'Cloud storage', date: getDate(11) },
      
      // Previous Month
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5200.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(35) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(32) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 210.40, type: 'expense', merchant_name: 'Costco', note: 'Bulk groceries', date: getDate(33) },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), amount: 95.00, type: 'expense', merchant_name: 'Sushi Palace', note: 'Birthday dinner', date: getDate(36) },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), amount: 178.00, type: 'expense', merchant_name: 'City Power & Light', note: 'Electric bill', date: getDate(38) },
      { user_id: demoUser._id, category_id: getCatId('Entertainment'), amount: 120.00, type: 'expense', merchant_name: 'Concert Hall', note: 'Live show tickets', date: getDate(40) },
      { user_id: demoUser._id, category_id: getCatId('Transportation'), amount: 48.00, type: 'expense', merchant_name: 'Uber', note: 'Airport ride', date: getDate(37) },
      { user_id: demoUser._id, category_id: getCatId('Shopping'), amount: 249.99, type: 'expense', merchant_name: 'Best Buy', note: 'Keyboard', date: getDate(34) },

      // 2 Months Ago
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5200.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(62) },
      { user_id: demoUser._id, category_id: getCatId('Freelance'), amount: 1200.00, type: 'income', merchant_name: 'Freelance Client', note: 'Website redesign', date: getDate(65) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(63) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 165.80, type: 'expense', merchant_name: 'Whole Foods Market', note: 'Weekly groceries', date: getDate(66) },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), amount: 88.50, type: 'expense', merchant_name: 'Thai Kitchen', note: 'Family dinner', date: getDate(67) },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), amount: 195.00, type: 'expense', merchant_name: 'City Power & Light', note: 'Electric bill', date: getDate(68) },
      { user_id: demoUser._id, category_id: getCatId('Healthcare'), amount: 250.00, type: 'expense', merchant_name: 'City Medical Center', note: 'Annual checkup', date: getDate(70) },

      // 3 Months Ago
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5000.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(92) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(93) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 198.20, type: 'expense', merchant_name: 'Trader Joes', note: 'Groceries', date: getDate(95) },
      { user_id: demoUser._id, category_id: getCatId('Entertainment'), amount: 59.99, type: 'expense', merchant_name: 'Steam', note: 'Video game', date: getDate(96) },
      { user_id: demoUser._id, category_id: getCatId('Transportation'), amount: 62.00, type: 'expense', merchant_name: 'Shell Gas Station', note: 'Gas fill up', date: getDate(97) },

      // 4 Months Ago
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5000.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(122) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(123) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 220.10, type: 'expense', merchant_name: 'Whole Foods Market', note: 'Weekly groceries', date: getDate(125) },
      { user_id: demoUser._id, category_id: getCatId('Dining Out'), amount: 115.00, type: 'expense', merchant_name: 'Italian Bistro', note: 'Anniversary dinner', date: getDate(126) },
      { user_id: demoUser._id, category_id: getCatId('Shopping'), amount: 349.99, type: 'expense', merchant_name: 'Apple Store', note: 'AirPods Pro', date: getDate(128) },

      // 5 Months Ago
      { user_id: demoUser._id, category_id: getCatId('Salary'), amount: 5000.00, type: 'income', merchant_name: 'TechCorp Inc.', note: 'Monthly salary', date: getDate(152) },
      { user_id: demoUser._id, category_id: getCatId('Freelance'), amount: 600.00, type: 'income', merchant_name: 'Side Project', note: 'Consulting gig', date: getDate(155) },
      { user_id: demoUser._id, category_id: getCatId('Housing & Rent'), amount: 1750.00, type: 'expense', merchant_name: 'Avenue Apartments', note: 'Monthly rent', date: getDate(153) },
      { user_id: demoUser._id, category_id: getCatId('Groceries'), amount: 175.60, type: 'expense', merchant_name: 'Costco', note: 'Bulk shopping', date: getDate(156) },
      { user_id: demoUser._id, category_id: getCatId('Utilities'), amount: 210.00, type: 'expense', merchant_name: 'City Power & Light', note: 'Electric bill', date: getDate(158) },
      { user_id: demoUser._id, category_id: getCatId('Healthcare'), amount: 85.00, type: 'expense', merchant_name: 'CVS Pharmacy', note: 'Prescriptions', date: getDate(160) }
    ];

    await Transaction.insertMany(transactionData);

    console.log(' Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
