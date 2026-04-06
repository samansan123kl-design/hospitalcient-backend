import Doctor from '../models/Doctor.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, department } = req.query;
    
    let filter = {};
    if (specialization) filter.specialization = specialization;
    if (department) filter.department = department;

    const doctors = await Doctor.find(filter);
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Create doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    
    res.status(201).json({
      success: true,
      doctor,
      message: 'Doctor created successfully',
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Update doctor (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      doctor,
      message: 'Doctor updated successfully',
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Delete doctor (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialization/:specialization
// @access  Public
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialization: req.params.specialization });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Get doctors by specialization error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
