// Load URL parameters and populate form on page load
document.addEventListener('DOMContentLoaded', function() {
  populateFormFromURL();
  
  // Add event listener for book title change to fetch issue date
  document.getElementById('book-title').addEventListener('input', fetchBookIssueDate);
});

function populateFormFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId');
  const bookTitle = urlParams.get('bookTitle');
  const borrowDate = urlParams.get('borrowDate');
  
  if (studentId) {
    document.getElementById('student-id').value = studentId;
    document.getElementById('student-id').style.backgroundColor = '#f8f9fa';
    document.getElementById('student-id').readOnly = true;
  }
  
  if (bookTitle) {
    document.getElementById('book-title').value = bookTitle;
    fetchBookIssueDate(); // Fetch issue date for this book
  }
  
  if (borrowDate) {
    // Convert borrowDate string to YYYY-MM-DD format
    const date = new Date(borrowDate.replace(/\/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3'));
    if (!isNaN(date.getTime())) {
      const formattedDate = date.toISOString().split('T')[0];
      document.getElementById('issue-date').value = formattedDate;
    }
  }
}

async function fetchBookIssueDate() {
  const studentId = document.getElementById('student-id').value.trim();
  const bookTitle = document.getElementById('book-title').value.trim();
  
  if (!studentId || !bookTitle) return;
  
  try {
    const response = await fetch(`/api/auth/dashboard/${studentId}`);
    const result = await response.json();
    
    if (result.success) {
      const borrowedBook = result.data.borrowedBooks.find(
        book => book.title === bookTitle && !book.isReturned
      );
      
      if (borrowedBook) {
        const issueDate = new Date(borrowedBook.borrowDate);
        const formattedDate = issueDate.toISOString().split('T')[0];
        document.getElementById('issue-date').value = formattedDate;
      }
    }
  } catch (error) {
    console.error('Error fetching book data:', error);
  }
}

document.getElementById("returnForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const studentId = document.getElementById("student-id").value.trim();
  const bookTitle = document.getElementById("book-title").value.trim();
  const issueDateInput = document.getElementById("issue-date").value;
  const resultBox = document.getElementById("result");

  if (!studentId || !bookTitle || !issueDateInput) {
    showResult("❗ All fields are required.", "error");
    return;
  }

  try {
    // Show loading message
    showResult("⏳ Processing book return...", "info");
    
    // Call the backend API to return the book
    const response = await fetch('/api/auth/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: studentId,
        bookTitle: bookTitle
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      const lateFeeMessage = result.lateFee > 0 
        ? `<p><strong>⚠️ Late Fee:</strong> ₹${result.lateFee}</p><p>Please proceed to payment.</p>`
        : '<p><strong>✅ Book returned on time. No late fee.</strong></p>';
      
      showResult(
        `<p><strong>✅ ${result.message}</strong></p>${lateFeeMessage}`,
        result.lateFee > 0 ? "late" : "success"
      );
      
      // Clear form after successful return
      setTimeout(() => {
        document.getElementById('returnForm').reset();
        // Redirect back to dashboard with success message
        if (confirm('✅ Book returned successfully! Would you like to go back to your dashboard?')) {
          window.location.href = '/HTML/dashboard.html';
        }
      }, 3000);
      
    } else {
      showResult(`❌ ${result.message}`, "error");
    }
    
  } catch (error) {
    console.error('Error returning book:', error);
    showResult("❌ Failed to connect to server. Please try again.", "error");
  }
});

function showResult(message, type) {
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = message;
  resultBox.className = `result-box ${type}`;
  resultBox.style.display = 'block';
}
