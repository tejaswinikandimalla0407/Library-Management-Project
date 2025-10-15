// Debug authentication queries
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  debugAuth();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function debugAuth() {
  try {
    const testStudentId = 'STU001';
    const testPassword = 'TestPass@123';
    
    console.log(`🔍 Testing authentication for:`);
    console.log(`   Student ID: ${testStudentId}`);
    console.log(`   Password: ${testPassword}\n`);
    
    // Method 1: Exact match query (what the login route uses)
    console.log('📝 Method 1: Exact match query');
    const user1 = await User.findOne({ studentId: testStudentId, password: testPassword });
    console.log(`   Result: ${user1 ? 'FOUND' : 'NOT FOUND'}`);
    if (user1) {
      console.log(`   User: ${user1.name} (${user1.email})`);
    }
    console.log('');
    
    // Method 2: Separate queries
    console.log('📝 Method 2: Find by Student ID first');
    const user2 = await User.findOne({ studentId: testStudentId });
    console.log(`   Student found: ${user2 ? 'YES' : 'NO'}`);
    if (user2) {
      console.log(`   Stored password: "${user2.password}"`);
      console.log(`   Test password: "${testPassword}"`);
      console.log(`   Password match: ${user2.password === testPassword ? 'YES' : 'NO'}`);
      console.log(`   Password length: stored=${user2.password.length}, test=${testPassword.length}`);
    }
    console.log('');
    
    // Method 3: List all users and their passwords
    console.log('📝 Method 3: All users in database');
    const allUsers = await User.find({});
    allUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}:`);
      console.log(`      Student ID: "${user.studentId}"`);
      console.log(`      Password: "${user.password}"`);
      console.log(`      Name: "${user.name || 'NOT SET'}"`);
      console.log(`      Email: "${user.email}"`);
      console.log('      ─────────────────');
    });
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.disconnect();
  }
}
