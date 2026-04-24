const router = require('express').Router()
const Doctor = require('../models/Doctor')
const { protect } = require('../middleware/auth')

// GET /api/doctors — public, list all active doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ experience: -1 })
    res.json({ doctors, count: doctors.length })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors' })
  }
})

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json({ doctor })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctor' })
  }
})

// POST /api/doctors — admin only
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json({ doctor, message: 'Doctor created successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATCH /api/doctors/:id — admin only
router.patch('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json({ doctor, message: 'Doctor updated' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
