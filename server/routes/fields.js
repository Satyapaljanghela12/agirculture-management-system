import express from 'express';
import Field from '../models/Field.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all fields for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const fields = await Field.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(fields);
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new field
router.post('/', authenticateToken, async (req, res) => {
  try {
    const field = new Field({
      ...req.body,
      userId: req.user._id
    });
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    console.error('Create field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update field
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const field = await Field.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json(field);
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete field
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;