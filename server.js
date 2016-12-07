start()
function start () {
  'use strict'

  const express = require('express')
  const app = express()

  setupMiddleware()
  addRoutes()

  function addRoutes () {
    // TODO: Factor out logic for the return response (Maybe use a curry function)

    const Item = require('./models/item')

    app.get('/items', (req, res) => {
      Item.find((err, items) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error'
          })
        }
        res.json(items)
      })
    })

    app.post('/items', (req, res) => {
      Item.create({
        name: req.body.name
      }, (err, item) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error'
          })
        } else {
          res.status(201).json(item)
        }
      })
    })

    app.use('*', (req, res) => {
      res.status(404).json({
        message: 'Not Found'
      })
    })
  }

  function setupMiddleware () {
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')

    const config = require('./config')

    app.use(bodyParser.json())
    app.use(express.static('public'))

    function runServer (callback) {
      mongoose.connect(config.DATABASE_URL, (err) => {
        if (err && callback) {
          return callback(err)
        }

        app.listen(config.PORT, () => {
          console.log('Listening on localhost: ', config.PORT)
          if (callback) {
            callback()
          }
        })
      })
    }

    if (require.main === module) {
      runServer(err => {
        if (err) {
          console.error(err)
        }
      })
    }

    exports.app = app
    exports.runServer = runServer
  }
}
