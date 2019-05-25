const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 10
const mongoose = require('./mongooseHandler')
const UserSchema = require('./models/User')
const secret = process.env.SECRET || 'qwe123'

let signup = (req, res, next) => {
  const admin = false
  const username = req.body.user.usernameSignup
  const password = req.body.user.passwordSignup
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      const password = hash
      const User = mongoose.model('users', UserSchema)
      const newUser = new User({ admin, username, password })
      newUser.save(function(err) {
        if (!err) {
          res.json({
            success: true,
            message: 'Registration successful!'
          })
        } else {
          res.json({
            success: false,
            message: 'Registration failed.'
          })
        }
      })
    })
  })
}

let login = (req, res, next) => {
  const { username, password } = req.body.user
  const User = mongoose.model('users', UserSchema)
  User.findOne({ name: username }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          let token = jwt.sign({
            user: {
              admin: user.admin,
              name: user.name,
              email: user.email
            },
            permissions: user.permissions
          }, secret, { expiresIn: '1h' })
          res.json({
            success: true,
            message: 'Authentication successful!',
            token: token
          })
        } else {
          res.json({
            success: false,
            message: 'Incorrect username or password.'
          })
        }
      })
    } else {
      res.json({
        success: false,
        message: 'Incorrect username or password.'
      })
    }
  })
}

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is invalid'
        })
      } else {
        req.decoded = decoded;
        next()
      }
    })
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}

module.exports = {
  signup: signup,
  login: login,
  checkToken: checkToken
}
