const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Admin = require('./models/Admin');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/libraryDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB: libraryDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Admin accounts data
const adminAccounts = [
  {
    username: 'admin',
    password: 'admin123',
    fullName: 'System Administrator',
    email: 'admin@library.edu',
    role: 'super_admin',
    isActive: true,
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: true,
      canViewReports: true,
      canManageAdmins: true
    }
  },
  {
    username: 'librarian',
    password: 'lib123',
    fullName: 'Head Librarian',
    email: 'librarian@library.edu',
    role: 'librarian',
    isActive: true,
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: false,
      canViewReports: true,
      canManageAdmins: false
    }
  },
  {
    username: 'manager',
    password: 'manager123',
    fullName: 'Library Manager',
    email: 'manager@library.edu',
    role: 'manager',
    isActive: true,
    permissions: {
      canManageBooks: true,
      canViewUsers: true,
      canManageUsers: true,
      canViewReports: true,
      canManageAdmins: false
    }
  }
];

// Books collection data with cover images
const booksData = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780061120084',
    genre: 'Fiction',
    publicationYear: 1988,
    publisher: 'HarperOne',
    pages: 163,
    language: 'English',
    format: 'paperback',
    totalQuantity: 5,
    availableQuantity: 5,
    borrowedQuantity: 0,
    rating: 4.5,
    summary: 'A philosophical novel about following your dreams and finding your personal legend.',
    description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.',
    coverImage: 'https://covers.openlibrary.org/b/id/8681707-L.jpg',
    location: { shelf: 'A1', section: 'Fiction' },
    borrowHistory: []
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    genre: 'Fiction',
    publicationYear: 1960,
    publisher: 'J.B. Lippincott & Co.',
    pages: 281,
    language: 'English',
    format: 'hardcover',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 4.8,
    summary: 'A classic novel about racial injustice and childhood in the American South.',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. As Tom Robinson stands trial for rape, Scout Finch comes of age in a world of prejudice and inequality.',
    coverImage: 'https://covers.openlibrary.org/b/id/8231488-L.jpg',
    location: { shelf: 'A2', section: 'Classics' },
    borrowHistory: []
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    genre: 'Dystopian Fiction',
    publicationYear: 1949,
    publisher: 'Secker & Warburg',
    pages: 328,
    language: 'English',
    format: 'paperback',
    totalQuantity: 6,
    availableQuantity: 6,
    borrowedQuantity: 0,
    rating: 4.7,
    summary: 'A dystopian novel about totalitarianism and surveillance.',
    description: 'A haunting tale of courage and conscience, of rebellion and conformity. Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. But with a fateful meeting with Julia, Winston awakens to the truth behind the Party\'s power.',
    coverImage: 'https://covers.openlibrary.org/b/id/9280433-L.jpg',
    location: { shelf: 'B1', section: 'Science Fiction' },
    borrowHistory: []
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    genre: 'Romance',
    publicationYear: 1813,
    publisher: 'T. Egerton',
    pages: 279,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 4.6,
    summary: 'A classic romance novel about Elizabeth Bennet and Mr. Darcy.',
    description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print."',
    coverImage: 'https://covers.openlibrary.org/b/id/8479104-L.jpg',
    location: { shelf: 'C1', section: 'Romance' },
    borrowHistory: []
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    genre: 'Fiction',
    publicationYear: 1925,
    publisher: 'Charles Scribner\'s Sons',
    pages: 180,
    language: 'English',
    format: 'hardcover',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 4.2,
    summary: 'A novel about the Jazz Age and the American Dream.',
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession."',
    coverImage: 'https://covers.openlibrary.org/b/id/8152965-L.jpg',
    location: { shelf: 'A3', section: 'Classics' },
    borrowHistory: []
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '9780747532743',
    genre: 'Fantasy',
    publicationYear: 1997,
    publisher: 'Bloomsbury',
    pages: 223,
    language: 'English',
    format: 'hardcover',
    totalQuantity: 6,
    availableQuantity: 6,
    borrowedQuantity: 0,
    rating: 4.9,
    summary: 'The first book in the Harry Potter series about a young wizard.',
    description: 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified Harry will learn that he\'s a wizard, just as his parents were.',
    coverImage: 'https://covers.openlibrary.org/b/id/8574731-L.jpg',
    location: { shelf: 'D1', section: 'Fantasy' },
    borrowHistory: []
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780618260300',
    genre: 'Fantasy',
    publicationYear: 1937,
    publisher: 'George Allen & Unwin',
    pages: 310,
    language: 'English',
    format: 'paperback',
    totalQuantity: 5,
    availableQuantity: 5,
    borrowedQuantity: 0,
    rating: 4.7,
    summary: 'A tale of Bilbo Baggins and his unexpected journey to the Lonely Mountain.',
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.',
    coverImage: 'https://covers.openlibrary.org/b/id/8323742-L.jpg',
    location: { shelf: 'D2', section: 'Fantasy' },
    borrowHistory: []
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441013593',
    genre: 'Science Fiction',
    publicationYear: 1965,
    publisher: 'Chilton Books',
    pages: 688,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 4.5,
    summary: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides and his rise to power.',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236161-L.jpg',
    location: { shelf: 'B2', section: 'Science Fiction' },
    borrowHistory: []
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769174',
    genre: 'Fiction',
    publicationYear: 1951,
    publisher: 'Little, Brown and Company',
    pages: 277,
    language: 'English',
    format: 'paperback',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 3.8,
    summary: 'A coming-of-age story about Holden Caulfield\'s experiences in New York.',
    description: 'The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236986-L.jpg',
    location: { shelf: 'A4', section: 'Fiction' },
    borrowHistory: []
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    genre: 'History',
    publicationYear: 2011,
    publisher: 'Harvill Secker',
    pages: 443,
    language: 'English',
    format: 'paperback',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 4.4,
    summary: 'A thought-provoking exploration of how Homo sapiens came to dominate the world.',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    coverImage: 'https://covers.openlibrary.org/b/id/8680777-L.jpg',
    location: { shelf: 'E1', section: 'Non-Fiction' },
    borrowHistory: []
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    isbn: '9781594631931',
    genre: 'Fiction',
    publicationYear: 2003,
    publisher: 'Riverhead Books',
    pages: 371,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 4.3,
    summary: 'A story of friendship, betrayal, and redemption set in Afghanistan.',
    description: 'Against the backdrop of a country in the process of being destroyed, The Kite Runner became a phenomenon, the first Afghan novel to attract a global audience. This is a beautiful, devastating, heart-wrenching tale.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236890-L.jpg',
    location: { shelf: 'A5', section: 'Fiction' },
    borrowHistory: []
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    isbn: '9780571056866',
    genre: 'Fiction',
    publicationYear: 1954,
    publisher: 'Faber & Faber',
    pages: 224,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 3.7,
    summary: 'A novel about a group of British boys stranded on a deserted island.',
    description: 'At the dawn of the next world war, a plane crashes on an uncharted island, stranding a group of schoolboys. At first, with no adult supervision, their freedom is something to celebrate. This far from civilization they can do anything they want.',
    coverImage: 'https://covers.openlibrary.org/b/id/8371065-L.jpg',
    location: { shelf: 'A6', section: 'Classics' },
    borrowHistory: []
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '9780060850524',
    genre: 'Science Fiction',
    publicationYear: 1932,
    publisher: 'Chatto & Windus',
    pages: 268,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 3.9,
    summary: 'A dystopian novel set in a futuristic World State of genetically modified citizens.',
    description: 'Aldous Huxley\'s profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236806-L.jpg',
    location: { shelf: 'B3', section: 'Science Fiction' },
    borrowHistory: []
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    isbn: '9780307474278',
    genre: 'Mystery',
    publicationYear: 2003,
    publisher: 'Doubleday',
    pages: 489,
    language: 'English',
    format: 'paperback',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 3.8,
    summary: 'A mystery thriller following symbologist Robert Langdon as he investigates a murder.',
    description: 'An ingenious code hidden in the works of Leonardo da Vinci. A desperate race through the cathedrals and castles of Europe. An astonishing truth concealed for centuries... unveiled at last.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236907-L.jpg',
    location: { shelf: 'F1', section: 'Mystery' },
    borrowHistory: []
  },
  {
    title: 'Life of Pi',
    author: 'Yann Martel',
    isbn: '9780156027328',
    genre: 'Adventure',
    publicationYear: 2001,
    publisher: 'Knopf Canada',
    pages: 319,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 3.9,
    summary: 'The story of a young man who survives a shipwreck and is stranded on a boat with a Bengal tiger.',
    description: 'Life of Pi is a fantasy adventure novel by Yann Martel published in 2001. The protagonist, Piscine Molitor "Pi" Patel, an Indian boy from Pondicherry, explores issues of spirituality and practicality from an early age.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236932-L.jpg',
    location: { shelf: 'G1', section: 'Adventure' },
    borrowHistory: []
  },
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    isbn: '9780060883287',
    genre: 'Magical Realism',
    publicationYear: 1967,
    publisher: 'Editorial Sudamericana',
    pages: 417,
    language: 'English',
    format: 'paperback',
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    rating: 4.1,
    summary: 'The multi-generational story of the Buendía family in the town of Macondo.',
    description: 'One Hundred Years of Solitude tells the story of the rise and fall, birth and death of the mythical town of Macondo through the history of the Buendía family.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236961-L.jpg',
    location: { shelf: 'H1', section: 'Literature' },
    borrowHistory: []
  },
  {
    title: 'Sherlock Holmes: Complete Stories',
    author: 'Arthur Conan Doyle',
    isbn: '9780553212419',
    genre: 'Mystery',
    publicationYear: 1892,
    publisher: 'George Newnes',
    pages: 1040,
    language: 'English',
    format: 'hardcover',
    totalQuantity: 2,
    availableQuantity: 2,
    borrowedQuantity: 0,
    rating: 4.6,
    summary: 'The complete collection of Sherlock Holmes detective stories.',
    description: 'All four novels and fifty-six short stories featuring the world\'s most famous detective, Sherlock Holmes, and his loyal friend Dr. Watson.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236944-L.jpg',
    location: { shelf: 'F2', section: 'Mystery' },
    borrowHistory: []
  },
  {
    title: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
    isbn: '9780066238501',
    genre: 'Fantasy',
    publicationYear: 1950,
    publisher: 'Geoffrey Bles',
    pages: 767,
    language: 'English',
    format: 'hardcover',
    totalQuantity: 4,
    availableQuantity: 4,
    borrowedQuantity: 0,
    rating: 4.2,
    summary: 'A series of seven fantasy novels set in the magical land of Narnia.',
    description: 'The Chronicles of Narnia is a series of seven fantasy novels by British author C.S. Lewis. It is considered a classic of children\'s literature and is the author\'s best-known work.',
    coverImage: 'https://covers.openlibrary.org/b/id/8397277-L.jpg',
    location: { shelf: 'D3', section: 'Fantasy' },
    borrowHistory: []
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Self-Help',
    publicationYear: 2018,
    publisher: 'Avery',
    pages: 320,
    language: 'English',
    format: 'paperback',
    totalQuantity: 5,
    availableQuantity: 5,
    borrowedQuantity: 0,
    rating: 4.4,
    summary: 'A guide to building good habits and breaking bad ones.',
    description: 'Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    coverImage: 'https://covers.openlibrary.org/b/id/10958382-L.jpg',
    location: { shelf: 'I1', section: 'Self-Help' },
    borrowHistory: []
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    isbn: '9781577314806',
    genre: 'Spirituality',
    publicationYear: 1997,
    publisher: 'Namaste Publishing',
    pages: 236,
    language: 'English',
    format: 'paperback',
    totalQuantity: 3,
    availableQuantity: 3,
    borrowedQuantity: 0,
    rating: 4.1,
    summary: 'A guide to spiritual enlightenment and living in the present moment.',
    description: 'The Power of Now shows you that every minute you spend worrying about the future or regretting the past is a minute lost, because really all you have to live in is the present, the now.',
    coverImage: 'https://covers.openlibrary.org/b/id/8236975-L.jpg',
    location: { shelf: 'I2', section: 'Spirituality' },
    borrowHistory: []
  }
];

