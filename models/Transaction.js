const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  owner: String,
  category: String,
  date: String,
  account: String,
  transactiondate: String,
  valutadate: String,
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
