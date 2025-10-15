// add-books-with-covers.js
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');

const booksWithCovers = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    isbn: "9780061120084",
    publisher: "HarperCollins",
    publicationYear: 1960,
    pages: 281,
    totalQuantity: 5,
    availableQuantity: 4,
    borrowedQuantity: 1,
    summary: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film.",
    language: "English",
    format: "paperback",
    rating: 4.3,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    location: {
      shelf: "A-1",
      section: "Fiction"
    }
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    isbn: "9780451524935",
    publisher: "Signet Classics",
    publicationYear: 1949,
    pages: 328,
    totalQuantity: 4,
    availableQuantity: 3,
    borrowedQuantity: 1,
    summary: "A dystopian social science fiction novel about totalitarianism and the effects of authoritarianism on individual freedom.",
    description: "Winston Smith works for the Ministry of Truth in London, chief city of Airstrip One. Big Brother stares out from every poster, the Thought Police uncover every act of betrayal. When Winston finds love with Julia, he discovers that life does not have to be dull and deadening, and awakens to new possibilities.",
    language: "English",
    format: "paperback",
    rating: 4.2,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    location: {
      shelf: "A-2",
      section: "Fiction"
    }
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "9780141439518",
    publisher: "Penguin Classics",
    publicationYear: 1813,
    pages: 279,
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A romantic novel about the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments.",
    description: "When Elizabeth Bennet meets the proud and seemingly arrogant Mr. Darcy, she is repelled by his character. But as she learns more about his true nature, she realizes she has been blind to his virtues and begins to question her own character.",
    language: "English",
    format: "paperback",
    rating: 4.1,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    location: {
      shelf: "A-3",
      section: "Romance"
    }
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    isbn: "9780743273565",
    publisher: "Scribner",
    publicationYear: 1925,
    pages: 180,
    totalQuantity: 4,
    availableQuantity: 2,
    borrowedQuantity: 2,
    summary: "A classic American novel depicting the excess and moral emptiness of the Jazz Age through the eyes of narrator Nick Carraway.",
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted gin was the national drink and sex the national obsession.",
    language: "English",
    format: "hardcover",
    rating: 3.9,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    location: {
      shelf: "A-4",
      section: "Fiction"
    }
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    isbn: "9780747532743",
    publisher: "Bloomsbury",
    publicationYear: 1997,
    pages: 223,
    totalQuantity: 6,
    availableQuantity: 4,
    borrowedQuantity: 2,
    summary: "The first novel in the Harry Potter series, following a young wizard's journey at Hogwarts School of Witchcraft and Wizardry.",
    description: "Harry Potter has never played a sport while flying on a broomstick. He's never worn a cloak of invisibility, befriended a giant, or helped hatch a dragon. All Harry knows is a miserable life with the Dursleys until the day he receives a letter that changes everything.",
    language: "English",
    format: "hardcover",
    rating: 4.5,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780747532743-L.jpg",
    location: {
      shelf: "B-1",
      section: "Fantasy"
    }
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "9780547928227",
    publisher: "Houghton Mifflin Harcourt",
    publicationYear: 1937,
    pages: 310,
    totalQuantity: 3,
    availableQuantity: 1,
    borrowedQuantity: 2,
    summary: "A classic fantasy adventure about Bilbo Baggins' unexpected journey with thirteen dwarves and the wizard Gandalf.",
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling further than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep to take him on an adventure.",
    language: "English",
    format: "paperback",
    rating: 4.3,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    location: {
      shelf: "B-2",
      section: "Fantasy"
    }
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    isbn: "9780441172719",
    publisher: "Ace Books",
    publicationYear: 1965,
    pages: 688,
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    summary: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and his rise to power in a universe of political intrigue.",
    description: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    language: "English",
    format: "paperback",
    rating: 4.2,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
    location: {
      shelf: "C-1",
      section: "Science Fiction"
    }
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    isbn: "9780316769488",
    publisher: "Little, Brown and Company",
    publicationYear: 1951,
    pages: 277,
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    summary: "A controversial and influential coming-of-age story narrated by the cynical teenager Holden Caulfield.",
    description: "The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the phoniness of the adult world.",
    language: "English",
    format: "paperback",
    rating: 3.8,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
    location: {
      shelf: "A-5",
      section: "Fiction"
    }
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    genre: "Magical Realism",
    isbn: "9780060883287",
    publisher: "Harper Perennial Modern Classics",
    publicationYear: 1967,
    pages: 417,
    totalQuantity: 2,
    availableQuantity: 1,
    borrowedQuantity: 1,
    summary: "The multi-generational story of the Buendía family, whose patriarch founded the town of Macondo.",
    description: "One Hundred Years of Solitude tells the story of the rise and fall, birth and death of the mythical town of Macondo through the history of the Buendía family. Inventive, amusing, magnetic, sad, and alive with unforgettable men and women.",
    language: "English",
    format: "paperback",
    rating: 4.0,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
    location: {
      shelf: "D-1",
      section: "World Literature"
    }
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    isbn: "9780062316110",
    publisher: "Harper",
    publicationYear: 2014,
    pages: 443,
    totalQuantity: 4,
    availableQuantity: 3,
    borrowedQuantity: 1,
    summary: "A thought-provoking exploration of how Homo sapiens came to dominate the world and what our future might hold.",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be human.",
    language: "English",
    format: "paperback",
    rating: 4.4,
    coverImage: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg",
    location: {
      shelf: "E-1",
      section: "Non-Fiction"
    }
  }
];

async function addBooksWithCovers() {
  try {
    console.log('🔗 Connected to MongoDB: libraryDB');
    console.log('📚 Adding books with cover images and detailed information...\n');

    // Clear existing books first (optional)
    // await Book.deleteMany({});
    // console.log('🗑️ Cleared existing books');

    // Add new books
    for (const bookData of booksWithCovers) {
      try {
        // Check if book already exists
        const existing = await Book.findOne({ isbn: bookData.isbn });
        
        if (existing) {
          console.log(`⚠️ Book "${bookData.title}" already exists, updating...`);
          await Book.findByIdAndUpdate(existing._id, bookData);
          console.log(`✅ Updated: "${bookData.title}"`);
        } else {
          const book = new Book(bookData);
          await book.save();
          console.log(`✅ Added: "${bookData.title}" by ${bookData.author}`);
        }
      } catch (err) {
        console.error(`❌ Error adding "${bookData.title}":`, err.message);
      }
    }

    console.log('\n🎉 Successfully processed all books!');
    console.log('📊 Summary:');
    
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableQuantity' } } }
    ]);
    const borrowedBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$borrowedQuantity' } } }
    ]);

    console.log(`   📚 Total book titles: ${totalBooks}`);
    console.log(`   📖 Available copies: ${availableBooks[0]?.total || 0}`);
    console.log(`   📥 Borrowed copies: ${borrowedBooks[0]?.total || 0}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the function
addBooksWithCovers();
