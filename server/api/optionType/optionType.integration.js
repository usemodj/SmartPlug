'use strict';

var app = require('../..');
import request from 'supertest';

var newOptionType;

describe('OptionType API:', function() {

  describe('GET /api/optionTypes', function() {
    var optionTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/optionTypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          optionTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      optionTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/optionTypes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/optionTypes')
        .send({
          name: 'New OptionType',
          info: 'This is the brand new optionType!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOptionType = res.body;
          done();
        });
    });

    it('should respond with the newly created optionType', function() {
      newOptionType.name.should.equal('New OptionType');
      newOptionType.info.should.equal('This is the brand new optionType!!!');
    });

  });

  describe('GET /api/optionTypes/:id', function() {
    var optionType;

    beforeEach(function(done) {
      request(app)
        .get('/api/optionTypes/' + newOptionType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          optionType = res.body;
          done();
        });
    });

    afterEach(function() {
      optionType = {};
    });

    it('should respond with the requested optionType', function() {
      optionType.name.should.equal('New OptionType');
      optionType.info.should.equal('This is the brand new optionType!!!');
    });

  });

  describe('PUT /api/optionTypes/:id', function() {
    var updatedOptionType;

    beforeEach(function(done) {
      request(app)
        .put('/api/optionTypes/' + newOptionType._id)
        .send({
          name: 'Updated OptionType',
          info: 'This is the updated optionType!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOptionType = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOptionType = {};
    });

    it('should respond with the updated optionType', function() {
      updatedOptionType.name.should.equal('Updated OptionType');
      updatedOptionType.info.should.equal('This is the updated optionType!!!');
    });

  });

  describe('DELETE /api/optionTypes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/optionTypes/' + newOptionType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when optionType does not exist', function(done) {
      request(app)
        .delete('/api/optionTypes/' + newOptionType._id)
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
