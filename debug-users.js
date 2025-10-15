// Debug script to check existing users in database
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  debugUsers();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function debugUsers() {
  try {
    console.log('🔍 Checking all users in database...\n');
    
    const users = await User.find({});
    console.log(`📊 Total users found: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
    } else {
      users.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`);
        console.log(`   Name: ${user.name || 'NOT SET'}`);
        console.log(`   Student ID: ${user.studentId}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Total Books Borrowed: ${user.totalBooksBorrowed || 0}`);
        console.log(`   Has Name Field: ${user.name ? 'YES' : 'NO'}`);
        console.log(`   Created: ${user.createdAt || 'UNKNOWN'}`);
        console.log('   ─────────────────────────────────────');
      });
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error checking users:', error);
    mongoose.disconnect();
  }
}
