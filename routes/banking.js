const express = require('express')
const router = express.Router()
const mongoose = require('../mongooseHandler')
const TransactionSchema = require('../models/Transaction')
const Transaction = mongoose.model('transactions', TransactionSchema)
const csv = require('fast-csv')
const fs = require('fs')

router.post('/upload', (req, res, next) => {
  var file = req.files.upload
  if (file) {
    
    csv.parseFile(file.tempFilePath, {
      delimiter: ';',
      headers: true
    })
    .on('data', (transaction) => {
      var dateChars = transaction['Buchungstag'].split('.')
      var date = new Date(`20${dateChars[2]}`, dateChars[1], dateChars[0])
      var valutadateChars = transaction['Valutadatum'].split('.')
      var valutadate = new Date(`20${valutadateChars[2]}`, valutadateChars[1], valutadateChars[0])
      var amount = transaction['Betrag'] ? parseFloat(transaction['Betrag'].replace(',', '.')) : 0
      var debitOriginalAmount = transaction['Lastschrift Ursprungsbetrag'] ? parseFloat(transaction['Lastschrift Ursprungsbetrag'].replace(',', '.')) : 0
      var debitReturnAmount = transaction['Auslagenersatz Ruecklastschrift'] ? parseFloat(transaction['Auslagenersatz Ruecklastschrift'].replace(',', '.')) : 0

      Transaction.findOne({
        owner: req.user.name,
        date: date,
        usage: transaction['Verwendungszweck'],
        amount: amount
      }, (err, result) => {
        if (!result) {
          var newTransaction = new Transaction({
            owner: req.user.name,
            account: transaction['Auftragskonto'],
            date: date,
            valutadate: valutadate,
            bookingtype: transaction['Buchungstext'],
            usage: transaction['Verwendungszweck'],
            creditorID: transaction['Glaeubiger ID'],
            mandateReference: transaction['Mandatsreferenz'],
            customerReference: transaction['Kundenreferenz (End-to-End)'],
            collectorReference: transaction['Sammlerreferenz'],
            debitOriginalAmount: debitOriginalAmount,
            debitReturnAmount: debitReturnAmount,
            name: transaction['Beguenstigter/Zahlungspflichtiger'],
            iban: transaction['Kontonummer/IBAN'],
            bic: transaction['BIC (SWIFT-Code)'],
            amount: amount,
            currency: transaction['Waehrung'],
            info: transaction['Info']
          })
          newTransaction.save()
        }
      })
    })
    .on('end', (rowCount) => {
      fs.unlink(file.tempFilePath, (err) => {
        if (!err) {
          res.json({
            success: true,
            message: `Transactions imported.`
          })
        }
      })
    })
  }
})

module.exports = router
