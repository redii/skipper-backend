var express = require('express')
var app = express()
var cors = require('cors')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var c = require('./config.js')

var jwtHandler = require('./jwtHandler.js')
var indexRouter = require('./routes/index')

app.use(cors())
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', indexRouter)

app.use('/api/user/signup', jwtHandler.signup)
app.use('/api/user/login', jwtHandler.login)

module.exports = app
