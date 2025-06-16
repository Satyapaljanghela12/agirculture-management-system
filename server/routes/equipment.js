import express from 'express';
import Equipment from '../models/Equipment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all equipment for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.find({ userId: req.user._id }).sort({ name: 1 });
    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new equipment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const equipment = new Equipment({
      ...req.body,
      userId: req.user._id
    });
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update equipment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json(equipment);
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete equipment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;