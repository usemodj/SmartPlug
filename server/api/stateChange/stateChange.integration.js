'use strict';

var app = require('../..');
import request from 'supertest';

var newStateChange;

describe('StateChange API:', function() {

  describe('GET /api/stateChanges', function() {
    var stateChanges;

    beforeEach(function(done) {
      request(app)
        .get('/api/stateChanges')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          stateChanges = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      stateChanges.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/stateChanges', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/stateChanges')
        .send({
          name: 'New StateChange',
          info: 'This is the brand new stateChange!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newStateChange = res.body;
          done();
        });
    });

    it('should respond with the newly created stateChange', function() {
      newStateChange.name.should.equal('New StateChange');
      newStateChange.info.should.equal('This is the brand new stateChange!!!');
    });

  });

  describe('GET /api/stateChanges/:id', function() {
    var stateChange;

    beforeEach(function(done) {
      request(app)
        .get('/api/stateChanges/' + newStateChange._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          stateChange = res.body;
          done();
        });
    });

    afterEach(function() {
      stateChange = {};
    });

    it('should respond with the requested stateChange', function() {
      stateChange.name.should.equal('New StateChange');
      stateChange.info.should.equal('This is the brand new stateChange!!!');
    });

  });

  describe('PUT /api/stateChanges/:id', function() {
    var updatedStateChange;

    beforeEach(function(done) {
      request(app)
        .put('/api/stateChanges/' + newStateChange._id)
        .send({
          name: 'Updated StateChange',
          info: 'This is the updated stateChange!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedStateChange = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStateChange = {};
    });

    it('should respond with the updated stateChange', function() {
      updatedStateChange.name.should.equal('Updated StateChange');
      updatedStateChange.info.should.equal('This is the updated stateChange!!!');
    });

  });

  describe('DELETE /api/stateChanges/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/stateChanges/' + newStateChange._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when stateChange does not exist', function(done) {
      request(app)
        .delete('/api/stateChanges/' + newStateChange._id)
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
