// add-admin-accounts.js
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

const defaultAdmins = [
  {
    username: 'admin',
    password: 'Satvic@123',
    role: 'super_admin',
    fullName: 'System Administrator',
    email: 'admin@library.edu',
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: true,
      canViewReports: true,
      canManageAdmins: true
    }
  },
  {
    username: 'librarian',
    password: 'Library@123',
    role: 'librarian',
    fullName: 'Head Librarian',
    email: 'librarian@library.edu',
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: false,
      canViewReports: true,
      canManageAdmins: false
    }
  },
  {
    username: 'manager',
    password: 'Manager@123',
    role: 'manager',
    fullName: 'Library Manager',
    email: 'manager@library.edu',
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: true,
      canViewReports: true,
      canManageAdmins: false
    }
  }
];

async function addAdminAccounts() {
  try {
    console.log('🔗 Connected to MongoDB\n');
    
    // Clear existing admin accounts (optional)
    await Admin.deleteMany({});
    console.log('🗑️ Cleared existing admin accounts');
    
    // Add default admin accounts
    const result = await Admin.insertMany(defaultAdmins);
    console.log(`✅ Added ${result.length} admin accounts to the database\n`);
    
    // Display added admins
    result.forEach((admin, index) => {
      console.log(`👨‍💼 Admin ${index + 1}:`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Full Name: ${admin.fullName}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Permissions:`);
      console.log(`     📚 Manage Books: ${admin.permissions.canManageBooks}`);
      console.log(`     👥 View Users: ${admin.permissions.canViewUsers}`);
      console.log(`     🛠️ Manage Users: ${admin.permissions.canManageUsers}`);
      console.log(`     📊 View Reports: ${admin.permissions.canViewReports}`);
      console.log(`     👨‍💼 Manage Admins: ${admin.permissions.canManageAdmins}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log('');
    });
    
    console.log('💡 You can now add/modify admin accounts directly in MongoDB!');
    console.log('   Collection: admins');
    console.log('   Database: libraryDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding admin accounts:', error);
    process.exit(1);
  }
}

// Run the function
addAdminAccounts();
