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

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriculture_management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/finance', financeRoutes);

// Weather API Routes
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
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
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
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
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Agriculture Management API is running',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      weather_api: process.env.OPENWEATHERMAP_API_KEY ? 'configured' : 'not configured'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});