const express = require('express')
const router = express.Router()
const mongoose = require('../mongooseHandler')
const TransactionSchema = require('../models/Transaction')
const Transaction = mongoose.model('transactions', TransactionSchema)
const TransactionCategorySchema = require('../models/TransactionCategory')
const TransactionCategory = mongoose.model('transactionCategories', TransactionCategorySchema)
const ObjectId = require('mongodb').ObjectID
const moment = require('moment')
const csv = require('fast-csv')
const fs = require('fs')

router.post('/import', (req, res, next) => {
  var file = req.files.upload
  if (file) {

    csv.parseFile(file.tempFilePath, {
      delimiter: ';',
      headers: true
    })
    .on('data', (transaction) => {
      var transactiondateChars = transaction['Buchungstag'].split('.')
      var transactiondate = `20${transactiondateChars[2]}-${transactiondateChars[1]}-${transactiondateChars[0]}`
      var valutadateChars = transaction['Valutadatum'].split('.')
      var valutadate = `20${valutadateChars[2]}-${valutadateChars[1]}-${valutadateChars[0]}`
      var amount = transaction['Betrag'] ? parseFloat(transaction['Betrag'].replace(',', '.')) : 0
      var debitOriginalAmount = transaction['Lastschrift Ursprungsbetrag'] ? parseFloat(transaction['Lastschrift Ursprungsbetrag'].replace(',', '.')) : 0
      var debitReturnAmount = transaction['Auslagenersatz Ruecklastschrift'] ? parseFloat(transaction['Auslagenersatz Ruecklastschrift'].replace(',', '.')) : 0

      Transaction.findOne({
        owner: req.user.name,
        date: transactiondate,
        usage: transaction['Verwendungszweck'],
        amount: amount
      }, (err, result) => {
        if (!result) {
          var newTransaction = new Transaction({
            owner: req.user.name,
            category: null,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            account: transaction['Auftragskonto'],
            transactiondate: transactiondate,
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

router.get('/transaction_uncategorized', (req, res, next) => {
  Transaction
  .find({ owner: req.user.name, category: null })
  .sort({ transactiondate: -1 })
  .exec((err, transactions) => {
    if (err) {
      res.json({
        success: false,
        message: 'Error occured while fetching transactions.'
      })
    } else {
      res.json({
        success: true,
        message: 'Transactions found.',
        transactions: transactions
      })
    }
  })
})

router.get('/transaction_categories', (req, res, next) => {
  TransactionCategory
  .find({ owner: req.user.name }, (err, transactionCategories) => {
    if (err) {
      res.json({
        success: false,
        message: 'Error occured while fetching transaction categories.'
      })
    } else {
      res.json({
        success: true,
        message: 'Transaction categories fetched.',
        transactionCategories: transactionCategories
      })
    }
  })
})

router.get('/transaction_statistics', (req, res, next) => {
  Transaction.count({ owner: req.user.name }, (err, count) => {
    if (err) {
      res.json({
        success: false,
        message: 'Error occured while counting transaction.'
      })
    } else {
      Transaction.count({ owner: req.user.name, category: null }, (err, uncategorizedCount) => {
        if (err) {
          res.json({
            success: false,
            message: 'Error occured while counting transaction.'
          })
        } else {
          Transaction.findOne({ owner: req.user.name }).sort({ date: -1 }).exec((err, transaction) => {
            if (err || transaction == null) {
              res.json({
                success: false,
                message: 'Error occured while fetching last inserted transaction.'
              })
            } else {
              res.json({
                success: true,
                message: 'Transaction statistic fetched.',
                statistic: {
                  lastInsert: transaction.date,
                  count: count,
                  uncategorizedCount: uncategorizedCount
                }
              })
            }
          })
        }
      })
    }
  })
})

router.post('/transaction_categorize', (req, res, next) => {
  req.body.transactions.map((id) => {
    Transaction.findOne({ _id: ObjectId(id) }).then((transaction, err) => {
      if (err || transaction == null) {
        res.json({
          success: false,
          message: 'Error occured while updating.'
        })
      } else {
        transaction.category = req.body.category
        transaction.save((err, transaction, count) => {
          if (err) {
            res-json({
              success: false,
              message: 'Error occured while updating transaction.'
            })
          } else {
            res.json({
              success: true,
              message: 'Transaction categorized.'
            })
          }
        })
      }
    })
  })
})

module.exports = router
