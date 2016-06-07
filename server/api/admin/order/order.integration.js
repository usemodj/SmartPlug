'use strict';

var app = require('../../..');
import request from 'supertest';

var newAdminOrder;

describe('AdminOrder API:', function() {

  describe('GET /api/admin/orders', function() {
    var adminOrders;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/orders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminOrders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      adminOrders.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/admin/orders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/admin/orders')
        .send({
          name: 'New AdminOrder',
          info: 'This is the brand new adminOrder!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAdminOrder = res.body;
          done();
        });
    });

    it('should respond with the newly created adminOrder', function() {
      newAdminOrder.name.should.equal('New AdminOrder');
      newAdminOrder.info.should.equal('This is the brand new adminOrder!!!');
    });

  });

  describe('GET /api/admin/orders/:id', function() {
    var adminOrder;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/orders/' + newAdminOrder._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      adminOrder = {};
    });

    it('should respond with the requested adminOrder', function() {
      adminOrder.name.should.equal('New AdminOrder');
      adminOrder.info.should.equal('This is the brand new adminOrder!!!');
    });

  });

  describe('PUT /api/admin/orders/:id', function() {
    var updatedAdminOrder;

    beforeEach(function(done) {
      request(app)
        .put('/api/admin/orders/' + newAdminOrder._id)
        .send({
          name: 'Updated AdminOrder',
          info: 'This is the updated adminOrder!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAdminOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAdminOrder = {};
    });

    it('should respond with the updated adminOrder', function() {
      updatedAdminOrder.name.should.equal('Updated AdminOrder');
      updatedAdminOrder.info.should.equal('This is the updated adminOrder!!!');
    });

  });

  describe('DELETE /api/admin/orders/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/admin/orders/' + newAdminOrder._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when adminOrder does not exist', function(done) {
      request(app)
        .delete('/api/admin/orders/' + newAdminOrder._id)
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
