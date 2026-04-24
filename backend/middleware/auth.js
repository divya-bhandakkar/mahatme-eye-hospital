const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')

    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin account not found or deactivated.' })
    }

    req.admin = admin
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' })
    }
    res.status(500).json({ message: 'Authentication error' })
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
  }
  next()
}

module.exports = { protect, requireRole }
