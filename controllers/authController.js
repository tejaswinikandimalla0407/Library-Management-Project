const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");

// Register Controller
exports.registerUser = (req, res) => {
  const { fullName, email, password } = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ fullName, email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(200).json({ message: "Registered successfully" });
};

// Login Controller
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.status(404).json({ message: "No users found" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", name: user.fullName });
};
