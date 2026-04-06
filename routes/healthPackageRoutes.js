import express from 'express';
import { protect } from '../middleware/auth.js';
import HealthPackageBooking from '../models/HealthPackageBooking.js';

const router = express.Router();

// @route   POST /api/health-packages/book
// @desc    Book a health package
// @access  Private
router.post('/book', protect, async (req, res) => {
  try {
    const {
      packageName,
      packageId,
      price,
      tests,
      paymentMethod,
      notes
    } = req.body;

    // Create booking
    const booking = await HealthPackageBooking.create({
      userId: req.user._id || req.user.id,
      packageName,
      packageId,
      price,
      tests,
      paymentMethod,
      paymentStatus: 'completed', // In real app, this would be 'pending' until payment confirmation
      status: 'confirmed',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Health package booked successfully'
    });
  } catch (error) {
    console.error('Health package booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book health package',
      error: error.message
    });
  }
});

// @route   GET /api/health-packages/my-bookings
// @desc    Get user's health package bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await HealthPackageBooking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get health package bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health package bookings',
      error: error.message
    });
  }
});

// @route   GET /api/health-packages/:id
// @desc    Get single health package booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await HealthPackageBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Health package booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get health package booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health package booking',
      error: error.message
    });
  }
});

// @route   PUT /api/health-packages/:id/cancel
// @desc    Cancel health package booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await HealthPackageBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Health package booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this booking'
      });
    }

    // Check if booking can be cancelled (not already completed)
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Health package booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel health package booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel health package booking',
      error: error.message
    });
  }
});

export default router;