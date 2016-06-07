'use strict';

var app = require('../..');
import request from 'supertest';

var newVariant;

describe('Variant API:', function() {

  describe('GET /api/variants', function() {
    var variants;

    beforeEach(function(done) {
      request(app)
        .get('/api/variants')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          variants = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      variants.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/variants', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/variants')
        .send({
          name: 'New Variant',
          info: 'This is the brand new variant!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newVariant = res.body;
          done();
        });
    });

    it('should respond with the newly created variant', function() {
      newVariant.name.should.equal('New Variant');
      newVariant.info.should.equal('This is the brand new variant!!!');
    });

  });

  describe('GET /api/variants/:id', function() {
    var variant;

    beforeEach(function(done) {
      request(app)
        .get('/api/variants/' + newVariant._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          variant = res.body;
          done();
        });
    });

    afterEach(function() {
      variant = {};
    });

    it('should respond with the requested variant', function() {
      variant.name.should.equal('New Variant');
      variant.info.should.equal('This is the brand new variant!!!');
    });

  });

  describe('PUT /api/variants/:id', function() {
    var updatedVariant;

    beforeEach(function(done) {
      request(app)
        .put('/api/variants/' + newVariant._id)
        .send({
          name: 'Updated Variant',
          info: 'This is the updated variant!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedVariant = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVariant = {};
    });

    it('should respond with the updated variant', function() {
      updatedVariant.name.should.equal('Updated Variant');
      updatedVariant.info.should.equal('This is the updated variant!!!');
    });

  });

  describe('DELETE /api/variants/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/variants/' + newVariant._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when variant does not exist', function(done) {
      request(app)
        .delete('/api/variants/' + newVariant._id)
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
