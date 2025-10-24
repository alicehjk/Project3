#!/usr/bin/env node
/**
 * MongoDB Connection Test Script
 *
 * This script tests the MongoDB connection to ensure it's configured correctly.
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');

// Test 1: Check environment variable
console.log('Test 1: MongoDB URI Configuration');
console.log('----------------------------------');
if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  // Mask password in output
  const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
  console.log(`✅ MONGODB_URI is set: ${maskedUri}`);
} else {
  console.log('❌ MONGODB_URI is not set in .env file');
  process.exit(1);
}

// Test 2: Test connection
console.log('\n\nTest 2: Connection Test');
console.log('------------------------');
console.log('Attempting to connect to MongoDB...');

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port || 'default'}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);

    // Test 3: Test database operations
    console.log('\n\nTest 3: Database Operations Test');
    console.log('---------------------------------');

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collection(s) in the database`);

    if (collections.length > 0) {
      console.log('   Collections:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    console.log('\n\n✨ All tests passed! MongoDB is properly connected.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);

  } catch (error) {
    console.log('❌ Failed to connect to MongoDB');
    console.log(`   Error: ${error.message}`);

    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Possible issues:');
      console.log('   1. Check your network connection');
      console.log('   2. Verify your MongoDB Atlas IP whitelist includes your current IP');
      console.log('   3. Confirm your username and password are correct');
      console.log('   4. Ensure your cluster is running');
    } else if (error.name === 'MongoParseError') {
      console.log('\n💡 The connection string format is invalid. Please check your MONGODB_URI.');
    }

    process.exit(1);
  }
})();
