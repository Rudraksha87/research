const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const researchRoutes = require('./routes/researchRoutes');
const paperRoutes = require('./routes/paperRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'ResearchLens API Gateway'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/documents', documentRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
