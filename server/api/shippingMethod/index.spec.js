'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var shippingMethodCtrlStub = {
  index: 'shippingMethodCtrl.index',
  show: 'shippingMethodCtrl.show',
  create: 'shippingMethodCtrl.create',
  update: 'shippingMethodCtrl.update',
  destroy: 'shippingMethodCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var shippingMethodIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './shippingMethod.controller': shippingMethodCtrlStub
});

describe('ShippingMethod API Router:', function() {

  it('should return an express router instance', function() {
    shippingMethodIndex.should.equal(routerStub);
  });

  describe('GET /api/shippingMethods', function() {

    it('should route to shippingMethod.controller.index', function() {
      routerStub.get
        .withArgs('/', 'shippingMethodCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/shippingMethods/:id', function() {

    it('should route to shippingMethod.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'shippingMethodCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/shippingMethods', function() {

    it('should route to shippingMethod.controller.create', function() {
      routerStub.post
        .withArgs('/', 'shippingMethodCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/shippingMethods/:id', function() {

    it('should route to shippingMethod.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'shippingMethodCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/shippingMethods/:id', function() {

    it('should route to shippingMethod.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'shippingMethodCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/shippingMethods/:id', function() {

    it('should route to shippingMethod.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'shippingMethodCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
