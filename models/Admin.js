// models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'librarian', 'manager', 'super_admin'],
    default: 'admin'
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    canManageBooks: { type: Boolean, default: true },
    canViewUsers: { type: Boolean, default: true },
    canManageUsers: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: true },
    canManageAdmins: { type: Boolean, default: false }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Index for efficient login queries
AdminSchema.index({ username: 1, isActive: 1 });

// Method to check permissions
AdminSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] || false;
};

// Method to update last login
AdminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('Admin', AdminSchema);
