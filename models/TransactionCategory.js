const mongoose = require('mongoose')

const TransactionCategorySchema = new mongoose.Schema({
  name: String,
  owner: String
})

module.exports = TransactionCategorySchema
