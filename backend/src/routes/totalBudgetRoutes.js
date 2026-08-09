const express = require('express');
const router = express.Router();
const totalBudgetController = require('../controllers/totalBudgetController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', totalBudgetController.getTotalBudget);
router.post('/', totalBudgetController.setTotalBudget);

module.exports = router;
