// add-new-admin-example.js
// This script shows how to add a new admin account to the database

const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

async function addNewAdmin() {
  try {
    console.log('🔗 Connected to MongoDB\n');
    
    // Example: Adding a new admin account
    const newAdminData = {
      username: 'newadmin',           // Change this
      password: 'NewAdmin@123',       // Change this
      fullName: 'New Administrator', // Change this
      email: 'newadmin@library.edu',  // Change this
      role: 'admin',                  // admin, librarian, manager, super_admin
      isActive: true,
      permissions: {
        canManageBooks: true,
        canViewUsers: true,
        canManageUsers: false,    // Set to true if you want this admin to manage users
        canViewReports: true,
        canManageAdmins: false    // Set to true if you want this admin to manage other admins
      }
    };
    
    // Check if username or email already exists
    const existing = await Admin.findOne({
      $or: [
        { username: newAdminData.username.toLowerCase() }, 
        { email: newAdminData.email.toLowerCase() }
      ]
    });

    if (existing) {
      console.log('❌ Username or email already exists');
      console.log(`   Existing admin: ${existing.username} (${existing.email})`);
      process.exit(1);
    }

    // Create new admin
    const newAdmin = new Admin({
      ...newAdminData,
      username: newAdminData.username.toLowerCase(),
      email: newAdminData.email.toLowerCase()
    });
    
    await newAdmin.save();
    
    console.log('✅ New admin account created successfully!');
    console.log(`👨‍💼 Username: ${newAdmin.username}`);
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`👤 Full Name: ${newAdmin.fullName}`);
    console.log(`🔰 Role: ${newAdmin.role}`);
    console.log(`✅ Active: ${newAdmin.isActive}`);
    console.log(`🛠️ Permissions:`);
    console.log(`   📚 Manage Books: ${newAdmin.permissions.canManageBooks}`);
    console.log(`   👥 View Users: ${newAdmin.permissions.canViewUsers}`);
    console.log(`   🛠️ Manage Users: ${newAdmin.permissions.canManageUsers}`);
    console.log(`   📊 View Reports: ${newAdmin.permissions.canViewReports}`);
    console.log(`   👨‍💼 Manage Admins: ${newAdmin.permissions.canManageAdmins}`);
    
    console.log('\n💡 You can now login with these credentials:');
    console.log(`   Username: ${newAdminData.username}`);
    console.log(`   Password: ${newAdminData.password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding admin:', error);
    process.exit(1);
  }
}

// Run the function
addNewAdmin();
