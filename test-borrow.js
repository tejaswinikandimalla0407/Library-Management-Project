// test-borrow.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

async function testBorrow() {
  try {
    console.log('🔗 Connected to MongoDB\n');
    
    // Test with user "Shivam" borrowing "The Alchemist"
    const studentId = "Shivam";
    const bookTitle = "The Alchemist";
    
    console.log(`Testing: User ${studentId} borrowing "${bookTitle}"`);
    
    // Find the user
    const user = await User.findOne({ studentId });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    console.log('✅ User found:', user.name);
    
    // Find the book
    const book = await Book.findOne({ title: bookTitle });
    if (!book) {
      console.log('❌ Book not found');
      process.exit(1);
    }
    console.log('✅ Book found:', book.title, 'by', book.author);
    console.log('   Available quantity:', book.availableQuantity);
    
    if (book.availableQuantity <= 0) {
      console.log('❌ Book not available');
      process.exit(1);
    }
    
    // Simulate borrowing
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
    
    user.borrowedBooks.push({
      bookTitle: book.title,
      bookAuthor: book.author,
      borrowDate: new Date(),
      dueDate: dueDate,
      isReturned: false,
      lateFee: 0
    });
    
    user.totalBooksBorrowed++;
    user.currentlyBorrowed++;
    
    book.availableQuantity--;
    book.borrowedQuantity++;
    book.borrowHistory.push({
      studentId,
      borrowDate: new Date(),
      isReturned: false
    });
    
    // Save changes
    await user.save();
    await book.save();
    
    console.log('✅ Book borrowed successfully!');
    console.log('📊 Updated user stats:');
    console.log('   Total Books Borrowed:', user.totalBooksBorrowed);
    console.log('   Currently Borrowed:', user.currentlyBorrowed);
    console.log('   Due Date:', dueDate.toLocaleDateString());
    
    console.log('📚 Updated book stats:');
    console.log('   Available:', book.availableQuantity);
    console.log('   Borrowed:', book.borrowedQuantity);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
testBorrow();
