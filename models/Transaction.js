const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  owner: String,
  category: String,
  date: Date,
  account: String,
  transactiondate: Date,
  valutadate: Date,
  bookingtype: String,
  usage: String,
  creditorID: String,
  mandateReference: String,
  customerReference: String,
  collectorReference: String,
  debitOriginalAmount: Number,
  debitReturnAmount: Number,
  name: String,
  iban: String,
  bic: String,
  amount: Number,
  currency: String,
  info: String
})

module.exports = TransactionSchema
