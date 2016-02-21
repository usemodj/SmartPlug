'use strict';

var app = require('../../..');
import request from 'supertest';

var newAdminForum;

describe('AdminForum API:', function() {

  describe('GET /api/admin/forums', function() {
    var adminForums;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/forums')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminForums = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      adminForums.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/admin/forums', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/admin/forums')
        .send({
          name: 'New AdminForum',
          info: 'This is the brand new adminForum!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAdminForum = res.body;
          done();
        });
    });

    it('should respond with the newly created adminForum', function() {
      newAdminForum.name.should.equal('New AdminForum');
      newAdminForum.info.should.equal('This is the brand new adminForum!!!');
    });

  });

  describe('GET /api/admin/forums/:id', function() {
    var adminForum;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/forums/' + newAdminForum._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          adminForum = res.body;
          done();
        });
    });

    afterEach(function() {
      adminForum = {};
    });

    it('should respond with the requested adminForum', function() {
      adminForum.name.should.equal('New AdminForum');
      adminForum.info.should.equal('This is the brand new adminForum!!!');
    });

  });

  describe('PUT /api/admin/forums/:id', function() {
    var updatedAdminForum;

    beforeEach(function(done) {
      request(app)
        .put('/api/admin/forums/' + newAdminForum._id)
        .send({
          name: 'Updated AdminForum',
          info: 'This is the updated adminForum!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAdminForum = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAdminForum = {};
    });

    it('should respond with the updated adminForum', function() {
      updatedAdminForum.name.should.equal('Updated AdminForum');
      updatedAdminForum.info.should.equal('This is the updated adminForum!!!');
    });

  });

  describe('DELETE /api/admin/forums/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/admin/forums/' + newAdminForum._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when adminForum does not exist', function(done) {
      request(app)
        .delete('/api/admin/forums/' + newAdminForum._id)
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
