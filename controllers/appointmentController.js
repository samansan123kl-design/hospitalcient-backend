import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, notes } = req.body;
    const userId = req.user.id;

    // Validation
    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['scheduled', 'completed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      notes,
      department: doctor.department,
      consultationFee: doctor.consultationFee,
    });

    // Add appointment to user's appointments
    await User.findByIdAndUpdate(userId, {
      $push: { appointments: appointment._id },
    });

    // Populate doctor details
    await appointment.populate('doctorId', 'name specialization phone');

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let filter = { userId };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name specialization phone department')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name specialization phone department');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this appointment' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res) => {
  try {
    const { date, timeSlot, reason, notes, status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }

    // Update fields
    if (date) appointment.date = new Date(date);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (reason) appointment.reason = reason;
    if (notes) appointment.notes = notes;
    if (status && req.user.role === 'admin') appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments/admin/all
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, date } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name specialization phone')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
