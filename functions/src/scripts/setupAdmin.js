/**
 * Setup Admin User
 * This script removes all existing users and creates a single admin user
 * Run with: node src/scripts/setupAdmin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function setupAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ Connected to MongoDB');

    // Remove all existing users
    console.log('\nRemoving all existing users...');
    const deleteResult = await User.deleteMany({});
    console.log(`✓ Removed ${deleteResult.deletedCount} users`);

    // Create admin user
    console.log('\nCreating admin user...');
    const admin = await User.create({
      name: 'Silvano Otieno',
      phone: '0746170866',
      role: 'chairperson', // chairperson is the admin role
      fingerprintEnabled: false,
    });

    console.log('✓ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log('  Name:', admin.name);
    console.log('  Phone:', admin.phone);
    console.log('  Role:', admin.role);
    console.log('  ID:', admin._id);
    console.log('\nYou can now login with phone: 0746170866');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdmin();
