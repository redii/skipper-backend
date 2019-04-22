const mongoose = require('mongoose')
const mongodburi = process.env.MONGODBURI || ''

mongoose.connect(c.mongodburi, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err
  } else {
    console.log(`Successfully connected to database.`)
  }
})
mongoose.set('useCreateIndex', true)

module.exports = mongoose
