'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var shipmentCtrlStub = {
  index: 'shipmentCtrl.index',
  show: 'shipmentCtrl.show',
  create: 'shipmentCtrl.create',
  update: 'shipmentCtrl.update',
  destroy: 'shipmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var shipmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './shipment.controller': shipmentCtrlStub
});

describe('Shipment API Router:', function() {

  it('should return an express router instance', function() {
    shipmentIndex.should.equal(routerStub);
  });

  describe('GET /api/shipments', function() {

    it('should route to shipment.controller.index', function() {
      routerStub.get
        .withArgs('/', 'shipmentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/shipments/:id', function() {

    it('should route to shipment.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'shipmentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/shipments', function() {

    it('should route to shipment.controller.create', function() {
      routerStub.post
        .withArgs('/', 'shipmentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/shipments/:id', function() {

    it('should route to shipment.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'shipmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/shipments/:id', function() {

    it('should route to shipment.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'shipmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/shipments/:id', function() {

    it('should route to shipment.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'shipmentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
