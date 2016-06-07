'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taxonomyCtrlStub = {
  index: 'taxonomyCtrl.index',
  show: 'taxonomyCtrl.show',
  create: 'taxonomyCtrl.create',
  update: 'taxonomyCtrl.update',
  destroy: 'taxonomyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var taxonomyIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './taxonomy.controller': taxonomyCtrlStub
});

describe('Taxonomy API Router:', function() {

  it('should return an express router instance', function() {
    taxonomyIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonomys', function() {

    it('should route to taxonomy.controller.index', function() {
      routerStub.get
        .withArgs('/', 'taxonomyCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/taxonomys/:id', function() {

    it('should route to taxonomy.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'taxonomyCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/taxonomys', function() {

    it('should route to taxonomy.controller.create', function() {
      routerStub.post
        .withArgs('/', 'taxonomyCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/taxonomys/:id', function() {

    it('should route to taxonomy.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'taxonomyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/taxonomys/:id', function() {

    it('should route to taxonomy.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'taxonomyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/taxonomys/:id', function() {

    it('should route to taxonomy.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'taxonomyCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
