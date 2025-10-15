// debug-user.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

async function debugUser() {
  try {
    console.log('🔗 Connected to MongoDB\n');
    
    // Get all users
    const users = await User.find({});
    console.log(`📋 Found ${users.length} users in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   Name: ${user.name || 'Not set'}`);
      console.log(`   Student ID: ${user.studentId}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Total Books Borrowed: ${user.totalBooksBorrowed || 0}`);
      console.log(`   Total Books Returned: ${user.totalBooksReturned || 0}`);
      console.log(`   Currently Borrowed: ${user.currentlyBorrowed || 0}`);
      console.log(`   Borrowed Books Array Length: ${user.borrowedBooks ? user.borrowedBooks.length : 0}`);
      
      if (user.borrowedBooks && user.borrowedBooks.length > 0) {
        console.log('   📚 Borrowed Books:');
        user.borrowedBooks.forEach((book, bookIndex) => {
          console.log(`     ${bookIndex + 1}. ${book.bookTitle} by ${book.bookAuthor}`);
          console.log(`        Borrow Date: ${book.borrowDate}`);
          console.log(`        Due Date: ${book.dueDate}`);
          console.log(`        Returned: ${book.isReturned}`);
          console.log(`        Late Fee: ₹${book.lateFee || 0}`);
        });
      }
      console.log(''); // Empty line for separation
    });
    
    // Get all books
    const books = await Book.find({});
    console.log(`📚 Found ${books.length} books in inventory:\n`);
    
    books.forEach((book, index) => {
      console.log(`📖 Book ${index + 1}: "${book.title}" by ${book.author}`);
      console.log(`   Available: ${book.availableQuantity}/${book.totalQuantity}`);
      console.log(`   Currently Borrowed: ${book.borrowedQuantity}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
debugUser();
