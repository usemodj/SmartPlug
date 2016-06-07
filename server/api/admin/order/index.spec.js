'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminOrderCtrlStub = {
  index: 'adminOrderCtrl.index',
  show: 'adminOrderCtrl.show',
  create: 'adminOrderCtrl.create',
  update: 'adminOrderCtrl.update',
  destroy: 'adminOrderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adminOrderIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './order.controller': adminOrderCtrlStub
});

describe('AdminOrder API Router:', function() {

  it('should return an express router instance', function() {
    adminOrderIndex.should.equal(routerStub);
  });

  describe('GET /api/admin/orders', function() {

    it('should route to adminOrder.controller.index', function() {
      routerStub.get
        .withArgs('/', 'adminOrderCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/admin/orders/:id', function() {

    it('should route to adminOrder.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'adminOrderCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/admin/orders', function() {

    it('should route to adminOrder.controller.create', function() {
      routerStub.post
        .withArgs('/', 'adminOrderCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/admin/orders/:id', function() {

    it('should route to adminOrder.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'adminOrderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/admin/orders/:id', function() {

    it('should route to adminOrder.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'adminOrderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/admin/orders/:id', function() {

    it('should route to adminOrder.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'adminOrderCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
