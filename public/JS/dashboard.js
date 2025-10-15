document.addEventListener("DOMContentLoaded", () => {
  // Check student authentication
  checkStudentAuthentication();
  
  // Setup logout functionality
  setupLogoutButton();
  
  // Setup change password button
  setupChangePasswordButton();
});

// Authentication and session management functions
function checkStudentAuthentication() {
  const isStudentLoggedIn = localStorage.getItem("isStudentLoggedIn");
  const studentData = localStorage.getItem("studentData");
  const currentStudentId = localStorage.getItem("currentStudentId");
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  
  if (isStudentLoggedIn !== "true" || !studentData || !currentStudentId) {
    // Not authenticated - show access denied
    showAccessDenied();
    return;
  }
  
  // Check if session is expired (24 hours for student sessions)
  if (loginTimestamp) {
    const currentTime = new Date();
    const loginTime = new Date(loginTimestamp);
    const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      // Session expired
      alert("⏰ Your session has expired. Please login again.");
      clearStudentSession();
      showAccessDenied();
      return;
    }
  }
  
  try {
    // Parse stored student data
    const student = JSON.parse(studentData);
    
    // Show student interface
    showStudentInterface(student);
    
    // Fetch fresh dashboard data from server
    fetchDashboardData(currentStudentId, student);
    
  } catch (error) {
    console.error('Error parsing student data:', error);
    clearStudentSession();
    showAccessDenied();
  }
}

function showAccessDenied() {
  document.getElementById("auth-alert").style.display = "block";
  document.getElementById("student-header").style.display = "none";
  document.getElementById("main-header").style.display = "none";
  document.querySelector(".dashboard").style.display = "none";
}

function showStudentInterface(student) {
  document.getElementById("auth-alert").style.display = "none";
  document.getElementById("student-header").style.display = "flex";
  document.getElementById("main-header").style.display = "block";
  document.querySelector(".dashboard").style.display = "block";
  
  // Update welcome message
  const welcomeElement = document.getElementById("student-welcome");
  welcomeElement.textContent = `Welcome, ${student.name}`;
  
  // Display basic student info
  document.getElementById("studentName").textContent = student.name || "-";
  document.getElementById("studentEmail").textContent = student.email || "-";
  document.getElementById("studentId").textContent = student.studentId || "-";
}

async function fetchDashboardData(studentId, fallbackData) {
  try {
    const response = await fetch(`/api/auth/dashboard/${studentId}`);
    const result = await response.json();
    
    if (result.success) {
      updateDashboardMetrics(result.data);
      displayBookHistory(result.data.borrowedBooks);
    } else {
      console.error('Failed to fetch dashboard data:', result.message);
      // Use fallback data from login
      updateDashboardMetrics(fallbackData);
      displayBookHistory(fallbackData.borrowedBooks || []);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Use fallback data from login
    updateDashboardMetrics(fallbackData);
    displayBookHistory(fallbackData.borrowedBooks || []);
  }
}

function updateDashboardMetrics(data) {
  document.getElementById("booksIssued").textContent = data.totalBooksBorrowed || 0;
  document.getElementById("booksReturned").textContent = data.totalBooksReturned || 0;
  document.getElementById("booksRented").textContent = data.currentlyBorrowed || 0;
  document.getElementById("lateFee").textContent = data.totalLateFee || 0;
}

function displayBookHistory(books) {
  const loadingElement = document.getElementById("books-loading");
  const bookListElement = document.getElementById("book-list");
  const noBooksElement = document.getElementById("no-books");
  
  // Hide loading
  loadingElement.style.display = "none";
  
  if (!books || books.length === 0) {
    noBooksElement.style.display = "block";
    bookListElement.style.display = "none";
    return;
  }
  
  // Display books
  noBooksElement.style.display = "none";
  bookListElement.style.display = "block";
  
  bookListElement.innerHTML = books.map(book => {
    const borrowDate = new Date(book.borrowDate).toLocaleDateString();
    const dueDate = new Date(book.dueDate).toLocaleDateString();
    const returnDate = book.returnDate ? new Date(book.returnDate).toLocaleDateString() : null;
    const isOverdue = !book.isReturned && new Date() > new Date(book.dueDate);
    
    return `
      <div class="book-item ${book.isReturned ? 'returned' : (isOverdue ? 'overdue' : 'active')}">
        <div class="book-info">
          <h4>⭐ ${book.title}</h4>
          <p><strong>Author:</strong> ${book.author}</p>
          <div class="book-dates">
            <p><strong>📅 Borrowed:</strong> ${borrowDate}</p>
            <p><strong>⏰ Due:</strong> ${dueDate}</p>
            ${returnDate ? `<p><strong>✅ Returned:</strong> ${returnDate}</p>` : ''}
          </div>
        </div>
        <div class="book-status">
          ${book.isReturned 
            ? '<span class="status returned">✅ Returned</span>' 
            : isOverdue 
              ? `<span class="status overdue">⚠️ Overdue</span>
                 ${book.lateFee > 0 ? `<span class="late-fee">₹${book.lateFee}</span>` : ''}` 
              : '<span class="status active">📚 Active</span>'
          }
          ${!book.isReturned 
            ? `<button class="return-book-btn" onclick="returnBook('${book.title}', '${borrowDate}')">📤 Return Book</button>`
            : ''
          }
        </div>
      </div>
    `;
  }).join('');
  
  // Add return book functionality
  if (!window.returnBookFunctionAdded) {
    window.returnBook = function(bookTitle, borrowDate) {
      const studentData = localStorage.getItem('studentData');
      if (studentData) {
        const student = JSON.parse(studentData);
        const returnUrl = `/HTML/return.html?studentId=${encodeURIComponent(student.studentId)}&bookTitle=${encodeURIComponent(bookTitle)}&borrowDate=${encodeURIComponent(borrowDate)}`;
        window.location.href = returnUrl;
      } else {
        alert('❌ Session expired. Please login again.');
        window.location.href = '/HTML/login.html';
      }
    };
    window.returnBookFunctionAdded = true;
  }
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("😪 Are you sure you want to logout?")) {
        clearStudentSession();
        alert("✅ Successfully logged out! Redirecting to home page...");
        window.location.href = "/HTML/main.html";
      }
    });
  }
}

function setupChangePasswordButton() {
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      if (confirm("🔑 You will be redirected to the login page to change your password. Continue?")) {
        // Clear session and redirect to login page
        clearStudentSession();
        alert("🔄 Please login again to change your password.");
        window.location.href = "/HTML/login.html";
      }
    });
  }
}

function clearStudentSession() {
  localStorage.removeItem("isStudentLoggedIn");
  localStorage.removeItem("studentData");
  localStorage.removeItem("currentStudentId");
  localStorage.removeItem("loginTimestamp");
}
