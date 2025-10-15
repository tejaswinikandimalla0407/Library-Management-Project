// add-more-books.js
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

const additionalBooks = [
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    summary: "A classic coming-of-age story about Holden Caulfield's experiences in New York.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    genre: "Fiction",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A novel about a group of British boys stranded on a deserted island.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    totalQuantity: 5,
    availableQuantity: 5,
    borrowedQuantity: 0,
    summary: "A tale of Bilbo Baggins and his unexpected journey to the Lonely Mountain.",
    language: "English",
    format: "hardcover",
    rating: 5
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Science Fiction",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A dystopian novel set in a futuristic World State of genetically modified citizens.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    genre: "Fantasy",
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    summary: "A series of seven fantasy novels set in the magical land of Narnia.",
    language: "English",
    format: "hardcover",
    rating: 5
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    summary: "A science fiction epic set in the distant future amidst a feudal interstellar society.",
    language: "English",
    format: "paperback",
    rating: 5
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    genre: "Fiction",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A story of friendship, betrayal, and redemption set in Afghanistan.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "Life of Pi",
    author: "Yann Martel",
    genre: "Adventure",
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "The story of a young man who survives a shipwreck and is stranded on a boat with a Bengal tiger.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    summary: "A mystery thriller following symbologist Robert Langdon as he investigates a murder.",
    language: "English",
    format: "paperback",
    rating: 4
  },
  {
    title: "Sherlock Holmes: Complete Stories",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    summary: "The complete collection of Sherlock Holmes detective stories.",
    language: "English",
    format: "hardcover",
    rating: 5
  }
];

async function addMoreBooks() {
  try {
    console.log('🔗 Connected to MongoDB\n');
    
    // Add additional books
    const result = await Book.insertMany(additionalBooks);
    console.log(`✅ Added ${result.length} additional books to the database\n`);
    
    // Display added books
    result.forEach((book, index) => {
      console.log(`📚 "${book.title}" by ${book.author}`);
      console.log(`   Genre: ${book.genre} | Available: ${book.availableQuantity}`);
    });
    
    // Show total count
    const totalBooks = await Book.countDocuments();
    console.log(`\n📊 Total books in database: ${totalBooks}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding books:', error);
    process.exit(1);
  }
}

// Run the function
addMoreBooks();
