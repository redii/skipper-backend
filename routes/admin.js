const express = require('express')
const router = express.Router()
const mongoose = require('../mongooseHandler')
const UserSchema = require('../models/User')
const User = mongoose.model('users', UserSchema)

router.get('/users', (req, res, next) => {
  User.find({}, function(err, users) {
    res.json({
      success: true,
      users: users
    })
  })
})

module.exports = router
