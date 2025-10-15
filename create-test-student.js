// Test script to create a sample student with some book history
// Run this with: node create-test-student.js

const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  createTestStudent();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function createTestStudent() {
  try {
    // Create a test student with some borrowing history
    const testStudent = new User({
      name: 'John Doe',
      email: 'john.doe@student.edu',
      studentId: 'STU001',
      password: 'TestPass@123',
      totalBooksBorrowed: 3,
      totalBooksReturned: 1,
      currentlyBorrowed: 2,
      borrowedBooks: [
        {
          bookTitle: 'Introduction to Programming',
          bookAuthor: 'Jane Smith',
          borrowDate: new Date('2024-12-15'),
          dueDate: new Date('2025-01-15'),
          returnDate: new Date('2025-01-10'),
          isReturned: true,
          lateFee: 0
        },
        {
          bookTitle: 'Data Structures and Algorithms',
          bookAuthor: 'Robert Johnson',
          borrowDate: new Date('2024-12-20'),
          dueDate: new Date('2025-01-20'),
          returnDate: null,
          isReturned: false,
          lateFee: 0
        },
        {
          bookTitle: 'Web Development Basics',
          bookAuthor: 'Sarah Wilson',
          borrowDate: new Date('2024-12-25'),
          dueDate: new Date('2025-01-01'), // This is overdue
          returnDate: null,
          isReturned: false,
          lateFee: 70 // 7 days * 10 rupees per day
        }
      ]
    });

    // Check if user already exists
    const existingUser = await User.findOne({ studentId: 'STU001' });
    if (existingUser) {
      console.log('Test student already exists. Updating...');
      await User.findOneAndUpdate({ studentId: 'STU001' }, testStudent);
    } else {
      await testStudent.save();
    }

    console.log('✅ Test student created successfully!');
    console.log('Login credentials:');
    console.log('Student ID: STU001');
    console.log('Password: TestPass@123');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating test student:', error);
    mongoose.disconnect();
  }
}
