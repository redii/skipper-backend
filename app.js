var express = require('express')
var app = express()
var cors = require('cors')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload')
var expressJWT = require('express-jwt')
var guard = require('express-jwt-permissions')({
  permissionsProperty: 'permissions'
})
var secret = process.env.SECRET || 'qwe123'

var jwtHandler = require('./jwtHandler.js')
var indexRouter = require('./routes/index.js')
var homeRouter = require('./routes/home.js')
var adminRouter = require('./routes/admin.js')
var filesRouter = require('./routes/files.js')
var bankingRouter = require('./routes/banking.js')

app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'uploads/tmp/'
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressJWT({ secret: secret }).unless({
  path: ['/api/status', '/api/user/login', '/api/user/signup']
}))

// Entrypoint and authentication
app.use('/api', indexRouter)
app.use('/api/user/signup', jwtHandler.signup)
app.use('/api/user/login', jwtHandler.login)

// Home module
app.use('/api/home', homeRouter)

// Admin module
app.use('/api/admin', guard.check('admin'), adminRouter)

// Upload module
app.use('/api/files', guard.check([['admin'], ['default']]), filesRouter)

// Banking module
app.use('/api/banking', guard.check([['admin'], ['default']]), bankingRouter)

module.exports = app
