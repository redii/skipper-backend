const mongoose = require('mongoose')
const mongodburi = process.env.MONGODBURI || 'mongodb://dev:qwe123@ds245512.mlab.com:45512/dev'

mongoose.connect(mongodburi, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err
  } else {
    console.log(`Successfully connected to database.`)
  }
})
mongoose.set('useCreateIndex', true)

module.exports = mongoose
