import express from 'express';
import {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAllAppointments,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Private routes (authenticated users)
router.post('/', protect, createAppointment);
router.get('/', protect, getUserAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllAppointments);

export default router;
