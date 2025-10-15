// Global variables to store book and user data
let selectedBookData = null;
let currentUserData = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication first
  checkAuthentication();
  initializePage();
});

// Check if user is authenticated for borrowing
function checkAuthentication() {
  if (!AuthUtils.isLoggedIn()) {
    // User is not logged in, show login required message
    AuthUtils.showModal(
      "🔐 Login Required for Borrowing",
      "You need to be logged in to borrow books. Please log in to access the borrowing functionality.",
      [
        {
          text: "Login Now",
          className: "btn-primary",
          action: () => {
            // Store current URL to return after login
            const currentUrl = window.location.href;
            localStorage.setItem('returnUrl', currentUrl);
            window.location.href = "/HTML/login.html";
          }
        },
        {
          text: "Go Back",
          className: "btn-secondary",
          action: () => {
            window.history.back();
          }
        }
      ]
    );
    
    // Disable the form
    const form = document.getElementById('borrowForm');
    if (form) {
      form.style.opacity = '0.5';
      form.style.pointerEvents = 'none';
    }
    
    return false;
  }
  
  return true;
}

// Initialize the page with URL parameters and defaults
function initializePage() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
  const bookTitle = urlParams.get('bookTitle');
  const bookAuthor = urlParams.get('bookAuthor');
  
  // Set today as default issue date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('issue-date').value = today;
  
  // Auto-populate student ID if user is logged in
  const currentUser = AuthUtils.getCurrentUser();
  if (currentUser && currentUser.studentId) {
    document.getElementById('student-id').value = currentUser.studentId;
    // Automatically load borrowed books for the logged-in user
    loadCurrentlyBorrowedBooks(currentUser.studentId);
  }
  
  // Auto-populate fields if coming from browse page
  if (bookTitle && bookAuthor) {
    document.getElementById('book-title').value = bookTitle;
    document.getElementById('book-author').value = bookAuthor;
    
    // Store selected book data
    selectedBookData = {
      id: bookId,
      title: bookTitle,
      author: bookAuthor
    };
    
    // Show selected book preview
    showSelectedBookPreview(bookTitle, bookAuthor);
    
    // Focus on book title field if student ID is already filled, otherwise focus on student ID
    if (currentUser && currentUser.studentId) {
      document.getElementById('book-title').focus();
    } else {
      document.getElementById('student-id').focus();
    }
  } else if (currentUser && currentUser.studentId) {
    // If user is logged in but no book selected, focus on book title
    document.getElementById('book-title').focus();
  }
}

// Show preview of selected book
function showSelectedBookPreview(title, author) {
  const previewSection = document.getElementById('selected-book-info');
  const titleElement = document.getElementById('book-preview-title');
  const authorElement = document.getElementById('book-preview-author');
  const coverElement = document.getElementById('book-preview-cover');
  
  titleElement.textContent = title;
  authorElement.textContent = `by ${author}`;
  
  // Generate book cover URL
  const coverUrl = `https://via.placeholder.com/100x140/4a90e2/ffffff?text=${encodeURIComponent(title.substring(0, 15))}`;
  coverElement.src = coverUrl;
  
  previewSection.style.display = 'block';
}

// Event listener for student ID change to load borrowed books
document.getElementById('student-id').addEventListener('blur', async function() {
  const studentId = this.value.trim();
  if (studentId) {
    await loadCurrentlyBorrowedBooks(studentId);
  }
});

