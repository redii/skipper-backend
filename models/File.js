const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
  name: String,
  size: String,
  path: { type: String, required: true, unique: true },
  owner: String,
  date: Date
})

module.exports = FileSchema
