const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,
})

const appointmentSchema = new mongoose.Schema(
  {
    // Doctor
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    doctorName: { type: String, required: true },
    specialization: { type: String },

    // Patient Details
    fullName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age cannot exceed 120'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    symptoms: { type: String, trim: true },
    notes: { type: String, trim: true },

    // Appointment Scheduling
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    // Uploaded Documents
    documents: [documentSchema],

    // Admin notes
    adminNotes: { type: String },

    // Tracking
    ipAddress: { type: String },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for faster queries
appointmentSchema.index({ mobile: 1 })
appointmentSchema.index({ appointmentDate: 1, status: 1 })
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 })
appointmentSchema.index({ status: 1 })
appointmentSchema.index({ createdAt: -1 })

// Update timestamps on status change
appointmentSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'confirmed') this.confirmedAt = new Date()
    if (this.status === 'completed') this.completedAt = new Date()
    if (this.status === 'cancelled') this.cancelledAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Appointment', appointmentSchema)
