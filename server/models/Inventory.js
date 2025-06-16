import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Soil & Amendments', 'Tools', 'Other']
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  minStock: {
    type: Number,
    required: true,
    min: 0
  },
  maxStock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  barcode: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Inventory', inventorySchema);