'use strict';

var app = require('../..');
import request from 'supertest';

var newTopic;

describe('Topic API:', function() {

  describe('GET /api/topics', function() {
    var topics;

    beforeEach(function(done) {
      request(app)
        .get('/api/topics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          topics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      topics.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/topics', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/topics')
        .send({
          name: 'New Topic',
          info: 'This is the brand new topic!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTopic = res.body;
          done();
        });
    });

    it('should respond with the newly created topic', function() {
      newTopic.name.should.equal('New Topic');
      newTopic.info.should.equal('This is the brand new topic!!!');
    });

  });

  describe('GET /api/topics/:id', function() {
    var topic;

    beforeEach(function(done) {
      request(app)
        .get('/api/topics/' + newTopic._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          topic = res.body;
          done();
        });
    });

    afterEach(function() {
      topic = {};
    });

    it('should respond with the requested topic', function() {
      topic.name.should.equal('New Topic');
      topic.info.should.equal('This is the brand new topic!!!');
    });

  });

  describe('PUT /api/topics/:id', function() {
    var updatedTopic;

    beforeEach(function(done) {
      request(app)
        .put('/api/topics/' + newTopic._id)
        .send({
          name: 'Updated Topic',
          info: 'This is the updated topic!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTopic = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTopic = {};
    });

    it('should respond with the updated topic', function() {
      updatedTopic.name.should.equal('Updated Topic');
      updatedTopic.info.should.equal('This is the updated topic!!!');
    });

  });

  describe('DELETE /api/topics/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/topics/' + newTopic._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when topic does not exist', function(done) {
      request(app)
        .delete('/api/topics/' + newTopic._id)
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
