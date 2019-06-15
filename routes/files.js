const express = require('express')
const router = express.Router()

router.post('/upload', (req, res, next) => {
  console.log(req.files)
  if (req.files.upload) {
    res.json({
      success: true,
      message: 'Feature not available yet.'
    })
  } else {
    res.json({
      success: false,
      message: 'No file to upload provided.'
    })
  }
})

module.exports = router
