const express = require('express')
const router = express.Router()
const fs = require('fs')
const mongoose = require('../mongooseHandler')
const FileSchema = require('../models/File')
const File = mongoose.model('files', FileSchema)
const ObjectId = require('mongodb').ObjectID

router.get('/', (req, res, next) => {
  File.find({ owner: req.user.name }, (err, files) => {
    if (err) {
      res.json({
        success: false,
        message: 'Error occured while loading files.'
      })
    } else {
      res.json({
        success: true,
        message: 'Files found.',
        files: files
      })
    }
  })
})

router.post('/upload', (req, res, next) => {
  var file = req.files.upload
  var filepath = `uploads/${req.user.name}/${file.name}`
  if (file) {
    var newFile = new File({
      name: file.name,
      size: file.size,
      path: filepath,
      owner: req.user.name,
      date: Date.now()
    })
    newFile.save((err) => {
      if (!err) {
        file.mv(filepath, (err) => {
          if (err) {
            res.json({
              success: false,
              message: 'Error occured while saving in filesystem.'
            })
          } else {
            res.json({
              success: true,
              message: 'File has been uploaded.'
            })
          }
        })
      } else {
        res.json({
          success: false,
          message: 'File already exists in database.'
        })
      }
    })
  } else {
    res.json({
      success: false,
      message: 'Please provide a file to upload.'
    })
  }
})

router.get('/download/:id', (req, res, next) => {
  req.params.id
  if (req.params.id) {
    File.findOne({ _id: ObjectId(req.params.id), owner: req.user.name }, (err, file) => {
      res.download(file.path, file.name)
    })
  }
})

router.post('/delete', (req, res, next) => {
  if (req.body.id) {
    File.findOne({ _id: ObjectId(req.body.id) }, (err, file) => {
      File.deleteOne({ _id: ObjectId(req.body.id) }, (err) => {
        if (!err) {
          fs.unlink(file.path, (err) => {
            if (err) {
              res.json({
                success: false,
                message: 'Error while deleting from filesystem.'
              })
            } else {
              res.json({
                success: true,
                message: 'File successfully deleted.'
              })
            }
          })
        } else {
          res.json({
            success: false,
            message: 'Error while deleting from database.'
          })
        }
      })
    })
  } else {
    res.json({
      success: false,
      message: 'Please provide an id.'
    })
  }
})

module.exports = router
