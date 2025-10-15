// Test login script to debug authentication issues
// Usage: node test-login.js [studentId] [password]

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('❌ Usage: node test-login.js [studentId] [password]');
  console.log('Example: node test-login.js STU001 TestPass@123');
  process.exit(1);
}

const studentId = args[0];
const password = args[1];

console.log(`🔍 Testing login with:`);
console.log(`   Student ID: ${studentId}`);
console.log(`   Password: ${password}`);
console.log('');

// Test the login API endpoint
async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentId, password })
    });

    const data = await response.json();
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Data:`, JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log(`👤 User data:`);
      console.log(`   Name: ${data.user.name}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Student ID: ${data.user.studentId}`);
      console.log(`   Books Borrowed: ${data.user.totalBooksBorrowed}`);
    } else {
      console.log('❌ Login failed!');
      console.log(`   Error: ${data.message}`);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('💡 Make sure the server is running on http://localhost:3000');
  }
}

// Import fetch for Node.js
const { default: fetch } = require('node-fetch');

testLogin();
