// Create a fresh test user for debugging
const mongoose = require('mongoose');

// Connect directly to MongoDB without using the User model
mongoose.connect('mongodb://localhost:27017/library').then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Delete all users to start fresh
    await mongoose.connection.collection('users').deleteMany({});
    console.log('✅ Cleared all users');
    
    // Create a new user directly in the collection
    const newUser = {
      name: 'Test Student',
      studentId: 'TEST123',
      email: 'test@student.edu',
      password: 'Test@123',
      totalBooksBorrowed: 0,
      totalBooksReturned: 0,
      currentlyBorrowed: 0,
      borrowedBooks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await mongoose.connection.collection('users').insertOne(newUser);
    console.log('✅ Created fresh test user:');
    console.log('   Student ID: TEST123');
    console.log('   Password: Test@123');
    console.log('   Email: test@student.edu');
    
    // Verify the user was created
    const createdUser = await mongoose.connection.collection('users').findOne({ studentId: 'TEST123' });
    console.log('✅ Verification:', createdUser ? 'User created successfully' : 'User creation failed');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.disconnect();
  }
}).catch(err => {
  console.error('❌ Connection error:', err);
});
