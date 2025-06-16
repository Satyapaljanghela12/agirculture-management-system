import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'repair', 'retired'],
    default: 'active'
  },
  location: {
    type: String,
    required: true
  },
  hoursUsed: {
    type: Number,
    default: 0
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  nextMaintenance: {
    type: Date,
    required: true
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  maintenanceCost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  serialNumber: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Equipment', equipmentSchema);