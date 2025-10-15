// Global variables
let currentBook = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
  loadBookDetails();
  updateBookPageAuthentication();
});

// Update book page based on authentication status
function updateBookPageAuthentication() {
  const isLoggedIn = AuthUtils.isLoggedIn();
  const borrowBtn = document.getElementById('borrow-btn');
  const reserveBtn = document.getElementById('reserve-btn');
  
  if (!isLoggedIn) {
    // Add visual indicators for non-logged in users
    if (borrowBtn) {
      borrowBtn.title = 'Please log in to borrow books';
      borrowBtn.style.position = 'relative';
    }
    if (reserveBtn) {
      reserveBtn.title = 'Please log in to reserve books';
      reserveBtn.style.position = 'relative';
    }
  }
}

// Load book details from database
async function loadBookDetails() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  
  if (!bookId) {
    showError();
    return;
  }
  
  try {
    showLoading();
    
    // Fetch book details from the database
    const response = await fetch('/api/auth/books');
    const result = await response.json();
    
    if (result.success) {
      const book = result.books.find(b => b._id === bookId);
      
      if (book) {
        currentBook = book;
        displayBookDetails(book);
      } else {
        showError();
      }
    } else {
      showError();
    }
  } catch (error) {
    console.error('Error loading book details:', error);
    showError();
  }
}

// Display book details in the UI
function displayBookDetails(book) {
  hideLoading();
  
  // Book cover
  const coverImg = document.getElementById('book-cover');
  coverImg.src = book.coverImage || '/images/default-book-cover.svg';
  coverImg.onerror = function() {
    this.src = '/images/default-book-cover.svg';
  };
  
  // Book title and author
  document.getElementById('book-title').textContent = book.title;
  document.getElementById('book-author').textContent = `by ${book.author}`;
  
  // Book meta information
  document.getElementById('book-genre').textContent = book.genre || 'General';
  document.getElementById('book-year').textContent = book.publicationYear || 'N/A';
  document.getElementById('book-pages').textContent = book.pages ? `${book.pages} pages` : 'N/A';
  
  // Availability badge
  const availabilityBadge = document.getElementById('availability-badge');
  const availabilityText = document.getElementById('availability-text');
  const borrowBtn = document.getElementById('borrow-btn');
  const reserveBtn = document.getElementById('reserve-btn');
  
  if (book.availableQuantity > 0) {
    availabilityBadge.className = 'availability-badge available';
    availabilityText.textContent = 'Available';
    borrowBtn.style.display = 'inline-block';
    reserveBtn.style.display = 'none';
  } else {
    availabilityBadge.className = 'availability-badge unavailable';
    availabilityText.textContent = 'Out of Stock';
    borrowBtn.style.display = 'none';
    reserveBtn.style.display = 'inline-block';
  }
  
  // Rating
  displayRating(book.rating);
  
  // Summary and description
  document.getElementById('book-summary').textContent = book.summary || 'No summary available for this book.';
  document.getElementById('description-text').textContent = book.description || 'No detailed description available.';
  
  // Details tab
  document.getElementById('detail-title').textContent = book.title;
  document.getElementById('detail-author').textContent = book.author;
  document.getElementById('detail-genre').textContent = book.genre || '-';
  document.getElementById('detail-year').textContent = book.publicationYear || '-';
  document.getElementById('detail-pages').textContent = book.pages || '-';
  document.getElementById('detail-publisher').textContent = book.publisher || '-';
  document.getElementById('detail-isbn').textContent = book.isbn || '-';
  document.getElementById('detail-language').textContent = book.language || 'English';
  document.getElementById('detail-format').textContent = book.format || 'paperback';
  document.getElementById('detail-rating').textContent = book.rating ? `${book.rating}/5` : 'Not rated';
  
  // Availability information
  document.getElementById('total-copies').textContent = book.totalQuantity || 0;
  document.getElementById('available-copies').textContent = book.availableQuantity || 0;
  document.getElementById('borrowed-copies').textContent = book.borrowedQuantity || 0;
  
  // Location
  const locationText = (book.location && book.location.shelf && book.location.section) 
    ? `Shelf: ${book.location.shelf}, Section: ${book.location.section}`
    : 'Location information not available';
  document.getElementById('book-location').textContent = locationText;
  
  // Show the content
  document.getElementById('book-content').style.display = 'block';
}

// Display star rating
function displayRating(rating) {
  const ratingContainer = document.getElementById('book-rating');
  
  if (rating && rating > 0) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += '<span class="star filled">⭐</span>';
      } else {
        starsHtml += '<span class="star empty">☆</span>';
      }
    }
    ratingContainer.innerHTML = starsHtml + ` <span class="rating-text">(${rating}/5)</span>`;
  } else {
    ratingContainer.innerHTML = '<span class="no-rating">No rating yet</span>';
  }
}

// Tab switching functionality
function switchTab(tabName) {
  // Remove active class from all tabs and panes
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  
  // Add active class to selected tab and pane
  document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Borrow this book with authentication check
function borrowThisBook() {
  if (!currentBook) return;
  
  // Check if user is logged in using AuthUtils
  if (!AuthUtils.requireAuth('borrow this book')) {
    return; // AuthUtils will handle the login modal
  }
  
  // User is authenticated, proceed with borrowing
  const params = new URLSearchParams({
    bookId: currentBook._id,
    bookTitle: currentBook.title,
    bookAuthor: currentBook.author
  });
  
  window.location.href = `/HTML/borrow.html?${params.toString()}`;
}

// Reserve this book with authentication check
function reserveThisBook() {
  // Check if user is logged in using AuthUtils
  if (!AuthUtils.requireAuth('reserve books')) {
    return; // AuthUtils will handle the login modal
  }
  
  // User is authenticated, show reserve functionality (placeholder)
  AuthUtils.showModal(
    "📋 Book Reservation",
    "Reserve functionality will be implemented soon! You will be notified when this book becomes available.",
    [{
      text: "OK",
      className: "btn-primary",
      action: () => AuthUtils.closeModal()
    }]
  );
}

// Show loading state
function showLoading() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error-state').style.display = 'none';
  document.getElementById('book-content').style.display = 'none';
}

// Hide loading state
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// Show error state
function showError() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
  document.getElementById('book-content').style.display = 'none';
}
