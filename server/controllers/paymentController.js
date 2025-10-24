const { paymentsApi, ordersApi } = require('../config/square');
const { randomUUID } = require('crypto');

// Create a payment
const createPayment = async (req, res) => {
  try {
    const { sourceId, amount, currency = 'USD', orderId, customerId } = req.body;

    // Validate required fields
    if (!sourceId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Source ID and amount are required'
      });
    }

    // Create payment request
    const paymentRequest = {
      sourceId,
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)), // Convert to cents
        currency
      },
      idempotencyKey: randomUUID()
    };

    // Add optional fields if provided
    if (orderId) {
      paymentRequest.orderId = orderId;
    }

    if (customerId) {
      paymentRequest.customerId = customerId;
    }

    // Process payment
    const { payment } = await paymentsApi.create(paymentRequest);

    // Only return serializable fields (avoid BigInt serialization issues)
    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
        orderId: payment.orderId
      }
    });
  } catch (error) {
    console.error('Payment error:', error);

    // Handle Square-specific errors
    let statusCode = 500;
    let errorMessage = 'Payment failed';
    let errorDetail = error.message;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    if (error.errors && error.errors.length > 0) {
      // Square API error format
      const squareError = error.errors[0];
      errorMessage = squareError.detail || squareError.code || 'Payment failed';

      if (squareError.code === 'UNAUTHORIZED') {
        errorMessage = 'Payment service configuration error. Please contact support.';
        errorDetail = 'Square authentication failed';
      } else if (squareError.category === 'PAYMENT_METHOD_ERROR') {
        errorMessage = 'Payment method was declined. Please try a different card.';
      } else if (squareError.category === 'INVALID_REQUEST_ERROR') {
        errorMessage = 'Invalid payment information. Please check your details.';
      }
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: errorDetail
    });
  }
};

// Create Square order
const createOrder = async (req, res) => {
  try {
    const { lineItems, locationId } = req.body;

    if (!lineItems || lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Line items are required'
      });
    }

    const orderRequest = {
      order: {
        locationId: locationId || process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems.map(item => ({
          name: item.name,
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: BigInt(Math.round(item.price * 100)),
            currency: 'USD'
          }
        }))
      },
      idempotencyKey: randomUUID()
    };

    const result = await ordersApi.create(orderRequest);

    res.json({
      success: true,
      order: result
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Order creation failed',
      error: error.message
    });
  }
};

// Get payment by ID
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const result = await paymentsApi.get({ paymentId });

    res.json({
      success: true,
      payment: result
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  createOrder,
  getPayment
};
