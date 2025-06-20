import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import cropRoutes from './routes/crops.js';
import fieldRoutes from './routes/fields.js';
import taskRoutes from './routes/tasks.js';
import inventoryRoutes from './routes/inventory.js';
import equipmentRoutes from './routes/equipment.js';
import financeRoutes from './routes/finance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5173',
      process.env.FRONTEND_URL,
      // Add your Vercel domain here
      /\.vercel\.app$/,
      /\.netlify\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      return allowedOrigin.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path.includes('auth')) {
    console.log('Auth request body keys:', Object.keys(req.body));
  }
  next();
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriculture_management';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit in production, let the app continue with error handling
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/finance', financeRoutes);

// Weather API Routes with better error handling
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!process.env.VITE_OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'Weather API key not available'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`,
      { timeout: 10000 }
    );
    
    res.json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Weather API error:', error);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Failed to fetch weather data',
        details: error.response.data 
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Weather service timeout' });
    } else {
      res.status(500).json({ error: 'Weather service unavailable' });
    }
  }
});

app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!process.env.VITE_OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'Weather API key not available'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`,
      { timeout: 10000 }
    );
    
    res.json({
      status: 'success',
      data: response.data
    });
  } catch (error) {
    console.error('Forecast API error:', error);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Failed to fetch forecast data',
        details: error.response.data 
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Forecast service timeout' });
    } else {
      res.status(500).json({ error: 'Forecast service unavailable' });
    }
  }
});

// Health check with more detailed information
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Agriculture Management API is running',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      weather_api: process.env.VITE_OPENWEATHER_API_KEY ? 'configured' : 'not configured'
    },
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.json(healthCheck);
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Agriculture Management API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/user',
      crops: '/api/crops',
      fields: '/api/fields',
      tasks: '/api/tasks',
      inventory: '/api/inventory',
      equipment: '/api/equipment',
      finance: '/api/finance',
      weather: '/api/weather',
      health: '/api/health'
    }
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.'
    });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message,
      stack: err.stack
    });
  }
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/crops',
      'GET /api/fields',
      'GET /api/tasks',
      'GET /api/inventory',
      'GET /api/equipment',
      'GET /api/finance/transactions'
    ]
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
  console.log(`Weather API: ${process.env.VITE_OPENWEATHER_API_KEY ? 'configured' : 'not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

export default app;