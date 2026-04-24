const router = require('express').Router()
const { body, query, validationResult } = require('express-validator')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const upload = require('../middleware/upload')

// GET /api/appointments — fetch all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean()
    res.json({ appointments, total: appointments.length })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' })
  }
})

// DELETE /api/appointments/:id — delete by id
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json({ message: 'Appointment deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete appointment' })
  }
})

// GET /api/appointments/slots?doctorId=&date=
router.get('/slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date are required' })
    }

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const booked = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    }).select('appointmentTime')

    const bookedTimes = booked.map((a) => a.appointmentTime)

    const ALL_SLOTS = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    ]

    const available = ALL_SLOTS.filter((s) => !bookedTimes.includes(s))

    res.json({ available, booked: bookedTimes, total: ALL_SLOTS.length })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch slots' })
  }
})

// GET /api/appointments/:id — get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json({ appointment })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointment' })
  }
})

// POST /api/appointments — public booking
router.post(
  '/',
  upload.array('documents', 5),
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 100 }),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Valid age required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender required'),
    body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('doctorId').notEmpty().withMessage('Doctor selection is required'),
    body('doctorName').notEmpty().withMessage('Doctor name is required'),
    body('appointmentDate').notEmpty().withMessage('Appointment date is required'),
    body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() })
    }

    try {
      const {
        fullName, age, gender, mobile, email, address,
        doctorId, doctorName, specialization,
        appointmentDate, appointmentTime, symptoms, notes,
      } = req.body

      // Check doctor exists
      const doctor = await Doctor.findById(doctorId)
      if (!doctor) return res.status(404).json({ message: 'Selected doctor not found' })

      // Check slot availability
      const startOfDay = new Date(appointmentDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(appointmentDate)
      endOfDay.setHours(23, 59, 59, 999)

      const existing = await Appointment.findOne({
        doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        appointmentTime,
        status: { $in: ['pending', 'confirmed'] },
      })

      if (existing) {
        return res.status(409).json({
          message: 'This time slot is already booked. Please select another slot.',
        })
      }

      // Handle uploaded files
      const documents = (req.files || []).map((f) => ({
        filename: f.filename,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        path: f.path,
      }))

      const appointment = await Appointment.create({
        fullName,
        age: parseInt(age),
        gender,
        mobile,
        email,
        address,
        doctorId,
        doctorName,
        specialization: specialization || doctor.specialization,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        symptoms,
        notes,
        documents,
        ipAddress: req.ip,
      })

      res.status(201).json({
        message: 'Appointment booked successfully! Our team will contact you to confirm.',
        appointment,
      })
    } catch (err) {
      console.error('Appointment booking error:', err)
      res.status(500).json({ message: err.message || 'Failed to book appointment' })
    }
  }
)

module.exports = router
