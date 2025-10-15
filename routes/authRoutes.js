const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const Admin = require("../models/Admin");

// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
  const { name, studentId, email, password } = req.body;

  if (!studentId || !email || !password) {
    return res.status(400).json({ success: false, message: "❌ Student ID, email, and password are required." });
  }

  try {
    // Check for existing user by email or studentId
    const existing = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "❌ Email or Student ID already registered." });
    }

    // Create new user with default borrowing data
    const newUser = new User({ 
      name, 
      studentId, 
      email, 
      password,
      totalBooksBorrowed: 0,
      totalBooksReturned: 0,
      currentlyBorrowed: 0
    });
    await newUser.save();

    res.status(201).json({ success: true, message: "✅ Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during registration." });
  }
});


// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ success: false, message: "❌ Student ID and password required." });
  }

  try {
    const user = await User.findOne({ studentId, password });

    if (!user) {
      return res.status(401).json({ success: false, message: "❌ Invalid credentials." });
    }

    // Calculate late fees for overdue books
    let totalLateFee = 0;
    const today = new Date();
    
    user.borrowedBooks.forEach(book => {
      if (!book.isReturned && today > book.dueDate) {
        const daysLate = Math.ceil((today - book.dueDate) / (1000 * 60 * 60 * 24));
        book.lateFee = daysLate * 10; // ₹10 per day late fee
        totalLateFee += book.lateFee;
      }
    });

    // Save updated late fees
    await user.save();

    // Store user session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    req.session.studentId = user.studentId;
    req.session.userType = 'student';
    req.session.loginTime = new Date();

    // Return user data without password (handle users without name field)
    const userData = {
      _id: user._id,
      name: user.name || 'Student', // Default name if not set
      email: user.email,
      studentId: user.studentId,
      totalBooksBorrowed: user.totalBooksBorrowed || 0,
      totalBooksReturned: user.totalBooksReturned || 0,
      currentlyBorrowed: user.currentlyBorrowed || 0,
      borrowedBooks: user.borrowedBooks || [],
      totalLateFee: totalLateFee
    };

    res.json({ 
      success: true, 
      message: "✅ Login successful",
      user: userData
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during login." });
  }
});

// -------------------- ADMIN LOGIN --------------------
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "❌ Username and password required." });
  }

  try {
    // Look up admin credentials from database
    const admin = await Admin.findOne({ 
      username: username.toLowerCase(), 
      password: password,
      isActive: true 
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: "❌ Invalid admin credentials or account inactive." });
    }

    // Update last login timestamp
    await admin.updateLastLogin();

    // Store admin session
    req.session.isLoggedIn = true;
    req.session.adminId = admin._id;
    req.session.username = admin.username;
    req.session.userType = 'admin';
    req.session.loginTime = new Date();

    // Successful admin login
    res.json({ 
      success: true, 
      message: "✅ Admin login successful",
      admin: {
        _id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during admin login." });
  }
});

// -------------------- LOGOUT --------------------
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "❌ Error logging out." });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ success: true, message: "✅ Logged out successfully" });
    });
  } else {
    res.json({ success: true, message: "✅ Already logged out" });
  }
});

// -------------------- CHECK SESSION --------------------
router.get("/session", (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    // Check if session is not expired (24 hours)
    const loginTime = new Date(req.session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      res.json({
        success: true,
        isLoggedIn: true,
        userType: req.session.userType,
        userId: req.session.userId || req.session.adminId,
        studentId: req.session.studentId,
        username: req.session.username,
        loginTime: req.session.loginTime
      });
    } else {
      // Session expired
      req.session.destroy();
      res.json({ success: true, isLoggedIn: false, message: "Session expired" });
    }
  } else {
    res.json({ success: true, isLoggedIn: false });
  }
});

