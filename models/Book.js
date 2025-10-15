// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  publisher: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 1
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  borrowedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  summary: {
    type: String,
    maxlength: 1000
  },
  language: {
    type: String,
    default: 'English'
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
    default: 'paperbook'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  pages: {
    type: Number,
    min: 1,
    default: null
  },
  description: {
    type: String,
    maxlength: 2000
  },
  location: {
    shelf: String,
    section: String
  },
  borrowHistory: [{
    studentId: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    isReturned: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Index for efficient searching
BookSchema.index({ 
  title: 'text', 
  author: 'text', 
  genre: 'text', 
  summary: 'text' 
});

// Virtual to check if book is available
BookSchema.virtual('isAvailable').get(function() {
  return this.availableQuantity > 0;
});

// Method to borrow book
BookSchema.methods.borrowBook = function(studentId) {
  if (this.availableQuantity > 0) {
    this.availableQuantity--;
    this.borrowedQuantity++;
    this.borrowHistory.push({
      studentId: studentId,
      borrowDate: new Date(),
      isReturned: false
    });
    return true;
  }
  return false;
};

// Method to return book
BookSchema.methods.returnBook = function(studentId) {
  const borrowRecord = this.borrowHistory.find(
    record => record.studentId === studentId && !record.isReturned
  );
  
  if (borrowRecord) {
    borrowRecord.isReturned = true;
    borrowRecord.returnDate = new Date();
    this.availableQuantity++;
    this.borrowedQuantity--;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Book', BookSchema);
