// add-sample-books.js
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleBooks = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    totalQuantity: 5,
    availableQuantity: 5,
    borrowedQuantity: 0,
    summary: "A philosophical novel about following your dreams and finding your personal legend.",
    language: "English",
    format: "paperback",
    rating: 5
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A classic novel about racial injustice and childhood in the American South.",
    language: "English",
    format: "hardcover",
    rating: 5
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    summary: "A dystopian novel about totalitarianism and surveillance.",
    language: "English",
    format: "paperback",
    rating: 5
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    summary: "A classic romance novel about Elizabeth Bennet and Mr. Darcy.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A novel about the Jazz Age and the American Dream.",
    language: "English",
    format: "hardcover",
    rating: 4
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    totalQuantity: 6,
    availableQuantity: 6,
    borrowedQuantity: 0,
    summary: "The first book in the Harry Potter series about a young wizard.",
    language: "English",
    format: "paperback",
    rating: 5
  }
];

async function addSampleBooks() {
  try {
    console.log('🔗 Connected to MongoDB');
    
    // Clear existing books (optional)
    await Book.deleteMany({});
    console.log('🗑️ Cleared existing books');
    
    // Add sample books
    const result = await Book.insertMany(sampleBooks);
    console.log(`✅ Added ${result.length} sample books to the database`);
    
    // Display added books
    result.forEach(book => {
      console.log(`📚 "${book.title}" by ${book.author} - ${book.availableQuantity} available`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding books:', error);
    process.exit(1);
  }
}

// Run the function
addSampleBooks();
