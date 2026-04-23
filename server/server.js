require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Routes
app.use('/api/contact', contactRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
