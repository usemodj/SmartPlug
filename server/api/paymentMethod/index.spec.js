'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var paymentMethodCtrlStub = {
  index: 'paymentMethodCtrl.index',
  show: 'paymentMethodCtrl.show',
  create: 'paymentMethodCtrl.create',
  update: 'paymentMethodCtrl.update',
  destroy: 'paymentMethodCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var paymentMethodIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './paymentMethod.controller': paymentMethodCtrlStub
});

describe('PaymentMethod API Router:', function() {

  it('should return an express router instance', function() {
    paymentMethodIndex.should.equal(routerStub);
  });

  describe('GET /api/paymentMethods', function() {

    it('should route to paymentMethod.controller.index', function() {
      routerStub.get
        .withArgs('/', 'paymentMethodCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/paymentMethods/:id', function() {

    it('should route to paymentMethod.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'paymentMethodCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/paymentMethods', function() {

    it('should route to paymentMethod.controller.create', function() {
      routerStub.post
        .withArgs('/', 'paymentMethodCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/paymentMethods/:id', function() {

    it('should route to paymentMethod.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'paymentMethodCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/paymentMethods/:id', function() {

    it('should route to paymentMethod.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'paymentMethodCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/paymentMethods/:id', function() {

    it('should route to paymentMethod.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'paymentMethodCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
