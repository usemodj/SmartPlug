'use strict';

var app = require('../../..');
import request from 'supertest';

var newAdminSupport;

describe('AdminSupport API:', function() {

  describe('GET /api/admin/supports', function() {
    var adminSupports;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/supports')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminSupports = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      adminSupports.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/admin/supports', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/admin/supports')
        .send({
          name: 'New AdminSupport',
          info: 'This is the brand new adminSupport!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAdminSupport = res.body;
          done();
        });
    });

    it('should respond with the newly created adminSupport', function() {
      newAdminSupport.name.should.equal('New AdminSupport');
      newAdminSupport.info.should.equal('This is the brand new adminSupport!!!');
    });

  });

  describe('GET /api/admin/supports/:id', function() {
    var adminSupport;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/supports/' + newAdminSupport._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminSupport = res.body;
          done();
        });
    });

    afterEach(function() {
      adminSupport = {};
    });

    it('should respond with the requested adminSupport', function() {
      adminSupport.name.should.equal('New AdminSupport');
      adminSupport.info.should.equal('This is the brand new adminSupport!!!');
    });

  });

  describe('PUT /api/admin/supports/:id', function() {
    var updatedAdminSupport;

    beforeEach(function(done) {
      request(app)
        .put('/api/admin/supports/' + newAdminSupport._id)
        .send({
          name: 'Updated AdminSupport',
          info: 'This is the updated adminSupport!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAdminSupport = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAdminSupport = {};
    });

    it('should respond with the updated adminSupport', function() {
      updatedAdminSupport.name.should.equal('Updated AdminSupport');
      updatedAdminSupport.info.should.equal('This is the updated adminSupport!!!');
    });

  });

  describe('DELETE /api/admin/supports/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/admin/supports/' + newAdminSupport._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when adminSupport does not exist', function(done) {
      request(app)
        .delete('/api/admin/supports/' + newAdminSupport._id)
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
