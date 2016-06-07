'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var variantCtrlStub = {
  index: 'variantCtrl.index',
  show: 'variantCtrl.show',
  create: 'variantCtrl.create',
  update: 'variantCtrl.update',
  destroy: 'variantCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var variantIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './variant.controller': variantCtrlStub
});

describe('Variant API Router:', function() {

  it('should return an express router instance', function() {
    variantIndex.should.equal(routerStub);
  });

  describe('GET /api/variants', function() {

    it('should route to variant.controller.index', function() {
      routerStub.get
        .withArgs('/', 'variantCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/variants/:id', function() {

    it('should route to variant.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'variantCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/variants', function() {

    it('should route to variant.controller.create', function() {
      routerStub.post
        .withArgs('/', 'variantCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/variants/:id', function() {

    it('should route to variant.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'variantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/variants/:id', function() {

    it('should route to variant.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'variantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/variants/:id', function() {

    it('should route to variant.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'variantCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
