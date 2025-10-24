#!/usr/bin/env node
/**
 * Square Integration Test Script
 *
 * This script tests the Square SDK integration to ensure everything is configured correctly.
 */

require('dotenv').config();
const { SquareClient, SquareEnvironment } = require('square');

console.log('🔍 Testing Square SDK Integration...\n');

// Test 1: Check environment variables
console.log('Test 1: Environment Variables');
console.log('--------------------------------');
const requiredEnvVars = [
  'SQUARE_APPLICATION_ID',
  'SQUARE_ACCESS_TOKEN',
  'SQUARE_LOCATION_ID',
  'SQUARE_ENVIRONMENT'
];

let allEnvVarsSet = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allEnvVarsSet = false;
  }
});

if (!allEnvVarsSet) {
  console.log('\n❌ Some environment variables are missing. Please check your .env file.');
  process.exit(1);
}

// Test 2: Initialize Square Client
console.log('\n\nTest 2: Square Client Initialization');
console.log('--------------------------------');
try {
  const squareClient = new SquareClient({
    bearerAuth: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox
  });
  console.log('✅ Square client initialized successfully');
  console.log(`   Environment: ${process.env.SQUARE_ENVIRONMENT}`);
} catch (error) {
  console.log('❌ Failed to initialize Square client:', error.message);
  process.exit(1);
}

// Test 3: Test API connection
console.log('\n\nTest 3: API Connection Test');
console.log('--------------------------------');
(async () => {
  try {
    const squareClient = new SquareClient({
      bearerAuth: process.env.SQUARE_ACCESS_TOKEN,
      environment: process.env.SQUARE_ENVIRONMENT === 'production'
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox
    });

    // Try to list locations to verify API access
    const locations = await squareClient.locations.list();

    if (locations && locations.locations && locations.locations.length > 0) {
      console.log('✅ Successfully connected to Square API');
      console.log(`   Found ${locations.locations.length} location(s)`);

      const targetLocation = locations.locations.find(
        loc => loc.id === process.env.SQUARE_LOCATION_ID
      ) || locations.locations[0];

      console.log(`   Location Name: ${targetLocation.name || 'N/A'}`);
      console.log(`   Location ID: ${targetLocation.id}`);
      console.log(`   Status: ${targetLocation.status || 'ACTIVE'}`);
    } else {
      console.log('✅ Successfully connected to Square API');
      console.log('   No locations found, but connection is working');
    }

    console.log('\n\n✨ All tests passed! Square SDK is properly configured.\n');
  } catch (error) {
    console.log('❌ Failed to connect to Square API');
    console.log(`   Error: ${error.message}`);
    if (error.body && error.body.errors) {
      error.body.errors.forEach((err, idx) => {
        console.log(`   Error ${idx + 1}:`, err.detail || err.code || JSON.stringify(err));
      });
    }
    console.log('\n💡 Tip: Make sure your access token is valid and has the correct permissions.');
    process.exit(1);
  }
})();
