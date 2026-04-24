require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')

// Route imports
const authRoutes = require('./routes/auth')
const doctorRoutes = require('./routes/doctors')
const appointmentRoutes = require('./routes/appointments')
const adminRoutes = require('./routes/admin')
const fileRoutes = require('./routes/files')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Strict rate limit on appointment submission
const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many appointment submissions. Please try again in an hour.' },
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentLimiter, appointmentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/files', fileRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mahatme Eye Hospital API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// ─── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max size is 10MB.' })
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: errors.join(', ') })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' })
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

// ─── Database & Server Start ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mahatme-eye-hospital')
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Mahatme Eye Hospital API running on port ${PORT}`)
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
      if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => console.log('Server running'));
}
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

// At the bottom of server.js, replace app.listen(...) with:
module.exports = app;
