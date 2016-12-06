start()
function start () {
  'use strict'
  const express = require('express')
  const bodyParser = require('body-parser')
  const mongoose = require('mongoose')

  const config = require('./config')

  const app = express()

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
