import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
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
  variety: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    required: true,
    trim: true
  },
  plantedDate: {
    type: Date,
    required: true
  },
  expectedHarvest: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planted', 'growing', 'flowering', 'ready', 'harvested'],
    default: 'planted'
  },
  area: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  health: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  irrigation: {
    type: String,
    enum: ['automated', 'manual', 'rain-fed'],
    default: 'manual'
  },
  notes: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  yield: {
    expected: Number,
    actual: Number
  },
  costs: {
    seeds: { type: Number, default: 0 },
    fertilizer: { type: Number, default: 0 },
    pesticides: { type: Number, default: 0 },
    labor: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model('Crop', cropSchema);