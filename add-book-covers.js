const mongoose = require('mongoose');
const Book = require('./models/Book');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');
    console.log('✅ Connected to MongoDB: libraryDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Book cover URLs mapping
const bookCoverUrls = {
  'The Alchemist': 'https://covers.openlibrary.org/b/id/8681707-L.jpg',
  'To Kill a Mockingbird': 'https://covers.openlibrary.org/b/id/8231488-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/id/9280433-L.jpg',
  'Pride and Prejudice': 'https://covers.openlibrary.org/b/id/8479104-L.jpg',
  'The Great Gatsby': 'https://covers.openlibrary.org/b/id/8152965-L.jpg',
  'Harry Potter and the Sorcerer\'s Stone': 'https://covers.openlibrary.org/b/id/8574731-L.jpg',
  'Harry Potter and the Philosopher\'s Stone': 'https://covers.openlibrary.org/b/id/8574731-L.jpg',
  'The Catcher in the Rye': 'https://covers.openlibrary.org/b/id/8236986-L.jpg',
  'Lord of the Flies': 'https://covers.openlibrary.org/b/id/8371065-L.jpg',
  'The Hobbit': 'https://covers.openlibrary.org/b/id/8323742-L.jpg',
  'Brave New World': 'https://covers.openlibrary.org/b/id/8236806-L.jpg',
  'The Chronicles of Narnia': 'https://covers.openlibrary.org/b/id/8397277-L.jpg',
  'Dune': 'https://covers.openlibrary.org/b/id/8236161-L.jpg',
  'The Kite Runner': 'https://covers.openlibrary.org/b/id/8236890-L.jpg',
  'Life of Pi': 'https://covers.openlibrary.org/b/id/8236932-L.jpg',
  'The Da Vinci Code': 'https://covers.openlibrary.org/b/id/8236907-L.jpg',
  'Sherlock Holmes: Complete Stories': 'https://covers.openlibrary.org/b/id/8236944-L.jpg',
  'One Hundred Years of Solitude': 'https://covers.openlibrary.org/b/id/8236961-L.jpg',
  'Sapiens: A Brief History of Humankind': 'https://covers.openlibrary.org/b/id/8680777-L.jpg'
};

// Function to add cover images to books
const addBookCovers = async () => {
  try {
    console.log('📚 Adding cover images to books...\n');
    
    const books = await Book.find();
    let updatedCount = 0;
    
    for (const book of books) {
      const coverUrl = bookCoverUrls[book.title];
      
      if (coverUrl && !book.coverImage) {
        await Book.updateOne(
          { _id: book._id },
          { $set: { coverImage: coverUrl } }
        );
        console.log(`✅ Added cover image for "${book.title}"`);
        updatedCount++;
      } else if (book.coverImage) {
        console.log(`⏭️  "${book.title}" already has a cover image`);
      } else {
        console.log(`❓ No cover image found for "${book.title}"`);
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} books with cover images!`);
    
  } catch (error) {
    console.error('❌ Error adding cover images:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addBookCovers();
  
  console.log('\n✨ Cover image update complete!');
  process.exit(0);
};

main();
