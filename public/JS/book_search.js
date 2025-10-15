// Search form functionality
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const searchInput = document.getElementById("searchInput").value.trim();
  const errorMsg = document.getElementById("error-message");

  if (searchInput.length < 3) {
    errorMsg.textContent = "Please enter at least 3 characters to search.";
    return;
  }

  errorMsg.textContent = "";
  searchBooks(searchInput);
});

// Browse all books functionality
document.getElementById("browseAllBtn").addEventListener("click", function (e) {
  e.preventDefault();
  browseAllBooks();
});

// Clear results functionality
document.getElementById("clearResults").addEventListener("click", function (e) {
  e.preventDefault();
  clearResults();
});

// Function to search books
async function searchBooks(searchTerm) {
  try {
    console.log("Searching books with term:", searchTerm);
    
    // Call the backend search API
    const response = await fetch(`/api/auth/books/search?query=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    
    if (result.success) {
      const formattedBooks = result.books.map(formatBookForDisplay);
      displayResults(formattedBooks, `Search Results for "${searchTerm}"`);
    } else {
      showError(result.message || 'Failed to search books.');
    }
  } catch (error) {
    console.error('Search error:', error);
    showError('Failed to search books. Please try again.');
  }
}

// Function to browse all books
async function browseAllBooks() {
  try {
    console.log('Loading all books from database...');
    
    // Call the backend API to get all books
    const response = await fetch('/api/auth/books');
    const result = await response.json();
    
    if (result.success) {
      const formattedBooks = result.books.map(formatBookForDisplay);
      displayResults(formattedBooks, 'All Available Books');
    } else {
      showError(result.message || 'Failed to load books.');
    }
  } catch (error) {
    console.error('Browse error:', error);
    showError('Failed to load books. Please try again.');
  }
}

// Function to format book data from database for display
function formatBookForDisplay(dbBook) {
  return {
    _id: dbBook._id,
    title: dbBook.title,
    author: dbBook.author,
    year: dbBook.publicationYear || 'N/A',
    pages: dbBook.pages || 'N/A',
    genre: dbBook.genre,
    isbn: dbBook.isbn || 'N/A',
    available: dbBook.availableQuantity > 0,
    availableCount: dbBook.availableQuantity,
    totalCount: dbBook.totalQuantity,
    summary: dbBook.summary,
    language: dbBook.language,
    format: dbBook.format,
    rating: dbBook.rating,
    cover: dbBook.coverImage || generateBookCoverUrl(dbBook.title, dbBook.author)
  };
}

// Function to generate book cover URL from Open Library API
function generateBookCoverUrl(title, author) {
  // Try to get a cover from Open Library based on title and author
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  
  // Use a better book cover service with real book images when possible
  const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${generateISBN(title)}-M.jpg`;
  const fallbackUrl = `https://via.placeholder.com/150x200/4a90e2/ffffff?text=${encodeURIComponent(title.substring(0, 15))}`;
  
  // Return the fallback for now (you can implement Open Library API integration later)
  return fallbackUrl;
}

// Helper function to generate a mock ISBN for demonstration
function generateISBN(title) {
  // This is just for demonstration - in a real system you'd have actual ISBNs
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash).toString().substring(0, 10);
}

// Function to display results
function displayResults(books, title) {
  const resultsContainer = document.getElementById('results-container');
  const resultsList = document.getElementById('results-list');
  const resultsTitle = document.getElementById('results-title');
  const noResults = document.getElementById('no-results');
  const errorMsg = document.getElementById('error-message');

  // Clear previous results and errors
  errorMsg.textContent = '';
  resultsContainer.style.display = 'block';
  resultsTitle.textContent = title;

  if (books && books.length > 0) {
    noResults.style.display = 'none';
    resultsList.innerHTML = books.map(book => createBookCard(book)).join('');
  } else {
    resultsList.innerHTML = '';
    noResults.style.display = 'block';
  }
}

// Function to create a book card HTML (improved styling to look like real book covers)
function createBookCard(book) {
  const statusClass = book.available ? 'available' : 'unavailable';
  const statusText = book.available ? 'Available' : 'Out of Stock';
  const statusIcon = book.available ? '✅' : '❌';
  const availabilityCount = book.available ? `${book.availableCount || 1} available` : 'Out of stock';
  
  // Generate a better book cover with gradient background
  const gradientColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
  ];
  
  const colorIndex = (book.title.charCodeAt(0) + book.author.charCodeAt(0)) % gradientColors.length;
  const bookCoverStyle = book.cover && book.cover.startsWith('http') ? 
    `background-image: url('${book.cover}'); background-size: cover; background-position: center;` :
    `background: ${gradientColors[colorIndex]};`;

  return `
    <div class="book-card modern-book-card">
      <div class="book-cover-container">
        <div class="book-cover" style="${bookCoverStyle}">
          ${!book.cover || !book.cover.startsWith('http') ? `
            <div class="book-spine">
              <div class="book-title-spine">${book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title}</div>
              <div class="book-author-spine">${book.author.split(' ').pop()}</div>
            </div>
          ` : ''}
          <div class="book-availability-overlay ${statusClass}">
            <span class="availability-badge">${statusIcon}</span>
          </div>
        </div>
        <div class="book-shadow"></div>
      </div>
      
      <div class="book-info-card">
        <h4 class="book-title" title="${book.title}">${book.title.length > 30 ? book.title.substring(0, 30) + '...' : book.title}</h4>
        <p class="book-author">by ${book.author}</p>
        
        <div class="book-metadata">
          <span class="book-genre-tag">${book.genre || 'General'}</span>
          ${book.year && book.year !== 'N/A' ? `<span class="book-year-tag">${book.year}</span>` : ''}
        </div>
        
        <div class="book-availability-info ${statusClass}">
          <span class="availability-text">${availabilityCount}</span>
        </div>
        
        <div class="book-actions">
          <button class="btn-view-details" onclick="viewBookDetails('${book._id || book.isbn}')" title="View full details">
            👁️ Details
          </button>
          ${book.available ? 
            `<button class="btn-borrow" onclick="borrowBookWithAuth('${book._id || book.isbn}', '${book.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}', '${book.author.replace(/'/g, "\\'").replace(/"/g, '\\"')}')" title="Borrow this book">
              📥 Borrow
            </button>` : 
            `<button class="btn-reserve disabled" onclick="reserveBook('${book._id || book.isbn}')" title="Book currently unavailable">
              ⏰ Reserve
            </button>`
          }
        </div>
      </div>
    </div>
  `;
}

