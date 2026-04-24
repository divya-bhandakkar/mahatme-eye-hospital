const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const Admin = require('../models/Admin')
const { protect } = require('../middleware/auth')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' })

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    try {
      const { email, password } = req.body
      const admin = await Admin.findOne({ email }).select('+password')

      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isMatch = await admin.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Update last login
      admin.lastLogin = new Date()
      await admin.save({ validateBeforeSave: false })

      const token = signToken(admin._id)

      res.json({
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ message: 'Server error during login' })
    }
  }
)

// GET /api/auth/me  (protected)
router.get('/me', protect, (req, res) => {
  res.json({ admin: req.admin })
})

module.exports = router
