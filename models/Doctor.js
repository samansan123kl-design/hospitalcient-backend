import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide experience in years'],
    },
    qualifications: [String],
    image: {
      type: String,
      default: 'default-doctor.jpg',
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    availableSlots: [
      {
        date: Date,
        slots: [String], // e.g., ['10:00 AM', '10:30 AM', '11:00 AM']
      },
    ],
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
