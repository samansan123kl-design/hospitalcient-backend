import mongoose from 'mongoose';

const healthPackageBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
    },
    packageId: {
      type: Number,
      required: [true, 'Package ID is required'],
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
    },
    tests: [{
      type: String,
      required: true,
    }],
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['card', 'upi', 'netbanking'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    bookingId: {
      type: String,
      unique: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Generate unique booking ID before saving
healthPackageBookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = `HP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('HealthPackageBooking', healthPackageBookingSchema);