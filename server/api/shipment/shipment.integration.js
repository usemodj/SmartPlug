'use strict';

var app = require('../..');
import request from 'supertest';

var newShipment;

describe('Shipment API:', function() {

  describe('GET /api/shipments', function() {
    var shipments;

    beforeEach(function(done) {
      request(app)
        .get('/api/shipments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shipments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shipments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/shipments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/shipments')
        .send({
          name: 'New Shipment',
          info: 'This is the brand new shipment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newShipment = res.body;
          done();
        });
    });

    it('should respond with the newly created shipment', function() {
      newShipment.name.should.equal('New Shipment');
      newShipment.info.should.equal('This is the brand new shipment!!!');
    });

  });

  describe('GET /api/shipments/:id', function() {
    var shipment;

    beforeEach(function(done) {
      request(app)
        .get('/api/shipments/' + newShipment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shipment = res.body;
          done();
        });
    });

    afterEach(function() {
      shipment = {};
    });

    it('should respond with the requested shipment', function() {
      shipment.name.should.equal('New Shipment');
      shipment.info.should.equal('This is the brand new shipment!!!');
    });

  });

  describe('PUT /api/shipments/:id', function() {
    var updatedShipment;

    beforeEach(function(done) {
      request(app)
        .put('/api/shipments/' + newShipment._id)
        .send({
          name: 'Updated Shipment',
          info: 'This is the updated shipment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedShipment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedShipment = {};
    });

    it('should respond with the updated shipment', function() {
      updatedShipment.name.should.equal('Updated Shipment');
      updatedShipment.info.should.equal('This is the updated shipment!!!');
    });

  });

  describe('DELETE /api/shipments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/shipments/' + newShipment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when shipment does not exist', function(done) {
      request(app)
        .delete('/api/shipments/' + newShipment._id)
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
