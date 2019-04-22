const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  admin: { type: Boolean, required: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false }
})

module.exports = UserSchema
