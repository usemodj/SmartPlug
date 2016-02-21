'use strict';

var app = require('../..');
import request from 'supertest';

var newMail;

describe('Mail API:', function() {

  describe('GET /api/mails', function() {
    var mails;

    beforeEach(function(done) {
      request(app)
        .get('/api/mails')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      mails.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/mails', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/mails')
        .send({
          name: 'New Mail',
          info: 'This is the brand new mail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMail = res.body;
          done();
        });
    });

    it('should respond with the newly created mail', function() {
      newMail.name.should.equal('New Mail');
      newMail.info.should.equal('This is the brand new mail!!!');
    });

  });

  describe('GET /api/mails/:id', function() {
    var mail;

    beforeEach(function(done) {
      request(app)
        .get('/api/mails/' + newMail._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          mail = res.body;
          done();
        });
    });

    afterEach(function() {
      mail = {};
    });

    it('should respond with the requested mail', function() {
      mail.name.should.equal('New Mail');
      mail.info.should.equal('This is the brand new mail!!!');
    });

  });

  describe('PUT /api/mails/:id', function() {
    var updatedMail;

    beforeEach(function(done) {
      request(app)
        .put('/api/mails/' + newMail._id)
        .send({
          name: 'Updated Mail',
          info: 'This is the updated mail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMail = {};
    });

    it('should respond with the updated mail', function() {
      updatedMail.name.should.equal('Updated Mail');
      updatedMail.info.should.equal('This is the updated mail!!!');
    });

  });

  describe('DELETE /api/mails/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/mails/' + newMail._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when mail does not exist', function(done) {
      request(app)
        .delete('/api/mails/' + newMail._id)
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
