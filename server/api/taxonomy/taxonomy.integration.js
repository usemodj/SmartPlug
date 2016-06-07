'use strict';

var app = require('../..');
import request from 'supertest';

var newTaxonomy;

describe('Taxonomy API:', function() {

  describe('GET /api/taxonomys', function() {
    var taxonomys;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonomys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          taxonomys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      taxonomys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/taxonomys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/taxonomys')
        .send({
          name: 'New Taxonomy',
          info: 'This is the brand new taxonomy!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTaxonomy = res.body;
          done();
        });
    });

    it('should respond with the newly created taxonomy', function() {
      newTaxonomy.name.should.equal('New Taxonomy');
      newTaxonomy.info.should.equal('This is the brand new taxonomy!!!');
    });

  });

  describe('GET /api/taxonomys/:id', function() {
    var taxonomy;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonomys/' + newTaxonomy._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          taxonomy = res.body;
          done();
        });
    });

    afterEach(function() {
      taxonomy = {};
    });

    it('should respond with the requested taxonomy', function() {
      taxonomy.name.should.equal('New Taxonomy');
      taxonomy.info.should.equal('This is the brand new taxonomy!!!');
    });

  });

  describe('PUT /api/taxonomys/:id', function() {
    var updatedTaxonomy;

    beforeEach(function(done) {
      request(app)
        .put('/api/taxonomys/' + newTaxonomy._id)
        .send({
          name: 'Updated Taxonomy',
          info: 'This is the updated taxonomy!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTaxonomy = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTaxonomy = {};
    });

    it('should respond with the updated taxonomy', function() {
      updatedTaxonomy.name.should.equal('Updated Taxonomy');
      updatedTaxonomy.info.should.equal('This is the updated taxonomy!!!');
    });

  });

  describe('DELETE /api/taxonomys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/taxonomys/' + newTaxonomy._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when taxonomy does not exist', function(done) {
      request(app)
        .delete('/api/taxonomys/' + newTaxonomy._id)
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
