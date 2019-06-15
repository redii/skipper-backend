const mongoose = require('mongoose')

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: Date
})

module.exports = AnnouncementSchema
