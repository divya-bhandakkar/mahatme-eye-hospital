const router = require('express').Router()
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const { protect } = require('../middleware/auth')

// All admin routes are protected
router.use(protect)

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, pending, confirmed, completed, cancelled, todayCount] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ])

    // Last 7 days trend
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const weeklyTrend = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({ total, pending, confirmed, completed, cancelled, today: todayCount, weeklyTrend })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
})

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
  try {
    const {
      page = 1, limit = 10, status, search, doctorId,
      dateFrom, dateTo, sort = '-createdAt',
    } = req.query

    const filter = {}
    if (status && status !== 'all') filter.status = status
    if (doctorId) filter.doctorId = doctorId
    if (dateFrom || dateTo) {
      filter.appointmentDate = {}
      if (dateFrom) filter.appointmentDate.$gte = new Date(dateFrom)
      if (dateTo) filter.appointmentDate.$lte = new Date(dateTo)
    }
    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [
        { fullName: regex },
        { doctorName: regex },
        { mobile: regex },
        { email: regex },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Appointment.countDocuments(filter),
    ])

    res.json({
      appointments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' })
  }
})

// GET /api/admin/appointments/:id
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId', 'name specialization image')
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json({ appointment })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointment' })
  }
})

// PATCH /api/admin/appointments/:id/status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { status, adminNotes, cancelReason } = req.body
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const update = { status }
    if (adminNotes) update.adminNotes = adminNotes
    if (cancelReason && status === 'cancelled') update.cancelReason = cancelReason

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, {
      new: true, runValidators: true,
    })

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })

    res.json({ appointment, message: `Status updated to ${status}` })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' })
  }
})

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json({ message: 'Appointment deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete appointment' })
  }
})

module.exports = router
