document.addEventListener("DOMContentLoaded", () => {
  // Check admin authentication
  checkAdminAuthentication();
  
  // Setup logout functionality
  setupLogoutButton();
  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  let editIndex = -1;
  let books = JSON.parse(localStorage.getItem("books")) || [];

  function renderBooks() {
    bookList.innerHTML = "";
    books.forEach((book, index) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      const infoDiv = document.createElement("div");
      infoDiv.className = "book-info";
      infoDiv.innerHTML = `
        <h4>${book.title}</h4>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Quantity:</strong> ${book.quantity}</p>
        <p>${book.summary}</p>
      `;
      bookCard.appendChild(infoDiv);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit";
      editBtn.onclick = () => editBook(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete";
      deleteBtn.onclick = () => deleteBook(index);

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      bookCard.appendChild(actionsDiv);
      bookList.appendChild(bookCard);
    });
  }

  function editBook(index) {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("quantity").value = book.quantity;
    document.getElementById("summary").value = book.summary;
    editIndex = index;
  }

  function deleteBook(index) {
    if (confirm("Are you sure you want to delete this book?")) {
      books.splice(index, 1);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const summary = document.getElementById("summary").value.trim();

    if (!title || !author || !genre || !quantity || !summary) {
      alert("Please fill in all the required fields.");
      return;
    }

    const newBook = { title, author, genre, quantity, summary };

    if (editIndex > -1) {
      books[editIndex] = newBook;
      editIndex = -1;
    } else {
      books.push(newBook);
    }

    localStorage.setItem("books", JSON.stringify(books));
    bookForm.reset();
    renderBooks();
  });

  renderBooks();
});
// Authentication and session management functions
function checkAdminAuthentication() {
  const isAdmin = localStorage.getItem("isAdmin");
  const adminUsername = localStorage.getItem("adminUsername");
  const adminRole = localStorage.getItem("adminRole");
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  
  if (isAdmin !== "true" || !adminUsername || !loginTimestamp) {
    // Not authenticated - show access denied
    showAccessDenied();
    return;
  }
  
  // Check if session is expired (8 hours)
  const currentTime = new Date();
  const loginTime = new Date(loginTimestamp);
  const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60);
  
  if (hoursDiff > 8) {
    // Session expired
    alert("⏰ Your admin session has expired. Please login again.");
    clearAdminSession();
    showAccessDenied();
    return;
  }
  
  // Authenticated - show admin interface
  showAdminInterface(adminUsername, adminRole);
}

function showAccessDenied() {
  document.getElementById("auth-alert").style.display = "block";
  document.getElementById("admin-header").style.display = "none";
  document.getElementById("main-header").style.display = "none";
  document.querySelector(".inventory-container").style.display = "none";
}

function showAdminInterface(username, role) {
  document.getElementById("auth-alert").style.display = "none";
  document.getElementById("admin-header").style.display = "flex";
  document.getElementById("main-header").style.display = "block";
  document.querySelector(".inventory-container").style.display = "block";
  
  // Update welcome message
  const welcomeElement = document.getElementById("admin-welcome");
  welcomeElement.textContent = `Welcome, ${username} (${role || 'admin'})`;
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn");
  const logoutLink = document.getElementById("logout-link");
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("😪 Are you sure you want to logout?")) {
        clearAdminSession();
        alert("✅ Successfully logged out! Redirecting to home page...");
        window.location.href = "/HTML/main.html";
      }
    });
  }
  
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("😪 Are you sure you want to logout?")) {
        clearAdminSession();
        alert("✅ Successfully logged out! Redirecting to home page...");
        window.location.href = "/HTML/main.html";
      }
    });
  }
}

function clearAdminSession() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminUsername");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("loginTimestamp");
}

// Legacy function for backward compatibility
function logoutAdmin() {
  clearAdminSession();
  window.location.href = "/HTML/main.html";
}
