'use strict';

var app = require('../..');
import request from 'supertest';

var newForum;

describe('Forum API:', function() {

  describe('GET /api/forums', function() {
    var forums;

    beforeEach(function(done) {
      request(app)
        .get('/api/forums')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          forums = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      forums.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/forums', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/forums')
        .send({
          name: 'New Forum',
          info: 'This is the brand new forum!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newForum = res.body;
          done();
        });
    });

    it('should respond with the newly created forum', function() {
      newForum.name.should.equal('New Forum');
      newForum.info.should.equal('This is the brand new forum!!!');
    });

  });

  describe('GET /api/forums/:id', function() {
    var forum;

    beforeEach(function(done) {
      request(app)
        .get('/api/forums/' + newForum._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          forum = res.body;
          done();
        });
    });

    afterEach(function() {
      forum = {};
    });

    it('should respond with the requested forum', function() {
      forum.name.should.equal('New Forum');
      forum.info.should.equal('This is the brand new forum!!!');
    });

  });

  describe('PUT /api/forums/:id', function() {
    var updatedForum;

    beforeEach(function(done) {
      request(app)
        .put('/api/forums/' + newForum._id)
        .send({
          name: 'Updated Forum',
          info: 'This is the updated forum!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedForum = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedForum = {};
    });

    it('should respond with the updated forum', function() {
      updatedForum.name.should.equal('Updated Forum');
      updatedForum.info.should.equal('This is the updated forum!!!');
    });

  });

  describe('DELETE /api/forums/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/forums/' + newForum._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when forum does not exist', function(done) {
      request(app)
        .delete('/api/forums/' + newForum._id)
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
