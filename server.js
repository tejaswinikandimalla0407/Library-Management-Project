// server.js
const connectDB = require("./db");
connectDB(); // Connect to MongoDB

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes"); // Import authentication routes

const app = express();
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'library-management-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "HTML", "main.html"));
});

// Admin login route
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "HTML", "admin-login.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
