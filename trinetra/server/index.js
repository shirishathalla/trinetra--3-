const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TRINETRA API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tourists', require('./routes/tourists'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/gps', require('./routes/gps'));
app.use('/api/authority', require('./routes/authority'));
app.use('/api/support', require('./routes/support'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
