// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Made optional for backward compatibility
    default: 'Student'
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  borrowedBooks: [{
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    isReturned: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    lateFee: { type: Number, default: 0 }
  }],
  totalBooksBorrowed: { type: Number, default: 0 },
  totalBooksReturned: { type: Number, default: 0 },
  currentlyBorrowed: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
