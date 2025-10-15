document.getElementById("trackForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const studentId = document.getElementById("student-id").value.trim();
  const email = document.getElementById("email").value.trim();
  
  if (!studentId || !email) {
    alert("Please enter both Student ID and Email");
    return;
  }

  try {
    // Fetch user data from the backend
    const response = await fetch(`/api/auth/dashboard/${studentId}`);
    const result = await response.json();
    
    if (!result.success) {
      alert(result.message || "Failed to fetch user data");
      return;
    }
    
    // Verify email matches
    if (result.data.email !== email) {
      alert("❌ Email does not match the Student ID");
      return;
    }
    
    // Show the activity content
    document.getElementById("activityContent").style.display = "block";
    
    // Display user statistics
    displayUserStatistics(result.data);
    
    // Display currently issued books
    displayIssuedBooks(result.data.borrowedBooks);
    
    // Display overdue books
    displayOverdueBooks(result.data.borrowedBooks, result.data);
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("❌ Failed to connect to server. Please try again.");
  }
});

function displayUserStatistics(userData) {
  // Create or update statistics section
  let statsSection = document.querySelector('.user-statistics');
  if (!statsSection) {
    statsSection = document.createElement('section');
    statsSection.className = 'user-statistics';
    document.getElementById('activityContent').insertBefore(statsSection, document.querySelector('.issued-books'));
  }
  
  statsSection.innerHTML = `
    <h3>📊 User Statistics</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <strong>Name:</strong> ${userData.name}
      </div>
      <div class="stat-item">
        <strong>📚 Total Books Borrowed:</strong> ${userData.totalBooksBorrowed || 0}
      </div>
      <div class="stat-item">
        <strong>✅ Books Returned:</strong> ${userData.totalBooksReturned || 0}
      </div>
      <div class="stat-item">
        <strong>📖 Currently Borrowed:</strong> ${userData.currentlyBorrowed || 0}
      </div>
      <div class="stat-item">
        <strong>⚠️ Total Late Fee:</strong> ₹${userData.totalLateFee || 0}
      </div>
    </div>
  `;
}

function displayIssuedBooks(borrowedBooks) {
  const issuedList = document.getElementById("issuedList");
  issuedList.innerHTML = "";
  
  // Filter for currently issued (not returned) books
  const currentBooks = borrowedBooks.filter(book => !book.isReturned);
  
  if (currentBooks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "📚 No books currently issued";
    li.style.color = "#666";
    li.style.fontStyle = "italic";
    issuedList.appendChild(li);
    return;
  }
  
  currentBooks.forEach(book => {
    const li = document.createElement("li");
    const dueDate = new Date(book.dueDate).toLocaleDateString();
    const borrowDate = new Date(book.borrowDate).toLocaleDateString();
    const isOverdue = new Date() > new Date(book.dueDate);
    
    li.innerHTML = `
      <div class="book-item ${isOverdue ? 'overdue' : ''}">
        <strong>📘 ${book.title}</strong> by ${book.author}<br>
        <small>Borrowed: ${borrowDate} | Due: ${dueDate}</small>
        ${isOverdue ? '<span class="overdue-badge">⚠️ OVERDUE</span>' : ''}
        ${book.lateFee > 0 ? `<span class="late-fee">Late Fee: ₹${book.lateFee}</span>` : ''}
      </div>
    `;
    issuedList.appendChild(li);
  });
}

function displayOverdueBooks(borrowedBooks, userData) {
  const overdueTable = document.getElementById("overdueTable");
  overdueTable.innerHTML = "";
  
  // Filter for overdue books
  const overdueBooks = borrowedBooks.filter(book => {
    return !book.isReturned && new Date() > new Date(book.dueDate);
  });
  
  if (overdueBooks.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="5" style="text-align: center; color: #666; font-style: italic;">
        ✅ No overdue books
      </td>
    `;
    overdueTable.appendChild(tr);
    return;
  }
  
  overdueBooks.forEach(book => {
    const tr = document.createElement("tr");
    tr.className = "overdue";
    const dueDate = new Date(book.dueDate).toLocaleDateString();
    
    tr.innerHTML = `
      <td>${userData.name}</td>
      <td>${userData.email}</td>
      <td>${book.title}</td>
      <td>${dueDate}</td>
      <td>₹${book.lateFee || 0}</td>
    `;
    overdueTable.appendChild(tr);
  });
}
