// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeMainPage();
  initializeFeaturedBooks();
});

// Show modal only if user is not logged in (legacy function for compatibility)
window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const modal = document.getElementById("entryModal");

  if (!isLoggedIn && modal) {
    modal.style.display = "flex";
  } else if (modal) {
    modal.style.display = "none";
  }
};

// Initialize main page functionality
function initializeMainPage() {
  // Any other main page initialization can go here
}

// Simulate login success
function goToLogin() {
  // Replace this with real login validation logic
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "main.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

// For manual logout (optional button/event)
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "main.html"; // Reloads and shows popup again
}

// ============= FEATURED BOOKS CAROUSEL FUNCTIONALITY =============

// Initialize featured books with proper book IDs from database
async function initializeFeaturedBooks() {
  try {
    // Fetch all books from database to get proper IDs
    const response = await fetch('/api/auth/books');
    const result = await response.json();
    
    if (result.success && result.books) {
      // Define featured book titles (these should match books in your database)
      const featuredTitles = [
        'The Alchemist',
        'Sapiens: A Brief History of Humankind', 
        'The Great Gatsby',
        'Harry Potter and the Philosopher\'s Stone',
        'Pride and Prejudice'
      ];
      
      // Find corresponding books in database
      const featuredBooks = [];
      featuredTitles.forEach(title => {
        const book = result.books.find(b => 
          b.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(b.title.toLowerCase())
        );
        if (book) {
          featuredBooks.push(book);
        }
      });
      
      // If we found books, update the carousel
      if (featuredBooks.length > 0) {
        updateFeaturedBooksCarousel(featuredBooks);
      } else {
        // Fallback: use first 5 books from database
        updateFeaturedBooksCarousel(result.books.slice(0, 5));
      }
    }
  } catch (error) {
    console.error('Error loading featured books:', error);
    // Keep the default carousel if API fails
  }
}

// Update the featured books carousel with actual book data
function updateFeaturedBooksCarousel(books) {
  const carouselContainer = document.querySelector('.carousel-container');
  if (!carouselContainer) return;
  
  // Clear existing items
  carouselContainer.innerHTML = '';
  
  // Add new items with proper book details
  books.forEach(book => {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item featured-book-item';
    carouselItem.onclick = () => viewFeaturedBookDetails(book._id);
    
    // Create book card content
    carouselItem.innerHTML = `
      <div class="featured-book-card">
        <div class="featured-book-cover">
          <img src="${book.coverImage || getBookCoverFallback(book.title, book.author)}" 
               alt="${book.title}" 
               onerror="this.src='${getBookCoverFallback(book.title, book.author)}'">
        </div>
        <div class="featured-book-info">
          <h4>"${book.title}"</h4>
          <p>by ${book.author}</p>
          <span class="featured-availability ${book.availableQuantity > 0 ? 'available' : 'unavailable'}">
            ${book.availableQuantity > 0 ? '✅ Available' : '❌ Out of Stock'}
          </span>
        </div>
      </div>
    `;
    
    carouselContainer.appendChild(carouselItem);
  });
}

// Generate fallback book cover URL
function getBookCoverFallback(title, author) {
  return `https://via.placeholder.com/120x180/4a90e2/ffffff?text=${encodeURIComponent(title.substring(0, 10))}`;
}

// Navigate to book details page with proper ID
function viewFeaturedBookDetails(bookId) {
  window.location.href = `/HTML/book.html?id=${bookId}`;
}
