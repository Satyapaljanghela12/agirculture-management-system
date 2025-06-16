import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Agriculture Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});