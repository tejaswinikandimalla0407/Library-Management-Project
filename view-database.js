// view-database.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

async function viewDatabase() {
  try {
    console.log('🔗 Connected to MongoDB: libraryDB\n');
    console.log('=' .repeat(80));
    console.log('📊 DATABASE OVERVIEW');
    console.log('=' .repeat(80));
    
    // ==================== USERS COLLECTION ====================
    console.log('\n👥 USERS COLLECTION');
    console.log('-' .repeat(50));
    const users = await User.find({});
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   Name: ${user.name || 'Not set'}`);
      console.log(`   Student ID: ${user.studentId}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Total Books Borrowed: ${user.totalBooksBorrowed || 0}`);
      console.log(`   Total Books Returned: ${user.totalBooksReturned || 0}`);
      console.log(`   Currently Borrowed: ${user.currentlyBorrowed || 0}`);
      console.log(`   Borrowed Books Count: ${user.borrowedBooks ? user.borrowedBooks.length : 0}`);
      
      if (user.borrowedBooks && user.borrowedBooks.length > 0) {
        console.log('   📚 Active Borrowed Books:');
        const activeBooks = user.borrowedBooks.filter(book => !book.isReturned);
        activeBooks.forEach((book, bookIndex) => {
          console.log(`     ${bookIndex + 1}. "${book.bookTitle}" by ${book.bookAuthor}`);
          console.log(`        Due: ${new Date(book.dueDate).toLocaleDateString()}`);
          console.log(`        Late Fee: ₹${book.lateFee || 0}`);
        });
      }
      console.log('');
    });
    
    // ==================== BOOKS COLLECTION ====================
    console.log('\n📚 BOOKS COLLECTION (INVENTORY)');
    console.log('-' .repeat(50));
    const books = await Book.find({});
    console.log(`Found ${books.length} books in inventory:\n`);
    
    books.forEach((book, index) => {
      console.log(`📖 Book ${index + 1}: "${book.title}"`);
      console.log(`   Author: ${book.author}`);
      console.log(`   Genre: ${book.genre}`);
      console.log(`   Available: ${book.availableQuantity}/${book.totalQuantity}`);
      console.log(`   Currently Borrowed: ${book.borrowedQuantity || 0}`);
      console.log(`   Language: ${book.language || 'English'}`);
      console.log(`   Format: ${book.format || 'paperback'}`);
      console.log(`   Rating: ${book.rating ? '⭐'.repeat(book.rating) : 'Not rated'}`);
      if (book.summary) {
        console.log(`   Summary: ${book.summary.substring(0, 100)}${book.summary.length > 100 ? '...' : ''}`);
      }
      console.log('');
    });
    
    // ==================== ADMINS COLLECTION ====================
    console.log('\n👨‍💼 ADMINS COLLECTION');
    console.log('-' .repeat(50));
    const admins = await Admin.find({}).select('-password');
    console.log(`Found ${admins.length} admin accounts:\n`);
    
    admins.forEach((admin, index) => {
      console.log(`👨‍💼 Admin ${index + 1}:`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Full Name: ${admin.fullName}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive ? '✅' : '❌'}`);
      console.log(`   Last Login: ${admin.lastLogin || 'Never'}`);
      console.log(`   Permissions:`);
      console.log(`     📚 Manage Books: ${admin.permissions.canManageBooks ? '✅' : '❌'}`);
      console.log(`     👥 View Users: ${admin.permissions.canViewUsers ? '✅' : '❌'}`);
      console.log(`     🛠️ Manage Users: ${admin.permissions.canManageUsers ? '✅' : '❌'}`);
      console.log(`     📊 View Reports: ${admin.permissions.canViewReports ? '✅' : '❌'}`);
      console.log(`     👨‍💼 Manage Admins: ${admin.permissions.canManageAdmins ? '✅' : '❌'}`);
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    // ==================== SUMMARY ====================
    console.log('\n📊 DATABASE SUMMARY');
    console.log('-' .repeat(50));
    const totalActiveBooks = users.reduce((sum, user) => sum + (user.currentlyBorrowed || 0), 0);
    const totalBooksBorrowedEver = users.reduce((sum, user) => sum + (user.totalBooksBorrowed || 0), 0);
    const totalBooksReturned = users.reduce((sum, user) => sum + (user.totalBooksReturned || 0), 0);
    const totalBooksInInventory = books.reduce((sum, book) => sum + book.totalQuantity, 0);
    const availableBooksCount = books.reduce((sum, book) => sum + book.availableQuantity, 0);
    
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`📚 Total Books in Inventory: ${totalBooksInInventory}`);
    console.log(`📖 Available Books: ${availableBooksCount}`);
    console.log(`📥 Currently Borrowed Books: ${totalActiveBooks}`);
    console.log(`📊 Total Books Borrowed (Ever): ${totalBooksBorrowedEver}`);
    console.log(`📤 Total Books Returned: ${totalBooksReturned}`);
    console.log(`👨‍💼 Total Admin Accounts: ${admins.length}`);
    console.log(`✅ Active Admin Accounts: ${admins.filter(admin => admin.isActive).length}`);
    
    console.log('\n' + '=' .repeat(80));
    console.log('💡 TO ADD NEW ADMIN ACCOUNTS:');
    console.log('   1. Connect to MongoDB (mongodb://127.0.0.1:27017/libraryDB)');
    console.log('   2. Go to collection: admins');
    console.log('   3. Add new document with required fields:');
    console.log('      - username (string, lowercase)');
    console.log('      - password (string)');
    console.log('      - fullName (string)');
    console.log('      - email (string, lowercase)');
    console.log('      - role (admin/librarian/manager/super_admin)');
    console.log('      - isActive (boolean, true)');
    console.log('      - permissions (object with boolean values)');
    console.log('=' .repeat(80));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
viewDatabase();
