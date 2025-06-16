import express from 'express';
import Crop from '../models/Crop.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all crops for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new crop
router.post('/', authenticateToken, async (req, res) => {
  try {
    const crop = new Crop({
      ...req.body,
      userId: req.user._id
    });
    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json(crop);
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete crop
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;