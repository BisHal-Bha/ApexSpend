-- Clean up existing data
TRUNCATE users, categories, transactions, budgets CASCADE;

-- Insert Test User (password: password123)
-- bcrypt hash for 'password123' with 10 rounds
INSERT INTO users (id, email, password_hash, full_name) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'demo@monarchtrack.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex Morgan');

-- Insert Demo Categories
INSERT INTO categories (id, user_id, name, type, color, icon, is_default) VALUES
('c1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Housing & Rent', 'expense', '#6366f1', 'Home', true),
('c1000000-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Groceries', 'expense', '#10b981', 'ShoppingCart', true),
('c1000000-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dining Out', 'expense', '#f59e0b', 'Utensils', true),
('c1000000-0000-0000-0000-000000000004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Utilities', 'expense', '#3b82f6', 'Zap', true),
('c1000000-0000-0000-0000-000000000005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Entertainment', 'expense', '#ec4899', 'Film', true),
('c1000000-0000-0000-0000-000000000006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Transportation', 'expense', '#f97316', 'Car', true),
('c1000000-0000-0000-0000-000000000007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Healthcare', 'expense', '#ef4444', 'Heart', true),
('c1000000-0000-0000-0000-000000000008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Shopping', 'expense', '#8b5cf6', 'ShoppingBag', true),
('c1000000-0000-0000-0000-000000000009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Subscriptions', 'expense', '#06b6d4', 'CreditCard', true),
('c1000000-0000-0000-0000-000000000010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Salary', 'income', '#22c55e', 'DollarSign', true),
('c1000000-0000-0000-0000-000000000011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Freelance', 'income', '#14b8a6', 'Briefcase', true);

-- Insert Monthly Budgets for current month
INSERT INTO budgets (user_id, category_id, monthly_limit, month, year) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1800.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 600.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 350.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 250.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000005', 200.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000006', 300.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000009', 100.00, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT);

-- Insert Sample Transactions — Current Month
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
-- Income
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5200.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '1 day'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000011', 850.00, 'income', 'Upwork Client', 'Logo design project', CURRENT_DATE - INTERVAL '5 days'),
-- Expenses
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '2 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 142.50, 'expense', 'Whole Foods Market', 'Weekly groceries', CURRENT_DATE - INTERVAL '3 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 89.30, 'expense', 'Trader Joes', 'Grocery run', CURRENT_DATE - INTERVAL '7 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 68.20, 'expense', 'Chipotle Grill', 'Team dinner', CURRENT_DATE - INTERVAL '4 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 42.00, 'expense', 'Olive Garden', 'Date night', CURRENT_DATE - INTERVAL '6 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 185.00, 'expense', 'City Power & Light', 'Electric bill', CURRENT_DATE - INTERVAL '8 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 65.00, 'expense', 'Verizon', 'Internet bill', CURRENT_DATE - INTERVAL '9 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000005', 15.99, 'expense', 'Netflix', 'Monthly subscription', CURRENT_DATE - INTERVAL '10 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000005', 45.00, 'expense', 'AMC Theaters', 'Movie tickets', CURRENT_DATE - INTERVAL '5 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000006', 55.00, 'expense', 'Shell Gas Station', 'Gas fill up', CURRENT_DATE - INTERVAL '4 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000008', 129.99, 'expense', 'Amazon', 'Wireless headphones', CURRENT_DATE - INTERVAL '6 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000009', 14.99, 'expense', 'Spotify', 'Music subscription', CURRENT_DATE - INTERVAL '12 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000009', 9.99, 'expense', 'iCloud Storage', 'Cloud storage', CURRENT_DATE - INTERVAL '11 days');

-- Previous Month Transactions
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5200.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '35 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '32 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 210.40, 'expense', 'Costco', 'Bulk groceries', CURRENT_DATE - INTERVAL '33 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 95.00, 'expense', 'Sushi Palace', 'Birthday dinner', CURRENT_DATE - INTERVAL '36 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 178.00, 'expense', 'City Power & Light', 'Electric bill', CURRENT_DATE - INTERVAL '38 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000005', 120.00, 'expense', 'Concert Hall', 'Live show tickets', CURRENT_DATE - INTERVAL '40 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000006', 48.00, 'expense', 'Uber', 'Airport ride', CURRENT_DATE - INTERVAL '37 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000008', 249.99, 'expense', 'Best Buy', 'Keyboard', CURRENT_DATE - INTERVAL '34 days');

-- 2 Months Ago
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5200.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '62 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000011', 1200.00, 'income', 'Freelance Client', 'Website redesign', CURRENT_DATE - INTERVAL '65 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '63 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 165.80, 'expense', 'Whole Foods Market', 'Weekly groceries', CURRENT_DATE - INTERVAL '66 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 88.50, 'expense', 'Thai Kitchen', 'Family dinner', CURRENT_DATE - INTERVAL '67 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 195.00, 'expense', 'City Power & Light', 'Electric bill', CURRENT_DATE - INTERVAL '68 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000007', 250.00, 'expense', 'City Medical Center', 'Annual checkup', CURRENT_DATE - INTERVAL '70 days');

-- 3 Months Ago
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5000.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '92 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '93 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 198.20, 'expense', 'Trader Joes', 'Groceries', CURRENT_DATE - INTERVAL '95 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000005', 59.99, 'expense', 'Steam', 'Video game', CURRENT_DATE - INTERVAL '96 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000006', 62.00, 'expense', 'Shell Gas Station', 'Gas fill up', CURRENT_DATE - INTERVAL '97 days');

-- 4 Months Ago
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5000.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '122 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '123 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 220.10, 'expense', 'Whole Foods Market', 'Weekly groceries', CURRENT_DATE - INTERVAL '125 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 115.00, 'expense', 'Italian Bistro', 'Anniversary dinner', CURRENT_DATE - INTERVAL '126 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000008', 349.99, 'expense', 'Apple Store', 'AirPods Pro', CURRENT_DATE - INTERVAL '128 days');

-- 5 Months Ago
INSERT INTO transactions (user_id, category_id, amount, type, merchant_name, note, date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000010', 5000.00, 'income', 'TechCorp Inc.', 'Monthly salary', CURRENT_DATE - INTERVAL '152 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000011', 600.00, 'income', 'Side Project', 'Consulting gig', CURRENT_DATE - INTERVAL '155 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 1750.00, 'expense', 'Avenue Apartments', 'Monthly rent', CURRENT_DATE - INTERVAL '153 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 175.60, 'expense', 'Costco', 'Bulk shopping', CURRENT_DATE - INTERVAL '156 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 210.00, 'expense', 'City Power & Light', 'Electric bill', CURRENT_DATE - INTERVAL '158 days'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000007', 85.00, 'expense', 'CVS Pharmacy', 'Prescriptions', CURRENT_DATE - INTERVAL '160 days');