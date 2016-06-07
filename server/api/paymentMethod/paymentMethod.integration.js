'use strict';

var app = require('../..');
import request from 'supertest';

var newPaymentMethod;

describe('PaymentMethod API:', function() {

  describe('GET /api/paymentMethods', function() {
    var paymentMethods;

    beforeEach(function(done) {
      request(app)
        .get('/api/paymentMethods')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          paymentMethods = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      paymentMethods.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/paymentMethods', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/paymentMethods')
        .send({
          name: 'New PaymentMethod',
          info: 'This is the brand new paymentMethod!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPaymentMethod = res.body;
          done();
        });
    });

    it('should respond with the newly created paymentMethod', function() {
      newPaymentMethod.name.should.equal('New PaymentMethod');
      newPaymentMethod.info.should.equal('This is the brand new paymentMethod!!!');
    });

  });

  describe('GET /api/paymentMethods/:id', function() {
    var paymentMethod;

    beforeEach(function(done) {
      request(app)
        .get('/api/paymentMethods/' + newPaymentMethod._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          paymentMethod = res.body;
          done();
        });
    });

    afterEach(function() {
      paymentMethod = {};
    });

    it('should respond with the requested paymentMethod', function() {
      paymentMethod.name.should.equal('New PaymentMethod');
      paymentMethod.info.should.equal('This is the brand new paymentMethod!!!');
    });

  });

  describe('PUT /api/paymentMethods/:id', function() {
    var updatedPaymentMethod;

    beforeEach(function(done) {
      request(app)
        .put('/api/paymentMethods/' + newPaymentMethod._id)
        .send({
          name: 'Updated PaymentMethod',
          info: 'This is the updated paymentMethod!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPaymentMethod = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPaymentMethod = {};
    });

    it('should respond with the updated paymentMethod', function() {
      updatedPaymentMethod.name.should.equal('Updated PaymentMethod');
      updatedPaymentMethod.info.should.equal('This is the updated paymentMethod!!!');
    });

  });

  describe('DELETE /api/paymentMethods/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/paymentMethods/' + newPaymentMethod._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when paymentMethod does not exist', function(done) {
      request(app)
        .delete('/api/paymentMethods/' + newPaymentMethod._id)
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
