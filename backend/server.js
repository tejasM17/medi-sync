// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const webhookRoutes = require('./src/routes/webhook.routes');
const connectDB = require('./src/config/db.config');
const reportsRoutes = require('./src/routes/reports.routes');
const aiLogsRoutes = require('./src/routes/ai-logs.routes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes (will be added phase by phase)
app.get('/', (req, res) => {
  res.json({
    message: "🚀 Medi-Sync Backend is Live!",
    frontend: "http://localhost:3000 (soon)",
    status: "healthy"
  });
});

app.get('/health', (req, res) => res.json({ status: "OK" }));

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();

  app.use('/api/webhook', webhookRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/ai-logs', aiLogsRoutes);
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
