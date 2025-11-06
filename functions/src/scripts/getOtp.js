/**
 * Get Active OTP for a Phone Number
 * This script retrieves the current valid OTP for debugging
 * Run with: node src/scripts/getOtp.js 0746170866
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const OtpCode = require('../models/OtpCode');

async function getOtp() {
  try {
    const phone = process.argv[2];
    
    if (!phone) {
      console.log('Usage: node src/scripts/getOtp.js <phone_number>');
      console.log('Example: node src/scripts/getOtp.js 0746170866');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ Connected to MongoDB\n');

    // Find active OTP
    const otp = await OtpCode.findOne({ 
      phone, 
      used: false,
      expiresAt: { $gt: new Date() } // Not expired
    }).sort({ createdAt: -1 }); // Get most recent

    if (!otp) {
      console.log(`❌ No active OTP found for ${phone}`);
      console.log('\nRequest a new OTP from the app first.');
    } else {
      const expiresIn = Math.round((otp.expiresAt - new Date()) / 1000);
      console.log(`📱 Active OTP for ${phone}:`);
      console.log(`\n   CODE: ${otp.code}`);
      console.log(`   Expires in: ${expiresIn} seconds (${Math.floor(expiresIn / 60)}m ${expiresIn % 60}s)`);
      console.log(`   Created: ${otp.createdAt.toLocaleString()}`);
      console.log(`   Expires: ${otp.expiresAt.toLocaleString()}\n`);
    }

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
getOtp();
