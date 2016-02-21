'use strict';

var app = require('../..');
import request from 'supertest';

var newSupport;

describe('Support API:', function() {

  describe('GET /api/supports', function() {
    var supports;

    beforeEach(function(done) {
      request(app)
        .get('/api/supports')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          supports = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      supports.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/supports', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/supports')
        .send({
          name: 'New Support',
          info: 'This is the brand new support!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSupport = res.body;
          done();
        });
    });

    it('should respond with the newly created support', function() {
      newSupport.name.should.equal('New Support');
      newSupport.info.should.equal('This is the brand new support!!!');
    });

  });

  describe('GET /api/supports/:id', function() {
    var support;

    beforeEach(function(done) {
      request(app)
        .get('/api/supports/' + newSupport._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          support = res.body;
          done();
        });
    });

    afterEach(function() {
      support = {};
    });

    it('should respond with the requested support', function() {
      support.name.should.equal('New Support');
      support.info.should.equal('This is the brand new support!!!');
    });

  });

  describe('PUT /api/supports/:id', function() {
    var updatedSupport;

    beforeEach(function(done) {
      request(app)
        .put('/api/supports/' + newSupport._id)
        .send({
          name: 'Updated Support',
          info: 'This is the updated support!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSupport = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSupport = {};
    });

    it('should respond with the updated support', function() {
      updatedSupport.name.should.equal('Updated Support');
      updatedSupport.info.should.equal('This is the updated support!!!');
    });

  });

  describe('DELETE /api/supports/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/supports/' + newSupport._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when support does not exist', function(done) {
      request(app)
        .delete('/api/supports/' + newSupport._id)
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
