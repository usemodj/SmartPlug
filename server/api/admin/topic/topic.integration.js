'use strict';

var app = require('../../..');
import request from 'supertest';

var newAdminTopic;

describe('AdminTopic API:', function() {

  describe('GET /api/admin/topics', function() {
    var adminTopics;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/topics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminTopics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      adminTopics.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/admin/topics', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/admin/topics')
        .send({
          name: 'New AdminTopic',
          info: 'This is the brand new adminTopic!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAdminTopic = res.body;
          done();
        });
    });

    it('should respond with the newly created adminTopic', function() {
      newAdminTopic.name.should.equal('New AdminTopic');
      newAdminTopic.info.should.equal('This is the brand new adminTopic!!!');
    });

  });

  describe('GET /api/admin/topics/:id', function() {
    var adminTopic;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/topics/' + newAdminTopic._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminTopic = res.body;
          done();
        });
    });

    afterEach(function() {
      adminTopic = {};
    });

    it('should respond with the requested adminTopic', function() {
      adminTopic.name.should.equal('New AdminTopic');
      adminTopic.info.should.equal('This is the brand new adminTopic!!!');
    });

  });

  describe('PUT /api/admin/topics/:id', function() {
    var updatedAdminTopic;

    beforeEach(function(done) {
      request(app)
        .put('/api/admin/topics/' + newAdminTopic._id)
        .send({
          name: 'Updated AdminTopic',
          info: 'This is the updated adminTopic!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAdminTopic = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAdminTopic = {};
    });

    it('should respond with the updated adminTopic', function() {
      updatedAdminTopic.name.should.equal('Updated AdminTopic');
      updatedAdminTopic.info.should.equal('This is the updated adminTopic!!!');
    });

  });

  describe('DELETE /api/admin/topics/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/admin/topics/' + newAdminTopic._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when adminTopic does not exist', function(done) {
      request(app)
        .delete('/api/admin/topics/' + newAdminTopic._id)
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