// Function to view book details
function viewBookDetails(bookId) {
  window.location.href = `/HTML/book.html?id=${bookId}`;
}

// Function to borrow a book with authentication check
function borrowBookWithAuth(bookId, bookTitle, bookAuthor) {
  // Check if user is logged in using AuthUtils
  if (!AuthUtils.requireAuth('borrow books')) {
    return; // AuthUtils will handle the login modal
  }
  
  // User is authenticated, proceed with borrowing
  borrowBook(bookId, bookTitle, bookAuthor);
}

// Function to borrow a book (updated to accept parameters directly)
function borrowBook(bookId, bookTitle = null, bookAuthor = null) {
  // If title and author not provided, find from DOM (fallback)
  if (!bookTitle || !bookAuthor) {
    const bookCard = document.querySelector(`[onclick*="${bookId}"]`).closest('.book-card');
    if (bookCard) {
      bookTitle = bookCard.querySelector('.book-title').textContent;
      bookAuthor = bookCard.querySelector('.book-author').textContent.replace('by ', '');
    } else {
      console.error('Could not find book information');
      return;
    }
  }
  
  // Pass book information via URL parameters
  const params = new URLSearchParams({
    bookId: bookId,
    bookTitle: bookTitle,
    bookAuthor: bookAuthor
  });
  
  window.location.href = `/HTML/borrow.html?${params.toString()}`;
}

// Function to reserve a book
function reserveBook(bookId) {
  alert(`Reserve functionality for book ${bookId} will be implemented soon!`);
}

// Function to clear results
function clearResults() {
  const resultsContainer = document.getElementById('results-container');
  const resultsList = document.getElementById('results-list');
  const errorMsg = document.getElementById('error-message');
  
  resultsContainer.style.display = 'none';
  resultsList.innerHTML = '';
  errorMsg.textContent = '';
}

// Function to show error messages
function showError(message) {
  const errorMsg = document.getElementById('error-message');
  errorMsg.textContent = message;
  errorMsg.style.color = 'red';
}

// Mock data for displaying books when API is not available
const mockBooks = [
  {
    _id: "book1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    pages: 281,
    genre: "Fiction",
    isbn: "9780061120084",
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8231488-L.jpg"
  },
  {
    _id: "book2",
    title: "1984",
    author: "George Orwell",
    year: 1949,
    pages: 328,
    genre: "Dystopian",
    isbn: "9780451524935",
    available: false,
    cover: "https://covers.openlibrary.org/b/id/9280433-L.jpg"
  },
  {
    _id: "book3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    pages: 180,
    genre: "Fiction",
    isbn: "9780743273565",
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8152965-L.jpg"
  },
  {
    _id: "book4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    pages: 279,
    genre: "Romance",
    isbn: "9780141439518",
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8479104-L.jpg"
  },
  {
    _id: "book5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    pages: 310,
    genre: "Fantasy",
    isbn: "9780618260300",
    available: false,
    cover: "https://covers.openlibrary.org/b/id/8323742-L.jpg"
  },
  {
    _id: "book6",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    year: 1997,
    pages: 223,
    genre: "Fantasy",
    isbn: "9780747532743",
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8574731-L.jpg"
  }
];

// Display mock search results
function displayMockSearchResults(searchTerm) {
  const filteredBooks = mockBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );
  
  displayResults(filteredBooks, `Search Results for "${searchTerm}"`);
}

// Display mock all books
function displayMockAllBooks() {
  displayResults(mockBooks, 'All Available Books');
}
