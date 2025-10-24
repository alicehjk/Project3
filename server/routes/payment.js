const express = require('express');
const router = express.Router();
const {
  createPayment,
  createOrder,
  getPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Public route to get Square application ID (needed for client-side initialization)
router.get('/config', (req, res) => {
  res.json({
    applicationId: process.env.SQUARE_APPLICATION_ID,
    locationId: process.env.SQUARE_LOCATION_ID,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox'
  });
});

// Protected routes (require authentication)
router.post('/create-payment', protect, createPayment);
router.post('/create-order', protect, createOrder);
router.get('/:paymentId', protect, getPayment);

module.exports = router;
