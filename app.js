var express = require('express')
var app = express()
var cors = require('cors')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')

var jwtHandler = require('./jwtHandler.js')
var indexRouter = require('./routes/index.js')
var adminRouter = require('./routes/admin.js')

app.use(cors())
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Entrypoint
app.use('/api', indexRouter)

// Website
app.use('/api/user/signup', jwtHandler.signup)
app.use('/api/user/login', jwtHandler.login)

// Admin module
app.use('/api/admin', adminRouter)

module.exports = app
