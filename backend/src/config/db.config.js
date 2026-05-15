// backend/src/config/db.config.js
const mongoose = require('mongoose');
const dns = require('dns');

// 🔥 Fix for querySrv ECONNREFUSED
dns.setServers(['8.8.8.8', '1.1.1.1']);   // Google DNS

const connectDB = async () => {
  try {
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('✅ MongoDB Connected Successfully to Atlas');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
