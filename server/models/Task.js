import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  assignee: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  field: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  estimatedHours: {
    type: Number,
    required: true
  },
  actualHours: {
    type: Number
  },
  notes: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);