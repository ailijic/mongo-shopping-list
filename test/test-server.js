/* global it, before, after, describe */

start()
function start () {
  'use strict'

  global.DATABASE_URL = 'mongodb://localhost/shopping-list-test'

  // Import testing library
  const chai = require('chai')
  const chaiHttp = require('chai-http')

  // Import project modules
  const server = require('../server.js')
  const Item = require('../models/item')

  main()
  function main () {
    // Create variables needed to run test framework
    const should = chai.should() // eslint-disable-line 
    const expect = chai.expect
    const app = server.app

    chai.use(chaiHttp)

    // Start of tests
    describe('Shopping List', () => {
      // Declare object that will be used for the initial DB config
      const initDB = [
        {name: 'Broad beans'},
        {name: 'Tomatoes'},
        {name: 'Peppers'}
      ]

      before(done => server.runServer(
        () => {
          Item.create(
            initDB[0],
            initDB[1],
            initDB[2],
            () => done()
          )
        }
      ))

      after(done => {
        Item.remove(() => done())
      })

      // Generic test
      function aTest (stat, len, done, err, res) {
        expect(err).to.be.null
        res.should.have.status(stat)
        res.should.be.json
        res.body.should.be.an('array')
        res.body.length.should.equal(len)
        res.body.forEach((data, index) => {
          data.should.be.an('object')
          data.should.have.property('_id')
          data.should.have.property('name')
          data._id.should.be.a('string')
          data.name.should.be.a('string')
          data.name.should.equal(initDB[index].name)
        })
        done()
      }

      it('should list items on GET', done => {
        const stat = 200
        const len = initDB.length
        const myTest = curryIt(aTest, stat, len, done)
        chai.request(app)
          .get('/items')
          .end(myTest)
      })
      /*
      it('should add an item on POST', (done) => {
        chai.request(app)
          .post('/items')
          .send({'name': 'Kale'})
          .end((err, res) => {
            should.equal(err, null)
            res.should.have.status(201)
            res.should.be.json
            res.body.should.be.a('object')
            res.body.should.have.property('name')
            res.body.should.have.property('id')
            res.body.name.should.be.a('string')
            res.body.id.should.be.a('number')
            res.body.name.should.equal('Kale')
            storage.items.should.be.a('array')
            storage.items.should.have.length(4)
            storage.items[3].should.be.a('object')
            storage.items[3].should.have.property('id')
            storage.items[3].should.have.property('name')
            storage.items[3].id.should.be.a('number')
            storage.items[3].name.should.be.a('string')
            storage.items[3].name.should.equal('Kale')
            done()
          })
      })
      it('should delete an item on DELETE', (done) => {
        const id = 2
        const length = 3
        chai.request(app)
          .delete('/items/' + id)
          .end((err, res) => {
            should.equal(err, null)
            res.should.have.status(200)
            res.should.not.be.json
            res.body.should.be.a('object')
            res.body.should.deep.equal({})
            storage.items.should.be.a('array')
            storage.items.should.have.length(length)
            storage.items[id].should.be.a('object')
            storage.items[id].should.have.property('id')
            storage.items[id].should.have.property('name')
            storage.items[id].id.should.be.a('number')
            storage.items[id].name.should.be.a('string')
            storage.items[id].name.should.equal('Kale')
            done()
          })
      })
      it('should edit an item on PUT', (done) => {
        const id = 2
        const length = 4
        chai.request(app)
          .put('/items/' + id)
          .send({'name': 'Durian', 'id': id})
          .end((err, res) => {
            should.equal(err, null)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('object')
            res.body.should.have.property('name')
            res.body.should.have.property('id')
            res.body.name.should.be.a('string')
            res.body.id.should.be.a('number')
            res.body.name.should.equal('Durian')
            storage.items.should.be.a('array')
            storage.items.should.have.length(length)
            storage.items[id].should.be.a('object')
            storage.items[id].should.have.property('id')
            storage.items[id].should.have.property('name')
            storage.items[id].id.should.be.a('number')
            storage.items[id].name.should.be.a('string')
            storage.items[id + 1].name.should.equal('Durian')
            done()
          })
      })
      it('should POST to an ID that exists', (done) => {
        chai.request(app)
        .post('/items/')
        .send({'name': 'Peppers'})
        .end((err, res) => {
          should.equal(err, null)
          res.should.have.status(201)
          done()
        })
      })
      it('should not POST without body data', (done) => {
        chai.request(app)
        .post('/items/')
        .send({})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(400)
          done()
        })
      })
      it('should not POST with something other than valid JSON', (done) => {
        chai.request(app)
        .post('/items/')
        .send({'tom': '55'})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(400)
          done()
        })
      })
      it('should not PUT without an ID in the endpoint', (done) => {
        chai.request(app)
        .put('/items/')
        .send({'name': 'Soup', 'id': '5'})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })
      it('should not PUT with different ID in the endpoint than the body', (done) => {
        let id = 5
        chai.request(app)
        .put('/items/' + (id + 1))
        .send({'name': 'Soup', 'id': id})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })
      it("should PUT to an ID that doesn't exist", (done) => {
        let id = 7
        chai.request(app)
        .put('/items/' + (id))
        .send({'name': 'Soup', 'id': id})
        .end((err, res) => {
          should.equal(err, null)
          res.should.have.status(200)
          done()
        })
      })
      it('should not PUT without body data', (done) => {
        let id = 7
        chai.request(app)
        .put('/items/' + (id))
        .send({})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })
      it('should not PUT with something other than valid JSON', (done) => {
        let id = 7
        chai.request(app)
        .put('/items/' + (id))
        .send({})
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })
      it("should not DELETE an ID that doesn't exist", (done) => {
        let id = 69
        chai.request(app)
        .put('/items/' + id)
        .send()
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })
      it('should not DELETE without an ID in the endpoint', (done) => {
        let id = 69
        chai.request(app)
        .put('/items/')
        .send()
        .end((err, res) => {
          should.not.equal(err, null)
          res.should.have.status(404)
          done()
        })
      })  */

      function curryIt (func) {
        var parameters = Array.prototype.slice.call(arguments, 1)
        return function () {
          return func.apply(this, parameters.concat(
            Array.prototype.slice.call(arguments, 0)
          ))
        }
      }

      // ***** END OF MAIN *****
    })
  }
}
