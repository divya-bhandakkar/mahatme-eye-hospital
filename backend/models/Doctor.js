const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL or filename
      default: null,
    },
    availability: {
      type: [String],
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    timings: {
      type: String,
      default: '9:00 AM – 5:00 PM',
    },
    color: {
      type: String,
      enum: ['teal', 'blue', 'purple', 'green', 'orange', 'rose', 'indigo'],
      default: 'teal',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual: appointment count
doctorSchema.virtual('appointmentCount', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctorId',
  count: true,
})

module.exports = mongoose.model('Doctor', doctorSchema)
