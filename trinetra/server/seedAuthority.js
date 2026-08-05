const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAuthority = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if it already exists
    const existing = await User.findOne({ email: 'authority@trinetra.gov.in' });
    if (existing) {
      console.log('Authority user already exists. Email: authority@trinetra.gov.in, Password: password123');
      process.exit(0);
    }

    const user = await User.create({
      email: 'authority@trinetra.gov.in',
      password: 'password123',
      role: 'authority'
    });

    console.log('Authority user created successfully!');
    console.log('Email: authority@trinetra.gov.in');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAuthority();
