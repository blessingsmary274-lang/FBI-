const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
require('dotenv').config();

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const { initDatabase } = require('./db/connection');
const { connectRabbitMQ } = require('./services/rabbitmq');
const { connectRedis } = require('./services/redis');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'user-service', timestamp: new Date().toISOString() });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Initialize services and start server
async function start() {
  try {
    await initDatabase();
    console.log('✓ Database connected');

    await connectRedis();
    console.log('✓ Redis connected');

    await connectRabbitMQ();
    console.log('✓ RabbitMQ connected');

    app.listen(PORT, () => {
      console.log(`✓ User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start User Service:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
