var express = require('express')
var router = express.Router()
var jwt = require('../jwtHandler')

router.get('/info', (req, res, next) => {
  res.json({
    success: true,
    message: 'This is the backend for my personal website. It uses Json Web Token for authorization. You can get on from the /api/user/login endpoint.'
  })
})

router.get('/status', (req, res, next) => {
  res.json({
    success: true,
    message: 'API is up and running'
  })
})

router.get('/test', (req, res, next) => {
  jwt.checkToken(req, res, next)
  res.json({
    success: true,
    message: 'Token is valid'
  })
})

module.exports = router