// -------------------- GET DASHBOARD DATA --------------------
router.get("/dashboard/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const user = await User.findOne({ studentId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ User not found." });
    }

    // Calculate late fees for overdue books
    let totalLateFee = 0;
    const today = new Date();
    
    user.borrowedBooks.forEach(book => {
      if (!book.isReturned && today > book.dueDate) {
        const daysLate = Math.ceil((today - book.dueDate) / (1000 * 60 * 60 * 24));
        book.lateFee = daysLate * 10; // ₹10 per day late fee
        totalLateFee += book.lateFee;
      }
    });

    // Save updated late fees
    await user.save();

    // Return dashboard data
    const dashboardData = {
      name: user.name || 'Student',
      email: user.email,
      studentId: user.studentId,
      totalBooksBorrowed: user.totalBooksBorrowed || 0,
      totalBooksReturned: user.totalBooksReturned || 0,
      currentlyBorrowed: user.currentlyBorrowed || 0,
      totalLateFee: totalLateFee,
      borrowedBooks: (user.borrowedBooks || []).map(book => ({
        title: book.bookTitle,
        author: book.bookAuthor,
        borrowDate: book.borrowDate,
        dueDate: book.dueDate,
        returnDate: book.returnDate,
        isReturned: book.isReturned,
        lateFee: book.lateFee || 0
      }))
    };

    res.json({ success: true, data: dashboardData });
  } catch (err) {
    console.error("Dashboard data error:", err);
    res.status(500).json({ success: false, message: "❌ Server error fetching dashboard data." });
  }
});

// -------------------- BOOK MANAGEMENT ROUTES --------------------

// Add a new book (Admin only)
router.post("/books", async (req, res) => {
  try {
    const { title, author, genre, quantity, summary } = req.body;
    
    if (!title || !author || !genre || !quantity) {
      return res.status(400).json({ success: false, message: "❌ Title, author, genre, and quantity are required." });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      totalQuantity: quantity,
      availableQuantity: quantity,
      summary: summary || ''
    });
    
    await newBook.save();
    res.status(201).json({ success: true, message: "✅ Book added successfully", book: newBook });
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ success: false, message: "❌ Server error adding book." });
  }
});

// Get all books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find({}).select('-borrowHistory');
    res.json({ success: true, books });
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ success: false, message: "❌ Server error fetching books." });
  }
});

// Search books
router.get("/books/search", async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: "❌ Search query is required." });
    }

    const books = await Book.find({
      $text: { $search: query }
    }).select('-borrowHistory');
    
    res.json({ success: true, books });
  } catch (err) {
    console.error("Search books error:", err);
    res.status(500).json({ success: false, message: "❌ Server error searching books." });
  }
});

// Borrow a book
router.post("/borrow", async (req, res) => {
  try {
    const { studentId, bookId, bookTitle, bookAuthor } = req.body;
    
    if (!studentId || !bookId || !bookTitle || !bookAuthor) {
      return res.status(400).json({ success: false, message: "❌ All fields are required." });
    }

    // Find the user
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ User not found." });
    }

    // Check if user already has this book borrowed
    const alreadyBorrowed = user.borrowedBooks.some(book => 
      book.bookTitle === bookTitle && !book.isReturned
    );
    
    if (alreadyBorrowed) {
      return res.status(400).json({ success: false, message: "❌ You have already borrowed this book." });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "❌ Book not found." });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: "❌ Book is not available." });
    }

    // Borrow the book
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period
    
    user.borrowedBooks.push({
      bookTitle,
      bookAuthor,
      borrowDate: new Date(),
      dueDate: dueDate,
      isReturned: false,
      lateFee: 0
    });
    
    user.totalBooksBorrowed++;
    user.currentlyBorrowed++;
    
    book.availableQuantity--;
    book.borrowedQuantity++;
    book.borrowHistory.push({
      studentId,
      borrowDate: new Date(),
      isReturned: false
    });

    await user.save();
    await book.save();
    
    res.json({ success: true, message: "✅ Book borrowed successfully", dueDate });
  } catch (err) {
    console.error("Borrow book error:", err);
    res.status(500).json({ success: false, message: "❌ Server error borrowing book." });
  }
});

