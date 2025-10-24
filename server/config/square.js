const { SquareClient, SquareEnvironment } = require('square');

// Initialize Square client
const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox
});

// Get the API instances
const paymentsApi = squareClient.payments;
const ordersApi = squareClient.orders;
const customersApi = squareClient.customers;

module.exports = {
  squareClient,
  paymentsApi,
  ordersApi,
  customersApi
};
