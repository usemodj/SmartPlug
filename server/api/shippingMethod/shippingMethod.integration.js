'use strict';

var app = require('../..');
import request from 'supertest';

var newShippingMethod;

describe('ShippingMethod API:', function() {

  describe('GET /api/shippingMethods', function() {
    var shippingMethods;

    beforeEach(function(done) {
      request(app)
        .get('/api/shippingMethods')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shippingMethods = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shippingMethods.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/shippingMethods', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/shippingMethods')
        .send({
          name: 'New ShippingMethod',
          info: 'This is the brand new shippingMethod!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newShippingMethod = res.body;
          done();
        });
    });

    it('should respond with the newly created shippingMethod', function() {
      newShippingMethod.name.should.equal('New ShippingMethod');
      newShippingMethod.info.should.equal('This is the brand new shippingMethod!!!');
    });

  });

  describe('GET /api/shippingMethods/:id', function() {
    var shippingMethod;

    beforeEach(function(done) {
      request(app)
        .get('/api/shippingMethods/' + newShippingMethod._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shippingMethod = res.body;
          done();
        });
    });

    afterEach(function() {
      shippingMethod = {};
    });

    it('should respond with the requested shippingMethod', function() {
      shippingMethod.name.should.equal('New ShippingMethod');
      shippingMethod.info.should.equal('This is the brand new shippingMethod!!!');
    });

  });

  describe('PUT /api/shippingMethods/:id', function() {
    var updatedShippingMethod;

    beforeEach(function(done) {
      request(app)
        .put('/api/shippingMethods/' + newShippingMethod._id)
        .send({
          name: 'Updated ShippingMethod',
          info: 'This is the updated shippingMethod!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedShippingMethod = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedShippingMethod = {};
    });

    it('should respond with the updated shippingMethod', function() {
      updatedShippingMethod.name.should.equal('Updated ShippingMethod');
      updatedShippingMethod.info.should.equal('This is the updated shippingMethod!!!');
    });

  });

  describe('DELETE /api/shippingMethods/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/shippingMethods/' + newShippingMethod._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when shippingMethod does not exist', function(done) {
      request(app)
        .delete('/api/shippingMethods/' + newShippingMethod._id)
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
