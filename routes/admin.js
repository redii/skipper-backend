const express = require('express')
const router = express.Router()
const mongoose = require('../mongooseHandler')
const UserSchema = require('../models/User')
const User = mongoose.model('users', UserSchema)
const ObjectId = require('mongodb').ObjectID

router.get('/users', (req, res, next) => {
  User.find({}, function(err, users) {
    res.json({
      success: true,
      users: users
    })
  })
})

router.post('/users/add', (req, res, next) => {
  res.json({
    success: true,
    message: 'Feature not available yet.'
  })
})

router.post('/users/delete', (req, res, next) => {
  if (req.body.id) {
    User.deleteOne({ _id: ObjectId(req.body.id) }, (err) => {
      if (!err) {
        res.json({
          success: true,
          message: 'User successfully deleted.'
        })
      } else {
        res.json({
          success: false,
          message: 'Error while deleting user.'
        })
      }
    })
  } else {
    res.json({
      success: false,
      message: 'Please provide an id.'
    })
  }
})

module.exports = router
