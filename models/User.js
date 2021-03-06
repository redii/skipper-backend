const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false },
  permissions: { type: Array, required: false },
  createdOn: Date
})

module.exports = UserSchema
