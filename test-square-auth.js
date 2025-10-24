#!/usr/bin/env node
/**
 * Square Authentication Diagnostic Script
 */

require('dotenv').config();
const { SquareClient, SquareEnvironment } = require('square');

console.log('🔍 Square Authentication Diagnostics\n');

// Check environment variables
console.log('1. Environment Variables Check');
console.log('================================');
const appId = process.env.SQUARE_APPLICATION_ID;
const token = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;
const env = process.env.SQUARE_ENVIRONMENT;

console.log(`Application ID: ${appId ? appId.substring(0, 30) + '...' : 'NOT SET'}`);
console.log(`Access Token: ${token ? token.substring(0, 20) + '...' : 'NOT SET'}`);
console.log(`Location ID: ${locationId || 'NOT SET'}`);
console.log(`Environment: ${env || 'NOT SET'}`);

// Check for whitespace issues
if (token && (token !== token.trim())) {
  console.log('⚠️  WARNING: Access token has leading/trailing whitespace!');
}

if (appId && (appId !== appId.trim())) {
  console.log('⚠️  WARNING: Application ID has leading/trailing whitespace!');
}

if (locationId && (locationId !== locationId.trim())) {
  console.log('⚠️  WARNING: Location ID has leading/trailing whitespace!');
}

// Test Square client initialization
console.log('\n2. Square Client Initialization');
console.log('================================');

try {
  const client = new SquareClient({
    token: token?.trim(),
    environment: env === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox
  });
  console.log('✅ Client initialized successfully');

  // Test API call
  console.log('\n3. Testing Square API Connection');
  console.log('==================================');

  (async () => {
    try {
      // Try to list locations
      console.log('Attempting to list locations...');
      const response = await client.locations.list();

      console.log('✅ Successfully connected to Square API!');
      console.log(`   Found ${response.locations?.length || 0} location(s)`);

      if (response.locations && response.locations.length > 0) {
        console.log('\n   Available Locations:');
        response.locations.forEach((loc, idx) => {
          console.log(`   ${idx + 1}. ${loc.name} (ID: ${loc.id})`);
          console.log(`      Status: ${loc.status}`);
          if (loc.id === locationId?.trim()) {
            console.log(`      ✅ This matches your SQUARE_LOCATION_ID`);
          }
        });

        // Check if the configured location ID exists
        if (locationId) {
          const matchingLocation = response.locations.find(loc => loc.id === locationId.trim());
          if (!matchingLocation) {
            console.log(`\n   ⚠️  WARNING: Your SQUARE_LOCATION_ID (${locationId}) was not found in the available locations!`);
            console.log(`   This could cause payment errors. Use one of the IDs listed above.`);
          }
        }
      }

      // Try to test payments API (this will fail but shows if we have permissions)
      console.log('\n4. Testing Payments API Access');
      console.log('================================');
      try {
        await client.payments.create({
          sourceId: 'test_token_that_will_fail',
          amountMoney: {
            amount: BigInt(100),
            currency: 'USD'
          },
          idempotencyKey: 'test-key-' + Date.now()
        });
      } catch (paymentError) {
        if (paymentError.statusCode === 401) {
          console.log('❌ 401 UNAUTHORIZED - Access token does not have permission for payments API');
          console.log('   Possible causes:');
          console.log('   1. Token is from a different Square application');
          console.log('   2. Token does not have "PAYMENTS_WRITE" permission');
          console.log('   3. Token has expired or been revoked');
        } else if (paymentError.statusCode === 400) {
          console.log('✅ Payments API is accessible (got expected 400 error for test data)');
          console.log('   Your authentication is working correctly!');
        } else {
          console.log(`   Got error: ${paymentError.statusCode} - ${paymentError.message}`);
        }
      }

      process.exit(0);
    } catch (error) {
      console.log('❌ Failed to connect to Square API');
      console.log(`   Status: ${error.statusCode || 'Unknown'}`);
      console.log(`   Message: ${error.message}`);

      if (error.errors && error.errors.length > 0) {
        console.log(`   Square Error: ${error.errors[0].detail || error.errors[0].code}`);
      }

      process.exit(1);
    }
  })();

} catch (error) {
  console.log('❌ Failed to initialize Square client');
  console.log(`   Error: ${error.message}`);
  process.exit(1);
}