// Sample user accounts for testing
const sampleUsers = [
  {
    name: 'John Doe',
    studentId: 'STU001',
    email: 'john.doe@student.edu',
    password: 'student123',
    totalBooksBorrowed: 0,
    totalBooksReturned: 0,
    currentlyBorrowed: 0,
    borrowedBooks: []
  },
  {
    name: 'Jane Smith',
    studentId: 'STU002',
    email: 'jane.smith@student.edu',
    password: 'student123',
    totalBooksBorrowed: 0,
    totalBooksReturned: 0,
    currentlyBorrowed: 0,
    borrowedBooks: []
  },
  {
    name: 'Mike Johnson',
    studentId: 'STU003',
    email: 'mike.johnson@student.edu',
    password: 'student123',
    totalBooksBorrowed: 0,
    totalBooksReturned: 0,
    currentlyBorrowed: 0,
    borrowedBooks: []
  }
];

// Function to clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Book.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️ Cleared existing database records');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

// Function to seed admin accounts
const seedAdmins = async () => {
  try {
    console.log('👨‍💼 Seeding admin accounts...');
    
    for (const adminData of adminAccounts) {
      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ Created admin: ${adminData.username} (${adminData.role})`);
    }
    
    console.log(`🎉 Successfully created ${adminAccounts.length} admin accounts`);
  } catch (error) {
    console.error('❌ Error seeding admins:', error);
  }
};

// Function to seed books
const seedBooks = async () => {
  try {
    console.log('📚 Seeding books collection...');
    
    for (const bookData of booksData) {
      const book = new Book(bookData);
      await book.save();
      console.log(`✅ Added book: "${bookData.title}" by ${bookData.author}`);
    }
    
    console.log(`🎉 Successfully added ${booksData.length} books to the library`);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  }
};

// Function to seed sample users
const seedUsers = async () => {
  try {
    console.log('👥 Seeding sample user accounts...');
    
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.studentId})`);
    }
    
    console.log(`🎉 Successfully created ${sampleUsers.length} sample user accounts`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

// Main execution function
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding process...\n');
  
  await connectDB();
  
  console.log('⚠️  WARNING: This will clear all existing data!');
  console.log('⏳ Starting in 3 seconds...\n');
  
  // Wait 3 seconds before proceeding
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await clearDatabase();
  console.log('');
  
  await seedAdmins();
  console.log('');
  
  await seedBooks();
  console.log('');
  
  await seedUsers();
  console.log('');
  
  console.log('✨ Database seeding completed successfully!');
  console.log('\n📋 SUMMARY:');
  console.log(`👨‍💼 Admin Accounts: ${adminAccounts.length}`);
  console.log(`📚 Books: ${booksData.length}`);
  console.log(`👥 Sample Users: ${sampleUsers.length}`);
  
  console.log('\n🔐 ADMIN LOGIN CREDENTIALS:');
  adminAccounts.forEach(admin => {
    console.log(`   Username: ${admin.username} | Password: ${admin.password} | Role: ${admin.role}`);
  });
  
  console.log('\n👥 SAMPLE USER CREDENTIALS:');
  sampleUsers.forEach(user => {
    console.log(`   Student ID: ${user.studentId} | Password: ${user.password} | Name: ${user.name}`);
  });
  
  console.log('\n🚀 Your library system is now ready to use!');
  
  process.exit(0);
};

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Execute the seeding
seedDatabase();
