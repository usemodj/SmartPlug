'use strict';

var app = require('../..');
import request from 'supertest';

var newAddress;

describe('Address API:', function() {

  describe('GET /api/addresses', function() {
    var addresss;

    beforeEach(function(done) {
      request(app)
        .get('/api/addresses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          addresss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      addresss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/addresses', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/addresses')
        .send({
          name: 'New Address',
          info: 'This is the brand new address!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAddress = res.body;
          done();
        });
    });

    it('should respond with the newly created address', function() {
      newAddress.name.should.equal('New Address');
      newAddress.info.should.equal('This is the brand new address!!!');
    });

  });

  describe('GET /api/addresses/:id', function() {
    var address;

    beforeEach(function(done) {
      request(app)
        .get('/api/addresses/' + newAddress._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          address = res.body;
          done();
        });
    });

    afterEach(function() {
      address = {};
    });

    it('should respond with the requested address', function() {
      address.name.should.equal('New Address');
      address.info.should.equal('This is the brand new address!!!');
    });

  });

  describe('PUT /api/addresses/:id', function() {
    var updatedAddress;

    beforeEach(function(done) {
      request(app)
        .put('/api/addresses/' + newAddress._id)
        .send({
          name: 'Updated Address',
          info: 'This is the updated address!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAddress = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAddress = {};
    });

    it('should respond with the updated address', function() {
      updatedAddress.name.should.equal('Updated Address');
      updatedAddress.info.should.equal('This is the updated address!!!');
    });

  });

  describe('DELETE /api/addresses/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/addresses/' + newAddress._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when address does not exist', function(done) {
      request(app)
        .delete('/api/addresses/' + newAddress._id)
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
