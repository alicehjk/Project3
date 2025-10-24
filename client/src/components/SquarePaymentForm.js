import React, { useState, useEffect } from 'react';
import {
  PaymentForm,
  CreditCard,
  GooglePay,
  ApplePay
} from 'react-square-web-payments-sdk';
import axios from 'axios';

const SquarePaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [squareConfig, setSquareConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch Square configuration from backend
    const fetchSquareConfig = async () => {
      try {
        const { data } = await axios.get('/api/payment/config');
        setSquareConfig(data);
      } catch (error) {
        console.error('Failed to fetch Square config:', error);
        if (onPaymentError) {
          onPaymentError('Failed to initialize payment system');
        }
      }
    };

    fetchSquareConfig();
  }, [onPaymentError]);

  const handlePaymentSuccess = async (token) => {
    setLoading(true);

    try {
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        throw new Error('Please log in to complete your purchase');
      }

      const { data } = await axios.post('/api/payment/create-payment', {
        sourceId: token.token,
        amount: amount
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (data.success) {
        if (onPaymentSuccess) {
          onPaymentSuccess(data.payment);
        }
      } else {
        const errorMsg = data.message || 'Payment was declined. Please try a different payment method.';
        if (onPaymentError) {
          onPaymentError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);

      let errorMessage = 'Payment failed. Please try again.';

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        const serverError = error.response.data?.error;

        if (status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (status === 400) {
          errorMessage = serverMessage || 'Invalid payment information. Please check your card details.';
        } else if (status === 500) {
          errorMessage = serverError || serverMessage || 'Server error. Please contact support or try again later.';
        } else {
          errorMessage = serverMessage || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment form error:', error);
    if (onPaymentError) {
      onPaymentError(error.message || 'Payment processing error');
    }
  };

  if (!squareConfig) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading payment form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="square-payment-form">
      <PaymentForm
        applicationId={squareConfig.applicationId}
        locationId={squareConfig.locationId}
        cardTokenizeResponseReceived={handlePaymentSuccess}
        createPaymentRequest={() => ({
          countryCode: 'US',
          currencyCode: 'USD',
          total: {
            amount: amount.toFixed(2),
            label: 'Total'
          }
        })}
      >
        <CreditCard
          buttonProps={{
            css: {
              backgroundColor: '#0d6efd',
              fontSize: '16px',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#0b5ed7'
              }
            }
          }}
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </CreditCard>

        <GooglePay />
        <ApplePay />
      </PaymentForm>

      <div className="mt-3 text-muted small">
        <p className="mb-0">
          {squareConfig.environment === 'sandbox' && (
            <span className="badge bg-warning text-dark">Test Mode</span>
          )}
        </p>
        <p className="mb-0">Secure payment powered by Square</p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
