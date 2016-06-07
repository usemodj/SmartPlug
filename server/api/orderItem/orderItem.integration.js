'use strict';

var app = require('../..');
import request from 'supertest';

var newOrderItem;

describe('OrderItem API:', function() {

  describe('GET /api/orderItems', function() {
    var orderItems;

    beforeEach(function(done) {
      request(app)
        .get('/api/orderItems')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          orderItems = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      orderItems.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/orderItems', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/orderItems')
        .send({
          name: 'New OrderItem',
          info: 'This is the brand new orderItem!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOrderItem = res.body;
          done();
        });
    });

    it('should respond with the newly created orderItem', function() {
      newOrderItem.name.should.equal('New OrderItem');
      newOrderItem.info.should.equal('This is the brand new orderItem!!!');
    });

  });

  describe('GET /api/orderItems/:id', function() {
    var orderItem;

    beforeEach(function(done) {
      request(app)
        .get('/api/orderItems/' + newOrderItem._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          orderItem = res.body;
          done();
        });
    });

    afterEach(function() {
      orderItem = {};
    });

    it('should respond with the requested orderItem', function() {
      orderItem.name.should.equal('New OrderItem');
      orderItem.info.should.equal('This is the brand new orderItem!!!');
    });

  });

  describe('PUT /api/orderItems/:id', function() {
    var updatedOrderItem;

    beforeEach(function(done) {
      request(app)
        .put('/api/orderItems/' + newOrderItem._id)
        .send({
          name: 'Updated OrderItem',
          info: 'This is the updated orderItem!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOrderItem = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrderItem = {};
    });

    it('should respond with the updated orderItem', function() {
      updatedOrderItem.name.should.equal('Updated OrderItem');
      updatedOrderItem.info.should.equal('This is the updated orderItem!!!');
    });

  });

  describe('DELETE /api/orderItems/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/orderItems/' + newOrderItem._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when orderItem does not exist', function(done) {
      request(app)
        .delete('/api/orderItems/' + newOrderItem._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
