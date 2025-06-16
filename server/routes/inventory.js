import express from 'express';
import Inventory from '../models/Inventory.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory items for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const inventory = await Inventory.find({ userId: req.user._id }).sort({ name: 1 });
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const item = new Inventory({
      ...req.body,
      userId: req.user._id
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inventory item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;