// Return a book
router.post("/return", async (req, res) => {
  try {
    const { studentId, bookTitle } = req.body;
    
    if (!studentId || !bookTitle) {
      return res.status(400).json({ success: false, message: "❌ Student ID and book title are required." });
    }

    // Find the user
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ User not found." });
    }

    // Find the borrowed book record
    const borrowedBook = user.borrowedBooks.find(book => 
      book.bookTitle === bookTitle && !book.isReturned
    );
    
    if (!borrowedBook) {
      return res.status(404).json({ success: false, message: "❌ No active borrowing record found for this book." });
    }

    // Find the book in inventory
    const book = await Book.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json({ success: false, message: "❌ Book not found in inventory." });
    }

    // Calculate late fee if applicable
    const today = new Date();
    let lateFee = 0;
    if (today > borrowedBook.dueDate) {
      const daysLate = Math.ceil((today - borrowedBook.dueDate) / (1000 * 60 * 60 * 24));
      lateFee = daysLate * 10; // ₹10 per day
      borrowedBook.lateFee = lateFee;
    }

    // Mark book as returned
    borrowedBook.isReturned = true;
    borrowedBook.returnDate = today;
    
    user.totalBooksReturned++;
    user.currentlyBorrowed--;
    
    book.availableQuantity++;
    book.borrowedQuantity--;
    
    // Update book's borrow history
    const borrowRecord = book.borrowHistory.find(record => 
      record.studentId === studentId && !record.isReturned
    );
    if (borrowRecord) {
      borrowRecord.isReturned = true;
      borrowRecord.returnDate = today;
    }

    await user.save();
    await book.save();
    
    res.json({ 
      success: true, 
      message: "✅ Book returned successfully", 
      lateFee: lateFee,
      message2: lateFee > 0 ? `Late fee: ₹${lateFee}` : "No late fee" 
    });
  } catch (err) {
    console.error("Return book error:", err);
    res.status(500).json({ success: false, message: "❌ Server error returning book." });
  }
});

// -------------------- ADMIN MANAGEMENT ROUTES --------------------

// Get all admins (Super Admin only)
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json({ success: true, admins });
  } catch (err) {
    console.error("Get admins error:", err);
    res.status(500).json({ success: false, message: "❌ Server error fetching admins." });
  }
});

// Add new admin (Super Admin only)
router.post("/admin/add", async (req, res) => {
  try {
    const { username, password, fullName, email, role, permissions } = req.body;
    
    if (!username || !password || !fullName || !email || !role) {
      return res.status(400).json({ success: false, message: "❌ All fields are required." });
    }

    // Check if username or email already exists
    const existing = await Admin.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "❌ Username or email already exists." });
    }

    const newAdmin = new Admin({
      username: username.toLowerCase(),
      password,
      fullName,
      email: email.toLowerCase(),
      role,
      permissions: permissions || {
        canManageBooks: true,
        canViewUsers: true,
        canManageUsers: false,
        canViewReports: true,
        canManageAdmins: false
      }
    });
    
    await newAdmin.save();
    
    // Return admin without password
    const adminData = await Admin.findById(newAdmin._id).select('-password');
    res.status(201).json({ success: true, message: "✅ Admin added successfully", admin: adminData });
  } catch (err) {
    console.error("Add admin error:", err);
    res.status(500).json({ success: false, message: "❌ Server error adding admin." });
  }
});

// Update admin status (Super Admin only)
router.put("/admin/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(
      id, 
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({ success: false, message: "❌ Admin not found." });
    }
    
    res.json({ 
      success: true, 
      message: `✅ Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      admin 
    });
  } catch (err) {
    console.error("Update admin status error:", err);
    res.status(500).json({ success: false, message: "❌ Server error updating admin status." });
  }
});

module.exports = router;