// Load and display currently borrowed books for the student
async function loadCurrentlyBorrowedBooks(studentId) {
  try {
    const response = await fetch(`/api/auth/dashboard/${studentId}`);
    const result = await response.json();
    
    if (result.success) {
      currentUserData = result.data;
      displayCurrentlyBorrowedBooks(result.data);
    } else {
      // If user not found, hide the borrowed books section
      document.getElementById('currently-borrowed-section').style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading borrowed books:', error);
  }
}

// Display currently borrowed books
function displayCurrentlyBorrowedBooks(userData) {
  const section = document.getElementById('currently-borrowed-section');
  const booksList = document.getElementById('borrowed-books-list');
  const countElement = document.getElementById('borrowed-count');
  
  const activeBorrowedBooks = userData.borrowedBooks.filter(book => !book.isReturned);
  
  countElement.textContent = activeBorrowedBooks.length;
  
  if (activeBorrowedBooks.length > 0) {
    booksList.innerHTML = activeBorrowedBooks.map(book => {
      const dueDate = new Date(book.dueDate);
      const today = new Date();
      const isOverdue = today > dueDate;
      const statusClass = isOverdue ? 'overdue' : 'current';
      
      return `
        <div class="borrowed-book-item ${statusClass}">
          <div class="book-info">
            <h4>${book.title}</h4>
            <p>by ${book.author}</p>
            <p class="due-date">Due: ${dueDate.toLocaleDateString()}</p>
            ${book.lateFee > 0 ? `<p class="late-fee">Late Fee: ₹${book.lateFee}</p>` : ''}
          </div>
          <div class="book-status ${statusClass}">
            ${isOverdue ? '⚠️ Overdue' : '✅ Current'}
          </div>
        </div>
      `;
    }).join('');
  } else {
    booksList.innerHTML = '<p class="no-books">No currently borrowed books.</p>';
  }
  
  section.style.display = 'block';
}

document.getElementById("borrowForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const studentId = document.getElementById("student-id").value.trim();
  const bookTitle = document.getElementById("book-title").value.trim();
  const bookAuthor = document.getElementById("book-author").value.trim();
  const issueDateInput = document.getElementById("issue-date").value;

  if (!studentId || !bookTitle || !bookAuthor || !issueDateInput) {
    showMessage("❗ Please fill in all required fields.", "error");
    return;
  }

  // Check borrow limit using current user data
  const currentlyBorrowed = currentUserData ? currentUserData.currentlyBorrowed || 0 : 0;
  if (currentlyBorrowed >= 3) {
    showMessage("❌ Borrow limit reached. You cannot borrow more than 3 books.", "error");
    return;
  }

  try {
    // Show loading message
    showMessage("⏳ Processing your request...", "info");
    
    // First, check if the book exists in the inventory
    const booksResponse = await fetch('/api/auth/books');
    const booksResult = await booksResponse.json();
    
    if (!booksResult.success) {
      showMessage("❌ Failed to fetch book inventory.", "error");
      return;
    }
    
    // Find the book by title (case insensitive)
    const book = booksResult.books.find(b => 
      b.title.toLowerCase().includes(bookTitle.toLowerCase())
    );
    
    if (!book) {
      showMessage(`❌ Book "${bookTitle}" not found in inventory. Please check the title or browse available books.`, "error");
      return;
    }
    
    if (book.availableQuantity <= 0) {
      showMessage(`❌ Book "${bookTitle}" is currently out of stock.`, "error");
      return;
    }

    // Attempt to borrow the book
    const borrowResponse = await fetch('/api/auth/borrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: studentId,
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author
      })
    });
    
    const result = await borrowResponse.json();
    
    if (result.success) {
      const dueDate = new Date(result.dueDate).toLocaleDateString();
      showMessage(`✅ Book "${book.title}" borrowed successfully! Due date: ${dueDate}`, "success");
      
      // Reload currently borrowed books to update the display
      if (currentUserData) {
        await loadCurrentlyBorrowedBooks(studentId);
      }
      
      // Reset form after success
      setTimeout(() => {
        // Store current user data before reset
        const currentUser = AuthUtils.getCurrentUser();
        
        document.getElementById("borrowForm").reset();
        document.getElementById("due-date-preview").textContent = "";
        document.getElementById("selected-book-info").style.display = 'none';
        
        // Set today's date again
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('issue-date').value = today;
        
        // Re-populate student ID if user is logged in
        if (currentUser && currentUser.studentId) {
          document.getElementById('student-id').value = currentUser.studentId;
        }
        
        // Clear success message after a bit more time
        setTimeout(() => {
          showMessage("", "");
        }, 1000);
      }, 2000);
    } else {
      showMessage(`❌ ${result.message}`, "error");
    }
    
  } catch (error) {
    console.error('Error borrowing book:', error);
    showMessage("❌ Failed to connect to server. Please try again.", "error");
  }
});

document.getElementById("issue-date").addEventListener("change", function () {
  const issueDate = new Date(this.value);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);

  if (this.value) {
    document.getElementById("due-date-preview").textContent =
      "📅 Due date will be: " + dueDate.toLocaleDateString();
  } else {
    document.getElementById("due-date-preview").textContent = "";
  }
});

function showMessage(msg, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = msg;
  messageDiv.className = "message " + type;
}
