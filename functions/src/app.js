const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { loadEnv } = require('./config/env');
const { connectDb } = require('./config/db');
const showcaseRoutes = require('./routes/showcaseRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const reportRoutes = require('./routes/reportRoutes');
const welfareRoutes = require('./routes/welfareRoutes');
const loanRoutes = require('./routes/loanRoutes');

function createApp() {
  loadEnv();
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Connect DB (no-op if already connected)
  connectDb()
    .then(() => {
      // DB connected successfully
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('✗ DB connection failed:', err.message);
      console.warn('⚠ Server will continue without database connection');
    });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/proxies', proxyRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/meetings', meetingRoutes);
  app.use('/api/approvals', approvalRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/welfare', welfareRoutes);
  app.use('/api/loans', loanRoutes);
  app.use('/api/showcase', showcaseRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  });

  return app;
}

module.exports = createApp;

// Allow running locally without Firebase
if (require.main === module) {
  (async () => {
    try {
      const app = createApp();
      const port = process.env.PORT || 5001;
      
      // Handle uncaught exceptions
      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
      });
      
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      });
      
      const server = app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${port}`);
        console.log('Press Ctrl+C to stop the server');
      });
      
      server.on('error', (err) => {
        console.error('Server error:', err);
      });
      
      // Keep the process alive
      process.stdin.resume();
      
    } catch (error) {
      console.error('Fatal error starting server:', error);
      process.exit(1);
    }
  })();
}
