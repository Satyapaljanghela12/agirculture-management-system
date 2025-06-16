import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
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
  area: {
    type: Number,
    required: true
  },
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  soilType: {
    type: String,
    required: true
  },
  soilPH: {
    type: Number,
    min: 0,
    max: 14
  },
  moisture: {
    type: Number,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number
  },
  nutrients: {
    nitrogen: { type: Number, min: 0, max: 100 },
    phosphorus: { type: Number, min: 0, max: 100 },
    potassium: { type: Number, min: 0, max: 100 }
  },
  currentCrop: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'fallow', 'preparation'],
    default: 'active'
  },
  lastTested: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  irrigationSystem: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'manual'],
    default: 'manual'
  }
}, {
  timestamps: true
});

export default mongoose.model('Field', fieldSchema);