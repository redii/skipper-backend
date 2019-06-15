const express = require('express')
const router = express.Router()
const mongoose = require('../mongooseHandler')
const AnnouncementSchema = require('../models/Announcement')
const Announcement = mongoose.model('announcements', AnnouncementSchema)

router.get('/announcements', (req, res, next) => {
  Announcement.find({}, function(err, announcements) {
    res.json({
      success: true,
      announcements: announcements
    })
  })
})

module.exports = router
