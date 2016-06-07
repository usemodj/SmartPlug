'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var addressCtrlStub = {
  index: 'addressCtrl.index',
  show: 'addressCtrl.show',
  create: 'addressCtrl.create',
  update: 'addressCtrl.update',
  destroy: 'addressCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var addressIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './address.controller': addressCtrlStub
});

describe('Address API Router:', function() {

  it('should return an express router instance', function() {
    addressIndex.should.equal(routerStub);
  });

  describe('GET /api/addresses', function() {

    it('should route to address.controller.index', function() {
      routerStub.get
        .withArgs('/', 'addressCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/addresses/:id', function() {

    it('should route to address.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'addressCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/addresses', function() {

    it('should route to address.controller.create', function() {
      routerStub.post
        .withArgs('/', 'addressCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/addresses/:id', function() {

    it('should route to address.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'addressCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/addresses/:id', function() {

    it('should route to address.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'addressCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/addresses/:id', function() {

    it('should route to address.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'addressCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
