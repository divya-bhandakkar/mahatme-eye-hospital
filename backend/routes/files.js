const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { protect } = require('../middleware/auth')

// GET /api/files/:filename — protected, serve uploaded file
router.get('/:filename', protect, (req, res) => {
  const filename = req.params.filename
  // Sanitize filename to prevent directory traversal
  const safeName = path.basename(filename)
  const filePath = path.join(__dirname, '../uploads', safeName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' })
  }

  res.sendFile(filePath)
})

module.exports = router
